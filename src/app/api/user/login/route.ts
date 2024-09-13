import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcrypt-ts';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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

// POST request handler for logging in a user (Authenticate)
export async function POST(req: NextRequest): Promise<NextResponse<{ success: boolean, token?: string, error?: string }>> {
    try {
        const body = await req.json();
        const { username, password } = body;

        // Ensure both username and password are provided
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required', success: false }, { status: 400 });
        }

        // Find the user in MongoDB by username
        const findRequestData = createRequestData({
            filter: {
                username,
            },
        });

        const response = await axios.post(`${config.endPoint}/action/findOne`, findRequestData, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': config.apiKey,
            },
        });

        const user = response.data.document;

        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password', success: false }, { status: 401 });
        }

        // Compare the hashed password in the database with the one provided by the user
        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid username or password', success: false }, { status: 401 });
        }

        // Generate a JWT token for the user
        const token = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                authLevel: user.authLevel,
            },
            AUTH_SECRET, // Secret key
        );

        // Return the token
        return NextResponse.json({ success: true, token });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to login', success: false }, { status: 500 });
    }
}
