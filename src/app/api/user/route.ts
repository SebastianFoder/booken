import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Base configuration for MongoDB API
const config = {
    apiKey: process.env.DB_API_KEY,
    endPoint: process.env.DB_END_POINT,
    dataSource: process.env.DB_SOURCE,
    database: process.env.DB_NAME,
    collection: 'users',
};

// JWT Secret from environment variables
const AUTH_SECRET = process.env.AUTH_SECRET || 'your-default-secret';

// Helper function to create request structure for MongoDB
const createRequestData = (requestData?: any) => {
    return {
        dataSource: config.dataSource,
        database: config.database,
        collection: config.collection,
        ...requestData,
    };
};

// POST request handler for fetching user information
export async function POST(req: NextRequest): Promise<NextResponse<{ success: boolean, username?: string, authLevel?: number, error?: string }>> {
    try {
        // Extract token from the request headers
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authorization header missing or invalid', success: false }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify the JWT token
        const decodedToken: any = jwt.verify(token, AUTH_SECRET);

        // Fetch user from the database
        const requestData = createRequestData({
            filter: { _id: { $oid: decodedToken._id } }
        });

        const response = await axios.post(`${config.endPoint}/action/findOne`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': config.apiKey,
            },
        });

        const data = response.data.document;

        if (!data) {
            return NextResponse.json({ error: 'User not found', success: false }, { status: 404 });
        }

        // Return user information
        return NextResponse.json({
            success: true,
            username: data.username,
            authLevel: data.authLevel,
        });

    } catch (error) {
        console.error('Failed to fetch user information:', error);
        return NextResponse.json({ error: 'Failed to fetch user information', success: false }, { status: 500 });
    }
}
