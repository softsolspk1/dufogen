import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradient?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, gradient = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-card p-6",
                    gradient ? "bg-gradient-to-br from-white/90 to-lavender/50" : "",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";
