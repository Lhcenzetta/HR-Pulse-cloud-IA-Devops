"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PredictorForm from '../components/PredictorForm';
import JobList from '../components/JobList';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('predictor');
    const [token] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    });
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
        }
    }, [token, router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (!token) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-xl font-bold tracking-tight dark:text-white">HR-Pulse <span className="text-blue-600">.</span></h2>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Admin Dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('predictor')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'predictor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                        <span>🔮</span>
                        <span className="font-semibold">Salary Predictor</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                        <span>💼</span>
                        <span className="font-semibold">Job Insights</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all font-semibold"
                    >
                        <span>🚪</span>
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="px-10 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
                    <h1 className="text-2xl font-bold dark:text-white">
                        {activeTab === 'predictor' ? 'Salary Prediction' : 'Explore Job Offers'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full border-2 border-white shadow-sm" />
                    </div>
                </header>

                <div className="p-10 max-w-6xl mx-auto">
                    {activeTab === 'predictor' ? <PredictorForm /> : <JobList />}
                </div>
            </main>
        </div>
    );
}
