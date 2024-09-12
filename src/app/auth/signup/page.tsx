'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

async function signup(username: string, password: string, router: AppRouterInstance) {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/signup`, {
            username,
            password
        });

        const { token } = response.data;

        // Save the JWT token in localStorage (or handle it as needed)
        localStorage.setItem('token', token);

        const referrer = document.referrer;
        const isFromOrd = referrer.includes(process.env.NEXT_PUBLIC_URL || '');

        if (isFromOrd) {
            router.back();
        } else {
            // Fall back to / if not from the expected route
            router.push('/');
        }
        router.push('/');

        return response.data;
    } catch (error: any) {
        console.error(error);
        return { error: error.response?.data?.error || 'Signup failed' };
    }
}

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await signup(username, password, router);

        if (result.error) {
            setError(result.error);
        }
    };

    return (
        <main>
            <section>
                <article>
                    <h1>Sign Up</h1>
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
                            <button className='btn' type="submit">Sign Up</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </article>
            </section>
        </main>
    );
}
