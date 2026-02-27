"use client";
import React, { useState } from 'react';

export default function PredictorForm() {
    const [formData, setFormData] = useState({
        rating: 4.0,
        age: 30,
        size: 'Large',
        type_of_ownership: 'Public',
        industry: 'Tech',
        sector: 'Information Technology'
    });
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/Predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data[0] || data);
            } else {
                setError(data.detail || 'Failed to get prediction.');
            }
        } catch (err) {
            setError('Error connecting to the prediction server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold mb-6 dark:text-white">Estimate Market Value</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Rating (1-5)</label>
                            <input
                                type="number" step="0.1" max="5" min="0"
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Age</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Company Size</label>
                        <select
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        >
                            <option>Small</option><option>Medium</option><option>Large</option><option>Enterprise</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Ownership</label>
                        <select
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            value={formData.type_of_ownership}
                            onChange={(e) => setFormData({ ...formData, type_of_ownership: e.target.value })}
                        >
                            <option>Public</option><option>Private</option><option>Non-profit</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Industry</label>
                        <input
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Sector</label>
                        <input
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            value={formData.sector}
                            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 dark:bg-white dark:text-black text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-zinc-200 dark:shadow-none"
                    >
                        {loading ? <div className="h-5 w-5 border-2 border-zinc-400 border-t-white dark:border-t-black rounded-full animate-spin" /> : <><span>Run Prediction</span><span>🚀</span></>}
                    </button>
                </form>
            </div>

            <div className="flex flex-col">
                <div className="flex-1 bg-blue-600 rounded-3xl p-10 text-white flex flex-col justify-center items-center text-center shadow-xl shadow-blue-100 dark:shadow-none mb-6">
                    <h4 className="text-blue-100 uppercase tracking-widest font-bold text-xs mb-2">Result Analysis</h4>
                    {result ? (
                        <div className="animate-in zoom-in duration-500">
                            <span className="text-sm opacity-80 block mb-1">Estimated Annual Salary</span>
                            <span className="text-5xl font-black">{result.split(':')[1]?.trim() || result}</span>
                        </div>
                    ) : (
                        <div className="opacity-50">
                            <div className="text-6xl mb-4">??</div>
                            <p>Fill in the details to see the predicted salary range based on AI models.</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 p-4 border border-red-100 dark:border-red-900 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                        ⚠️ {error}
                    </div>
                )}
            </div>
        </div>
    );
}
