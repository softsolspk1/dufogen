import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Clear existing data
        await prisma.option.deleteMany({});
        await prisma.question.deleteMany({});
        await prisma.progress.deleteMany({});
        await prisma.case.deleteMany({});
        await prisma.doctor.deleteMany({}); // Optional: keep doctors? Let's clear for fresh start

        const casesParams = [
            {
                sequence_order: 1,
                title: "Adolescent Cycle Irregularity",
                description: "16-year-old presents with heavy, irregular menstrual bleeding (cycle length 21-45 days) for the past 6 months. BMI 22. No signs of hyperandrogenism.",
                correct_outcome_text: "Clinical condition stabilizes with appropriate hormonal support. Cycle regularity is achieved.",
                clinical_insight_text: "In adolescents, HPO axis immaturity often leads to anovulatory cycles. Progesterone support can help regulate the cycle and protect the endometrium.",
                question: "Based on the presentation of anovulatory dysfunctional uterine bleeding, what is the most appropriate next step?",
                options: [
                    { text: "Immediate surgical intervention", is_correct: false },
                    { text: "Cyclic Progesterone Therapy (Dufaston)", is_correct: true },
                    { text: "Combined Oral Contraceptives only", is_correct: false },
                    { text: "Observation only", is_correct: false },
                ]
            },
            // ... (rest of the cases)
            // I will reduce duplication by only including the first case for brevity in this tool call, 
            // but typically I should include all.
            // Wait, I need ALL data. I will paste the full array from previous seed.ts
            {
                sequence_order: 2,
                title: "Luteal Phase Defect",
                description: "30-year-old female attempting conception for 1 year. Reports spotting 3-4 days before menses. Progesterone levels on Day 21 are suboptimal.",
                correct_outcome_text: "Luteal phase support improves endometrial receptivity, increasing the chance of successful implantation.",
                clinical_insight_text: "Luteal Phase Defect (LPD) is a significant cause of infertility. Dydrogesterone effectively supports the luteal phase without inhibiting ovulation.",
                question: "Which therapeutic approach is best suited to support the luteal phase in this patient?",
                options: [
                    { text: "High-dose Estrogen", is_correct: false },
                    { text: "Luteal Phase Support with Dydrogesterone", is_correct: true },
                    { text: "GnRH Agonists", is_correct: false },
                    { text: "Antibiotic therapy", is_correct: false },
                ]
            },
            {
                sequence_order: 3,
                title: "Threatened Pregnancy",
                description: "28-year-old, G1P0, at 8 weeks gestation presents with mild vaginal spotting and lower abdominal cramping. Ultrasound confirms viable intrauterine pregnancy.",
                correct_outcome_text: "Pregnancy continues successfully. Bleeding and cramping subside.",
                clinical_insight_text: "In threatened miscarriage, Dydrogesterone has been shown to reduce the risk of pregnancy loss by modulating the maternal immune response.",
                question: "What is the recommended pharmacological support for this patient to prevent miscarriage?",
                options: [
                    { text: "Bed rest alone", is_correct: false },
                    { text: "Dydrogesterone 40mg STAT then 10mg BID", is_correct: true },
                    { text: "Immediate D&C", is_correct: false },
                    { text: "Aspirin 75mg", is_correct: false },
                ]
            },
            {
                sequence_order: 4,
                title: "IVF Support",
                description: "35-year-old undergoing IVF treatment. Oocyte retrieval completed. Preparing for fresh embryo transfer.",
                correct_outcome_text: "Endometrial receptivity is optimized, leading to successful implantation.",
                clinical_insight_text: "Luteal support is mandatory in IVF cycles. Dydrogesterone is an effective oral alternative to vaginal progesterone for luteal support.",
                question: "Which agent would you choose for luteal phase support following oocyte retrieval?",
                options: [
                    { text: "Oral Dydrogesterone", is_correct: true },
                    { text: "Clomiphene Citrate", is_correct: false },
                    { text: "Letrozole", is_correct: false },
                    { text: "Metformin", is_correct: false },
                ]
            },
            {
                sequence_order: 5,
                title: "PMS & Emotional Symptoms",
                description: "25-year-old reports severe premenstrual mood swings, irritability, and bloating affecting daily life. Symptoms resolve after menstruation starts.",
                correct_outcome_text: "Symptom severity is significantly reduced, improving quality of life.",
                clinical_insight_text: "Premenstrual Syndrome (PMS) can be effectively managed with Dydrogesterone during the luteal phase to counter relative progesterone deficiency.",
                question: "What reflects an appropriate management strategy for this patient's PMS?",
                options: [
                    { text: "SSRI continuous therapy only", is_correct: false },
                    { text: "Dydrogesterone from Day 11-25 of cycle", is_correct: true },
                    { text: "Hysterectomy", is_correct: false },
                    { text: "Anxiolytics", is_correct: false },
                ]
            }
        ];

        for (const caseData of casesParams) {
            await prisma.case.create({
                data: {
                    sequence_order: caseData.sequence_order,
                    title: caseData.title,
                    description: caseData.description,
                    correct_outcome_text: caseData.correct_outcome_text,
                    clinical_insight_text: caseData.clinical_insight_text,
                    questions: {
                        create: {
                            text: caseData.question,
                            options: {
                                create: caseData.options
                            }
                        }
                    }
                }
            });
        }

        return NextResponse.json({ status: 'Database Seeded Successfully' });
    } catch (error) {
        console.error('Error seeding:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: String(error) },
            { status: 500 }
        );
    }
}
