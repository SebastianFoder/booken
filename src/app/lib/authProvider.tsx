'use client';

import axios from "axios";
import { createContext, ReactNode, useState } from "react";
import useSWR from "swr";

interface AuthContextProps {
    userAuthLevel: number;
    username: string;
    error: string | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

const API_URL = `${process.env.NEXT_PUBLIC_URL}/api/user`;

// Define the fetcher function to fetch user information
const fetcher = (url: string) => {
    const token = localStorage.getItem('authToken');
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
    error: null
});
export default function AuthProvider(){

    const [userAuthLevel, setUserAuthLevel] = useState<number>(0);
    const [username, setUsername] = useState<string>('');

    const {data, error} = useSWR(API_URL, fetcher, { 
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,        
    });


    return(
        <></>
    )
}