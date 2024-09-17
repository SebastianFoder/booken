'use client';
import { useEffect } from "react";
import { mutate } from "swr";

export default function SignOut(){
    useEffect(() => {
        localStorage.removeItem('token');
        return(() => {
            mutate(`${process.env.NEXT_PUBLIC_URL}/api/user`);
        })
    });

    return(
        <main>
            <section>
                <article style={{gap: '1rem'}}>
                    <h1>Sign Out</h1>
                    <p>You&apos;ve successfully been signed out</p>
                </article>
            </section>
        </main>
    )
}