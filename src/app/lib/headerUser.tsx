'use client';

import { useContext } from "react";
import { AuthContext } from "./authProvider";
import NavLink from "@/components/navlink";

export default function HeaderUser(){
    const user = useContext(AuthContext);

    if(user.username.length <= 0 || user.error) return(
        <span className="btn">
            <NavLink href="/auth/login">
                Log In
            </NavLink>
        </span>
        
    )

    return(
        <span className="btn btn-red">
            <NavLink href="/auth/signout">
                Log Out
            </NavLink>
        </span>
    )
}