import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { doctor_id } = body;

        if (!doctor_id) {
            return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
        }

        // specific check: has completed all 5 cases?
        const completedCount = await prisma.progress.count({
            where: {
                doctor_id: doctor_id,
                is_completed: true
            }
        });

        const totalCases = await prisma.case.count();

        if (completedCount < totalCases) {
            return NextResponse.json({
                error: 'Cannot generate certificate. Complete all cases first.',
                completed: completedCount,
                total: totalCases
            }, { status: 400 });
        }

        // In a real app, generate PDF here.
        // For this prototype, we return success and frontend renders the certificate view.
        return NextResponse.json({
            certificate_url: `/certificate/view?id=${doctor_id}`, // Mock URL or just success signal
            status: 'generated',
            completed_date: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error generating certificate:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
