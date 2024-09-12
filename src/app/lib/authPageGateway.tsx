'use client';

import { useContext} from "react";
import { AuthContext } from "./authProvider";
import { useRouter } from "next/navigation";

interface AuthPageGatewayProps {
    authLevel: number;
    children?: React.ReactNode;
}

export default function AuthPageGateway({ authLevel, children}: AuthPageGatewayProps) {
    const { userAuthLevel } = useContext(AuthContext);
    const router = useRouter();

    if(userAuthLevel < authLevel){
        router.push('/auth/login');
    }
    return children;
}