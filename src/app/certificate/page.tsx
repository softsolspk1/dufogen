'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CertificateScreen() {
    const [doctorName, setDoctorName] = useState('');
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    useEffect(() => {
        const doctorData = localStorage.getItem('dufogen_doctor');
        if (doctorData) {
            setDoctorName(JSON.parse(doctorData).name);
        }
    }, []);

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6">

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-sm text-center space-y-6"
            >
                <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center text-4xl mb-4">
                    🏆
                </div>

                <h1 className="text-2xl font-bold text-plum-dark">Challenge Completed!</h1>
                <p className="text-gray-600">
                    You have successfully completed<br />
                    <span className="font-semibold text-plum">The Cycle Balance Challenge</span>
                </p>

                {/* Certificate Preview Card */}
                <div className="relative bg-white border-8 border-double border-plum/20 p-8 shadow-2xl rotate-1 scale-95 transform transition-transform hover:scale-100 duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/background.svg')] opacity-10 pointer-events-none bg-cover"></div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="relative w-40 h-16">
                                <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
                            </div>
                        </div>

                        <h2 className="text-xl font-serif text-plum-dark border-b border-plum/20 pb-2">Certificate of Completion</h2>

                        <p className="text-sm text-clinical text-center">This certifies that</p>
                        <p className="text-xl font-bold text-gray-800 font-serif border-b-2 border-dashed border-gray-300 pb-1 mb-2">
                            {doctorName || 'Dr. Name'}
                        </p>
                        <p className="text-xs text-clinical">
                            has demonstrated commitment to evidence-based care in hormonal balance.
                        </p>

                        <div className="flex justify-between items-end mt-8 pt-4 border-t border-gray-100">
                            <div className="text-left">
                                <p className="text-[10px] text-gray-400">Date</p>
                                <p className="text-xs font-medium">{today}</p>
                            </div>
                            <div className="text-right">
                                <div className="h-10 w-24 relative ml-auto">
                                    <Image src="/martindowlogo.svg" alt="MD" fill className="object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-6">
                    <Button fullWidth onClick={() => window.print()}>Download Certificate</Button>
                    <Link href="/" className="block">
                        <Button fullWidth variant="secondary">Exit Experience</Button>
                    </Link>
                </div>

                <p className="text-[10px] text-clinical mt-4">
                    "Thank you for your commitment to evidence-based care."
                </p>

            </motion.div>
        </div>
    );
}
