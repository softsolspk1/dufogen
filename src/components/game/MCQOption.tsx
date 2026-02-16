import React from 'react';
import { Card } from '@/components/ui/Card';
import { clsx } from 'clsx';

interface MCQOptionProps {
    text: string;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export const MCQOption = ({ text, selected, onClick, disabled }: MCQOptionProps) => {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={clsx(
                "cursor-pointer transition-all duration-300 transform",
                disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.01] active:scale-95",
                selected ? "ring-2 ring-plum bg-lavender/50" : "bg-white"
            )}
        >
            <Card className={clsx("p-4 flex items-start gap-3", selected && "border-plum/30")}>
                <div className={clsx(
                    "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0",
                    selected ? "border-plum bg-plum" : "border-gray-300"
                )}>
                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-sm font-medium text-gray-700">{text}</span>
            </Card>
        </div>
    );
};
