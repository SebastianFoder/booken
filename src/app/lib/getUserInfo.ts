import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_URL}/api/user`;

/**
 * Function to get user info from the API using a JWT token.
 * @param token - The JWT token to be used for authentication.
 * @returns The user information or null if there is an error.
 */
export async function getUserInfo(token: string): Promise<{ username: string; authLevel: number } | null> {
    try {
        // Make the API call to fetch user information
        const response = await axios.post(API_URL, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Return the user information from the API response
        return response.data;
    } catch (error) {
        console.error('Failed to get user information:', error);
        return null;
    }
}
