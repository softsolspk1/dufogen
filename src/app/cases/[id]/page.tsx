'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MCQOption } from '@/components/game/MCQOption';
import { motion, AnimatePresence } from 'framer-motion';
import { OutcomeAnimation } from '@/components/game/OutcomeAnimation';

interface Option {
    id: string;
    text: string;
}

interface Question {
    text: string;
    options: Option[];
}

interface Case {
    id: string;
    title: string;
    description: string; // "Patient Profile..."
    presentation_media_url?: string;
    outcome_media_url?: string;
    questions: Question[];
}

export default function CaseScreen({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params);

    const [caseData, setCaseData] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [view, setView] = useState<'presentation' | 'question' | 'outcome' | 'insight'>('presentation');

    const [nextCaseId, setNextCaseId] = useState<string | null>(null);

    // Outcome Data
    const [outcome, setOutcome] = useState<{ result: string, outcome_text: string, insight_text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/cases/${id}`);
                const data = await res.json();
                if (data.case) {
                    setCaseData(data.case);
                    setNextCaseId(data.nextCaseId);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        if (!selectedOption || !caseData) return;
        setIsSubmitting(true);

        // Robust Doctor Session Check
        let doctorId = null;
        try {
            const doctorData = localStorage.getItem('dufogen_doctor');
            if (doctorData) {
                doctorId = JSON.parse(doctorData).id;
            }
        } catch (e) {
            console.error("Error parsing doctor data", e);
        }

        if (!doctorId) {
            alert("Doctor session not found. Please verify from the home screen.");
            router.push('/verify');
            return;
        }

        try {
            const res = await fetch(`/api/cases/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: doctorId,
                    option_id: selectedOption
                })
            });

            console.log("Response status:", res.status);
            const text = await res.text();
            console.log("Response text:", text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                alert("Server returned invalid response");
                setIsSubmitting(false);
                return;
            }

            if (!res.ok) {
                console.error("API Error Object:", result);
                if (res.status === 401 || result.error === 'Doctor session invalid') {
                    alert("Your session has expired or is invalid. Please verify your details again.");
                    localStorage.removeItem('dufogen_doctor');
                    router.push('/verify');
                } else {
                    alert(result.error || "Failed to submit decision");
                }
                setIsSubmitting(false);
                return;
            }

            setOutcome(result);
            setView('outcome');
        } catch (e) {
            console.error(e);
            alert("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-plum"></div></div>;
    if (!caseData) return <div className="p-6 text-center">Case not found</div>;

    return (
        <div className="flex-grow flex flex-col p-6 overflow-y-auto pb-20"> {/* pb-20 for scrolling space */}

            {/* Header / Progress */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-plum bg-plum/10 px-3 py-1 rounded-full">{caseData.title}</span>
                <span className="text-xs text-clinical">Step {view === 'presentation' ? '1' : view === 'question' ? '2' : '3'} of 3</span>
            </div>

            <AnimatePresence mode="wait">
                {view === 'presentation' && (
                    <motion.div key="pres" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

                        {/* Case Visual / Media */}
                        <div className="relative w-full aspect-video bg-black/5 rounded-2xl overflow-hidden border border-plum/10 flex items-center justify-center">
                            {caseData.presentation_media_url?.includes('youtube.com') || caseData.presentation_media_url?.includes('youtu.be') ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${caseData.presentation_media_url.split('v=')[1]?.split('&')[0] || caseData.presentation_media_url.split('/').pop()}`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : caseData.presentation_media_url === 'video' ? (
                                <div className="flex flex-col items-center gap-2 text-plum/60">
                                    <div className="w-12 h-12 rounded-full bg-plum/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider">Patient Presentation Video</span>
                                </div>
                            ) : (
                                <>
                                    <img src="/1.svg" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Patient Case" />
                                    <div className="relative z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                                        <span className="text-plum font-bold flex items-center gap-2">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            Patient Presentation
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-plum-dark">Patient Presentation</h2>
                        <Card className="border-l-4 border-plum bg-white shadow-md">
                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                                {caseData.description}
                            </p>
                        </Card>
                        <Button fullWidth size="lg" onClick={() => setView('question')}>
                            Proceed to Decision
                        </Button>
                    </motion.div>
                )}

                {view === 'question' && (
                    <motion.div key="quest" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <h2 className="text-xl font-bold text-plum-dark">Clinical Decision</h2>

                        <div className="bg-lavender-soft p-4 rounded-xl border border-plum/10">
                            <p className="font-medium text-gray-800 text-lg">{caseData.questions[0].text}</p>
                        </div>

                        <div className="space-y-3">
                            {caseData.questions[0].options.map(opt => (
                                <MCQOption
                                    key={opt.id}
                                    text={opt.text}
                                    selected={selectedOption === opt.id}
                                    onClick={() => setSelectedOption(opt.id)}
                                />
                            ))}
                        </div>

                        <Button
                            fullWidth
                            size="lg"
                            disabled={!selectedOption || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Decision'}
                        </Button>
                    </motion.div>
                )}

                {view === 'outcome' && outcome && (
                    <motion.div key="outcome" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center pt-8">

                        {/* New Animated Outcome Visual */}
                        <div className="flex justify-center">
                            <OutcomeAnimation type={outcome.result === 'correct' ? 'success' : 'neutral'} />
                        </div>

                        <div>
                            <h2 className={`text-2xl font-bold mb-2 ${outcome.result === 'correct' ? 'text-green-600' : 'text-amber-600'}`}>
                                {outcome.result === 'correct' ? 'Optimal Outcome' : 'Suboptimal Approach'}
                            </h2>
                            <p className="text-gray-700 text-lg max-w-lg mx-auto leading-relaxed">
                                {outcome.outcome_text}
                            </p>
                        </div>

                        {/* Replaced 'Video Placeholder' with pure animation for now as per "Animation" request 
                            unless a specific outcome media URL is provided (which we know is 'video' placeholder currently) 
                        */}
                        {caseData.outcome_media_url && caseData.outcome_media_url !== 'video' && (
                            <div className="max-w-xs mx-auto mt-4 aspect-video bg-black/5 rounded-xl border border-plum/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                {/* If we had real videos, iframe here */}
                            </div>
                        )}

                        <Button fullWidth size="lg" onClick={() => setView('insight')}>View Clinical Insight</Button>
                    </motion.div>
                )}

                {view === 'insight' && outcome && (
                    <motion.div key="insight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex items-center gap-2 mb-2 p-2 bg-plum/5 rounded-lg w-fit mx-auto">
                            <div className="h-2 w-2 bg-plum rounded-full animate-pulse"></div>
                            <h2 className="text-xl font-bold text-plum-dark">Clinical Insight</h2>
                        </div>

                        <Card gradient className="border-plum/20 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                            </div>
                            <p className="text-xl font-medium text-plum-dark leading-relaxed italic text-center relative z-10 px-4 py-2">
                                "{outcome.insight_text || "Insight not available"}"
                            </p>
                        </Card>

                        <p className="text-xs text-clinical text-center italic opacity-70">
                            Treatment choice should align with approved indications and clinical judgment.
                        </p>

                        <Button fullWidth size="lg" onClick={() => router.push(nextCaseId ? `/cases/${nextCaseId}` : '/certificate')}>
                            {nextCaseId ? 'Next Case' : 'Complete Challenge'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
