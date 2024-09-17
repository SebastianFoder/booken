'use client';

import { useContext, useEffect} from "react";
import { AuthContext } from "./authProvider";
import { useRouter } from "next/navigation";

interface AuthPageGatewayProps {
    authLevel: number;
    children?: React.ReactNode;
}

export default function AuthPageGateway({ authLevel, children}: AuthPageGatewayProps) {
    const { userAuthLevel, isLoading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if(!isLoading){
            if(userAuthLevel < authLevel){
                router.push('/auth/login');
            }
        }
        
    }, [userAuthLevel, isLoading]);

    return children;
}