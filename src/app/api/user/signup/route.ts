import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt-ts';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { IUser } from '@/app/api/user/user-schema';

// Base configuration for MongoDB API
const config = {
    apiKey: process.env.DB_API_KEY,
    endPoint: process.env.DB_END_POINT,
    dataSource: process.env.DB_SOURCE,
    database: process.env.DB_NAME,
    collection: 'users',
};

// JWT Secret from environment variables
const AUTH_SECRET = process.env.AUTH_SECRET || 'dillermand';

// Helper function to create request structure for MongoDB
const createRequestData = (requestData?: any) => {
    return {
        dataSource: config.dataSource,
        database: config.database,
        collection: config.collection,
        ...requestData,
    };
};

// Helper function to check if a user already exists
const userExists = async (username: string) => {
    const requestData = createRequestData({
        filter: { username },
    });

    const response = await axios.post(`${config.endPoint}/action/findOne`, requestData, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': config.apiKey,
        },
    });

    return response.data.document !== null;
};

// POST request handler for registering a new user (Create)
export async function POST(req: NextRequest): Promise<NextResponse<{ success: boolean, insertedId?: string, token?: string, error?: string }>> {
    try {
        const body = await req.json();
        const { username, password } = body;

        // Ensure both username and password are provided
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required', success: false }, { status: 400 });
        }

        if (username.length < 4) {
            return NextResponse.json({ error: 'Username must be at least 4 characters long', success: false }, { status: 400 });
        }

        // Check if the username already exists
        const exists = await userExists(username);
        if (exists) {
            return NextResponse.json({ error: 'Username is already taken', success: false }, { status: 400 });
        }

        // Hash the password using bcrypt-ts
        const hashedPassword = await hash(password, 10); // Salt rounds: 10

        // Define the new user with the default authLevel set to 0
        const newUser: Omit<IUser, '_id'> = {
            username,
            password: hashedPassword,
            authLevel: 0, // Default auth level
        };

        // Create request data for MongoDB insertOne operation
        const requestData = createRequestData({
            document: newUser,
        });

        // Send the request to insert the new user into MongoDB
        const response = await axios.post(`${config.endPoint}/action/insertOne`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': config.apiKey,
            },
        });

        const data = response.data;
        const insertedId = data.insertedId;

        if (!insertedId) {
            return NextResponse.json({ error: 'Failed to insert user', success: false }, { status: 500 });
        }

        // Generate a JWT token for the user
        const token = jwt.sign(
            {
                _id: insertedId,
                username: newUser.username,
                authLevel: newUser.authLevel,
            },
            AUTH_SECRET, // Secret key
        );

        // Return the inserted document ID and the token
        return NextResponse.json({ success: true, insertedId, token });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to register user', success: false }, { status: 500 });
    }
}
