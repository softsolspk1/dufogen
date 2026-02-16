import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    console.log("Creating POST request handler");
    try {
        console.log("Awaiting params...");
        const { id: caseId } = await params;
        console.log("Params awaited. CaseId:", caseId);

        const body = await request.json();
        console.log("Submit request body:", body);
        const { doctor_id, option_id } = body;

        if (!doctor_id || !option_id) {
            console.error("Missing fields:", { doctor_id, option_id });
            return NextResponse.json({ error: 'Missing doctor_id or option_id' }, { status: 400 });
        }

        // Verify the option
        const selectedOption = await prisma.option.findUnique({
            where: { id: option_id },
            include: {
                question: true // check question linkage if needed
            }
        });

        if (!selectedOption) {
            return NextResponse.json({ error: 'Invalid option' }, { status: 400 });
        }

        const isCorrect = selectedOption.is_correct;

        // Fetch Case details for outcome text
        const caseData = await prisma.case.findUnique({
            where: { id: caseId }
        });

        if (!caseData) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }

        // Verify Doctor exists to prevent FK error
        const doctorExists = await prisma.doctor.findUnique({
            where: { id: doctor_id }
        });

        if (!doctorExists) {
            return NextResponse.json({ error: 'Doctor session invalid' }, { status: 401 });
            // 401 Unauthorized implies they need to re-login/verify
        }

        let outcomeText = "";
        let insightText = caseData.clinical_insight_text; // Always shown in Insight screen

        if (isCorrect) {
            outcomeText = caseData.correct_outcome_text;

            await prisma.progress.upsert({
                where: {
                    doctor_id_case_id: {
                        doctor_id: doctor_id,
                        case_id: caseId
                    }
                },
                update: {
                    is_completed: true,
                    completed_at: new Date()
                },
                create: {
                    doctor_id: doctor_id,
                    case_id: caseId,
                    is_completed: true
                }
            });
        } else {
            // Neutral feedback
            outcomeText = "Review the clinical scenario carefully and try again.";
        }

        return NextResponse.json({
            result: isCorrect ? 'correct' : 'incorrect',
            outcome_text: outcomeText,
            insight_text: insightText,
            is_completed: isCorrect
        });

    } catch (error) {
        console.error('Error submitting answer:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
