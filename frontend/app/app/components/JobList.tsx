"use client";
import React, { useState, useEffect } from 'react';

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    skills: string;
}

export default function JobList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/get_all_jobs_with_skills`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                } else {
                    setError('Unable to load jobs.');
                }
            } catch (err) {
                setError('Network error while fetching jobs.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>;

    return (
        <div className="relative">
            {error && <div className="mb-4 text-red-500 font-medium">{error}</div>}

            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-bold dark:text-white group-hover:text-blue-600 transition-colors">{job.title || 'Data Scientist'}</h3>
                            <div className="flex items-center space-x-3 text-sm text-zinc-500 mt-1">
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{job.company || 'Azure Corp'}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                <span>{job.location || 'Remote'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-blue-600 font-bold dark:text-blue-400">{job.salary || '$120k - $160k'}</span>
                            <div className="flex gap-2 mt-2">
                                {(job.skills?.split(',') || ['Python', 'Azure']).slice(0, 2).map(skill => (
                                    <span key={skill} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold uppercase tracking-tight dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Detail Modal Overlay */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 relative bg-gradient-to-br from-blue-50 to-white dark:from-zinc-800/50 dark:to-zinc-900">
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                ✕
                            </button>
                            <h2 className="text-3xl font-black dark:text-white leading-tight">{selectedJob.title || 'Data Scientist'}</h2>
                            <p className="text-blue-600 font-bold text-lg mt-2">{selectedJob.company || 'Azure Corp'}</p>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Job Description</h4>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                    {selectedJob.description || 'We are looking for a senior ML engineer to join our cloud infrastructure team...'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedJob.skills?.split(',') || ['Python', 'Cloud', 'Azure', 'MLOps']).map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-zinc-50 dark:bg-zinc-800/30 flex justify-between items-center">
                            <span className="text-zinc-500 text-sm italic">ID: #{selectedJob.id}</span>
                            <button className="px-8 py-3 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
