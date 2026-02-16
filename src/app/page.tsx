import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function WelcomeScreen() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: '#EDE1F2', minHeight: '100vh', color: '#1F2937' }}>

      {/* Background Soft Animation - CSS only */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-plum/10 rounded-full blur-3xl animate-pulse-slow" style={{ backgroundColor: 'rgba(123, 63, 140, 0.1)' }}></div>
        <div className="absolute top-40 -right-20 w-60 h-60 bg-lavender-soft/50 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(248, 241, 250, 0.5)' }}></div>
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col gap-8 text-center">

        {/* Logo */}
        <div className="relative w-48 h-20 mb-6 drop-shadow-xl animate-float mx-auto">
          <Image
            src="/logo.svg"
            alt="DUFOGEN Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold text-plum-dark leading-tight" style={{ color: '#5A2A68' }}>
          The Cycle Balance <br /> <span className="text-plum" style={{ color: '#7B3F8C' }}>Challenge</span>
        </h1>

        <div className="glass-card text-left border-l-4 border-plum bg-white/60 p-6 rounded-2xl shadow-xl" style={{ borderLeftColor: '#7B3F8C', backgroundColor: 'rgba(255,255,255,0.6)' }}>
          <h3 className="text-plum font-semibold mb-2 flex items-center gap-2" style={{ color: '#7B3F8C' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
            Disclaimer
          </h3>
          <p className="text-sm text-clinical leading-relaxed" style={{ color: '#6B7280' }}>
            "This educational experience is designed for registered medical professionals only.
            Clinical scenarios are simulated for learning purposes and do not replace clinical judgment."
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/verify" className="w-full block">
            <button className="w-full py-3 px-6 rounded-xl font-semibold transition-all shadow-md bg-plum text-white hover:bg-plum-dark" style={{ backgroundColor: '#7B3F8C', color: 'white' }}>
              Enter Experience
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
