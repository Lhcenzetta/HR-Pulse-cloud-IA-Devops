"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/Signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ 
                    "username": username,
                    "passwordhash": password,
                    "createdate": new Date().toISOString()
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setSuccess('Successfully registered! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.detail || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Unable to connect to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans dark:bg-zinc-950">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 dark:bg-zinc-900 dark:border-zinc-800">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-white">Create Account</h1>
                    <p className="text-slate-500 mt-2 text-sm uppercase tracking-wider font-semibold dark:text-zinc-400">
                        Join HR Analysis Portal
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center">
                            <span className="mr-2">⚠️</span>
                            <p className="font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            <p className="font-medium">{success}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Choose a username"
                            className="modern-input dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="Create a password"
                            className="modern-input dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="Repeat password"
                            className="modern-input dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 disabled:opacity-70 mt-4 flex items-center justify-center dark:shadow-none"
                    >
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-zinc-400">
                    Already have an account?{" "}
                    <button onClick={() => router.push('/login')} className="text-blue-600 font-bold hover:underline dark:text-blue-400">Log in</button>
                </div>
            </div>

            <style jsx>{`
                .modern-input {
                    width: 100%;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 0.85rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                    outline: none;
                }
                .modern-input:focus {
                    background-color: white;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
                :global(.dark) .modern-input:focus {
                    background-color: #18181b;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
                }
            `}</style>
        </div>
    );
}
