'use client';

import { useEffect, useState } from "react";
import { getUserInfo } from "./getUserInfo";

interface AuthGatewayProps {
    authLevel: number;
    children?: React.ReactNode;
}

export default function AuthGateway({ authLevel, children }: AuthGatewayProps) {
    const [userAuthLevel, setUserAuthLevel] = useState<number | null>(null);
    const [rendered, setRendered] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (rendered) return;
            try {
                const token = localStorage.getItem('token'); // Or however you store the token
                if (token) {
                    const userInfo = await getUserInfo(token);
                    if (userInfo) {
                        setUserAuthLevel(userInfo.authLevel);
                    }
                    console.log('User info:', userInfo);
                }
            } catch (error) {
                console.error('Failed to get user information:', error);
            }            
        };

        fetchUserInfo();
        setRendered(true);
    }, []);

    if(authLevel <= 0) return children;
    if(userAuthLevel && userAuthLevel >= authLevel) return children;
    return null;
}