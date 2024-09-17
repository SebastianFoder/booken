import jwt from 'jsonwebtoken';

// JWT Secret from environment variables
const AUTH_SECRET = process.env.AUTH_SECRET || 'dillermand';

export default function HasAuth(req: Request, authLevel: number): {hasAuth: boolean, decodedToken?: any} {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            hasAuth: false,
        };
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the JWT token
    const decodedToken: any = jwt.verify(token, AUTH_SECRET);

    return {
        hasAuth: decodedToken.authLevel >= authLevel,
        decodedToken,
    };

}