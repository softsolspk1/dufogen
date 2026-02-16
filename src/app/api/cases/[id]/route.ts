import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const caseData = await prisma.case.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: {
                            select: {
                                id: true,
                                text: true,
                                // Do NOT select is_correct to prevent cheating via network tab inspection
                            },
                        },
                    },
                },
            },
        });

        if (!caseData) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }

        // Find the next case in sequence
        const nextCase = await prisma.case.findFirst({
            where: {
                sequence_order: {
                    gt: caseData.sequence_order
                }
            },
            orderBy: {
                sequence_order: 'asc'
            },
            select: {
                id: true
            }
        });

        return NextResponse.json({
            case: caseData,
            nextCaseId: nextCase ? nextCase.id : null
        });
    } catch (error) {
        console.error('Error fetching case:', error);
        // @ts-ignore
        console.error('Error details:', error.message);
        return NextResponse.json(
            { error: 'Internal Server Error', details: String(error) },
            { status: 500 }
        );
    }
}
