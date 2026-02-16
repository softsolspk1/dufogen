'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function IntroScreen() {
    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/background.svg"
                    alt="Background Pattern"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute top-1/4 -right-10 w-48 h-48 bg-plum/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -left-10 w-32 h-32 bg-lavender-soft/50 rounded-full blur-xl animate-float"></div>
            </div>

            <div className="z-10 w-full max-w-sm flex flex-col gap-6">

                <div className="mb-4">
                    {/* Icon Placeholder - Abstract Female Silhouette or Cycle */}
                    {/* Removed the old SVG icon */}
                </div>

                <div className="relative w-32 h-12 mb-4">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h1 className="text-2xl font-bold text-plum-dark">
                    The Cycle Balance Challenge
                </h1>

                <p className="text-clinical text-lg">
                    "Explore real-world gynecological scenarios and strengthen clinical decision-making in hormonal balance."
                </p>

                <Link href="/dashboard" className="w-full mt-4">
                    <Button fullWidth size="lg">Start Cases</Button>
                </Link>
            </div>
        </div>
    );
}
