'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function VerifyScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const pmdc = formData.get('pmdc') as string;
        const specialty = formData.get('specialty') as string;

        try {
            const res = await fetch('/api/auth/verify-doctor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, pmdc_number: pmdc, specialty })
            });

            if (!res.ok) {
                const text = await res.text(); // Get raw text first to avoid JSON parse errors
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.error || 'Verification failed (JSON)');
                } catch (e) {
                    throw new Error(`Server Error (${res.status}): ${text.substring(0, 50)}...`);
                }
            }

            const data = await res.json();
            // Store doctor info in localStorage for persistence across session
            localStorage.setItem('dufogen_doctor', JSON.stringify(data.doctor));

            router.push('/intro');
        } catch (err) {
            console.error(err);
            setError('Please check your details and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex flex-col md:flex-row min-h-screen animate-in fade-in duration-700 bg-lavender-soft">

            {/* Left Side - Creative Visual (1.svg) */}
            <div className="hidden md:flex w-1/2 relative bg-plum-dark items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-80 z-0">
                    {/* Assuming 1.svg is the creative asset (woman profile with moon) */}
                    <div className="w-full h-full relative">
                        {/* Fallback color if image fails loading */}
                        <div className="absolute inset-0 bg-gradient-to-br from-plum-dark to-black opacity-60 z-10"></div>
                        {/* Using standard img tag for simplicity and robustness with local file */}
                        <img
                            src="/1.svg"
                            alt="Feminine Cycle Art"
                            className="w-full h-full object-cover mix-blend-overlay opacity-80"
                        />
                    </div>
                </div>

                {/* Overlay Content */}
                <div className="relative z-20 text-center p-8 text-white max-w-md">
                    <h1 className="text-4xl font-bold mb-4 font-serif italic">Balance in Motion</h1>
                    <p className="text-lg opacity-90 font-light">
                        "Understanding the delicate interplay of hormones is key to women's health."
                    </p>
                </div>
            </div>

            {/* Right Side - Verification Form */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative">
                {/* Mobile Background Context */}
                <div className="absolute inset-0 md:hidden z-0 opacity-10 pointer-events-none">
                    <img src="/1.svg" className="w-full h-full object-cover" alt="" />
                </div>

                <Card className="w-full max-w-md relative z-10 shadow-2xl border-t-4 border-plum bg-white/90 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="w-16 h-1 bg-plum mx-auto mb-4 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-plum-dark">Doctor Verification</h2>
                        <p className="text-sm text-clinical mt-2">Please identify yourself to access clinical cases.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Dr. Name</label>
                            <input
                                required
                                name="name"
                                type="text"
                                className="w-full p-3 rounded-xl border border-gray-300 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all bg-white"
                                placeholder="e.g. Dr. Sarah Ahmed"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">PMDC Number</label>
                            <input
                                required
                                name="pmdc"
                                type="text"
                                className="w-full p-3 rounded-xl border border-gray-300 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all bg-white"
                                placeholder="e.g. 12345-P"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Specialty</label>
                            <div className="relative">
                                <select name="specialty" className="w-full p-3 rounded-xl border border-gray-300 focus:border-plum focus:ring-2 focus:ring-plum/20 outline-none transition-all bg-white appearance-none">
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="General Practitioner">General Practitioner</option>
                                    <option value="Endocrinologist">Endocrinologist</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 flex items-center justify-center gap-2">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" /></svg>
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button type="submit" fullWidth disabled={isLoading} className="bg-plum text-white hover:bg-plum-dark shadow-lg shadow-plum/30 transition-all font-bold tracking-wide">
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Verifying...
                                    </span>
                                ) : 'Verify & Continue'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-4">
                        <p className="text-xs text-clinical flex items-center justify-center gap-1">
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /></svg>
                            Secure Professional Access
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
