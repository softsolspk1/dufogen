'use client';

import { motion } from 'framer-motion';

interface OutcomeAnimationProps {
    type: 'success' | 'neutral' | 'error';
}

export const OutcomeAnimation: React.FC<OutcomeAnimationProps> = ({ type }) => {
    const isSuccess = type === 'success';
    const color = isSuccess ? '#10B981' : '#F59E0B'; // Green vs Amber

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`w-32 h-32 rounded-full flex items-center justify-center border-4 relative overflow-hidden bg-white shadow-xl`}
                style={{ borderColor: color }}
            >
                {isSuccess ? (
                    <svg width="60" height="60" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                            d="M10 25 L20 35 L40 15"
                            stroke={color}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                    </svg>
                ) : (
                    <svg width="60" height="60" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.line
                            x1="25" y1="10" x2="25" y2="30"
                            stroke={color} strokeWidth="5" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }}
                        />
                        <motion.circle
                            cx="25" cy="40" r="3" fill={color}
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2, delay: 0.5 }}
                        />
                    </svg>
                )}

                {/* Ripple Effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: `4px solid ${color}` }}
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-xl font-bold tracking-wide uppercase"
                style={{ color: color }}
            >
                {isSuccess ? 'Clinical Goal Achieved' : 'Review Scenario'}
            </motion.p>
        </div>
    );
};
