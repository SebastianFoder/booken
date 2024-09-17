'use client';

import axios from "axios";
import { createContext, ReactNode, useState } from "react";
import useSWR from "swr";

interface AuthContextProps {
    userAuthLevel: number;
    username: string;
    error: string | null;
    isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const API_URL = `${process.env.NEXT_PUBLIC_URL}/api/user`;

// Define the fetcher function to fetch user information
const fetcher = (url: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');

    return axios.post(url, {}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }).then(res => res.data);
};

export const AuthContext = createContext<AuthContextProps>({
    userAuthLevel: 0,
    username: '',
    error: null,
    isLoading: true
});
export default function AuthProvider({children}: AuthProviderProps) {

    const [authState, setAuthState] = useState<AuthContextProps>({
        userAuthLevel: 0,
        username: '',
        error: null,
        isLoading: true
    });

    const {} = useSWR(API_URL, fetcher, { 
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,     
        onSuccess: (data) => {
            setAuthState({
                userAuthLevel: data.authLevel,
                username: data.username,
                error: null,
                isLoading: false
            });
        },
        onError: (err) => {
            setAuthState({
                userAuthLevel: 0,
                username: '',
                error: err.message || 'Error fetching user info',
                isLoading: false
            });
        }   
    });


    return(
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    )
}