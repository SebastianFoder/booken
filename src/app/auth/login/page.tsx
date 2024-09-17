'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { mutate } from 'swr';

async function login(username: string, password: string, router: AppRouterInstance) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/login`, {
            username,
            password
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        mutate(`${process.env.NEXT_PUBLIC_URL}/api/user`);

        const referrer = document.referrer;
        const isFromSite = referrer.includes(process.env.NEXT_PUBLIC_URL || '');

        if (isFromSite && !referrer.includes('/signout')) {
            router.back();
        } else {
            // Fall back to / if not from the expected route
            router.push('/');
        }
        router.push('/');

        return response.data;
    } catch (error : any) {
        return { error: error.response?.data?.error || 'Login failed'};
    }
}

export default function LogIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await login(username, password, router);

        if (result.error) {
            setError(result.error);
        } else {
            // Handle successful login, such as redirecting or updating state
            console.log('Login successful');
        }
    };

    return (
        <main>
            <section>
                <article>
                    <h1>Log In</h1>
                </article>
                <article>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <button className='btn' type="submit">Log In</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error.toString()}</p>}
                    </form>
                </article>
            </section>
        </main>
    );
}
