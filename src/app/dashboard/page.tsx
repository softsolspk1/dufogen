'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

interface Case {
    id: string;
    title: string;
    sequence_order: number;
}

export default function DashboardScreen() {
    const [cases, setCases] = useState<Case[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Hydrate doctor name
        const doctorData = localStorage.getItem('dufogen_doctor');
        if (doctorData) {
            const parsed = JSON.parse(doctorData);
            setDoctorName(parsed.name);
        }

        // Fetch cases
        const fetchCases = async () => {
            try {
                const res = await fetch('/api/cases');
                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                const data = await res.json();
                setCases(data.cases || []);
            } catch (error) {
                console.error('Failed to fetch cases', error);
                setError(error instanceof Error ? error.message : 'Failed to load cases');
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    if (loading) return <div className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-plum"></div></div>;

    if (error) return (
        <div className="flex-grow flex items-center justify-center text-red-600">
            <div className="text-center">
                <p className="font-bold text-lg">⚠️ Error Loading Cases</p>
                <p>{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4 bg-plum text-white">Retry</Button>
            </div>
        </div>
    );

    return (
        <div className="flex-grow flex flex-col p-6 space-y-6">
            <header className="flex justify-between items-center pb-4 border-b border-plum/10">
                <div>
                    <h1 className="text-xl font-bold text-plum-dark">Case Dashboard</h1>
                    <p className="text-sm text-clinical overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">Welcome, {doctorName || 'Doctor'}</p>
                </div>
                {/* Simple Progress Ring Placeholder */}
                <div className="w-10 h-10 rounded-full border-4 border-lavender border-t-plum flex items-center justify-center text-xs font-bold text-plum">
                    {/* Calculate progress if available, else static */}
                    %
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {cases.map((c, index) => (
                    <Link key={c.id} href={`/cases/${c.id}`} className="block">
                        <Card className="hover:scale-[1.02] transition-transform active:scale-95 flex items-center gap-4 p-4 border border-transparent hover:border-plum/30">
                            {/* Case Icon / Number */}
                            <div className="h-12 w-12 rounded-full bg-lavender flex items-center justify-center text-plum font-bold text-lg shrink-0">
                                {c.sequence_order}
                            </div>

                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">{c.title}</h3>
                                <p className="text-xs text-clinical">Tap to start case</p>
                            </div>

                            {/* Status Indicator (Mocked for now, needs real progress link) */}
                            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
