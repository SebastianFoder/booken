'use client';

import { useContext} from "react";
import { AuthContext } from "./authProvider";

interface AuthGatewayProps {
    authLevel: number;
    children?: React.ReactNode;
}

export default function AuthGateway({ authLevel, children }: AuthGatewayProps) {
    const { userAuthLevel } = useContext(AuthContext);

    if(authLevel <= 0) return children;
    if(userAuthLevel && userAuthLevel >= authLevel) return children;
    return null;
}