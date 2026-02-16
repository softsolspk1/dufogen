import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("VERIFY REQUEST RECEIVED:", body);
        const { name, pmdc_number, specialty } = body;

        if (!pmdc_number) {
            return NextResponse.json(
                { error: 'PMDC Number is required' },
                { status: 400 }
            );
        }

        // Check if doctor exists, if not create new
        let doctor = await prisma.doctor.findUnique({
            where: { pmdc_number },
        });

        if (!doctor) {
            doctor = await prisma.doctor.create({
                data: {
                    name,
                    pmdc_number,
                    specialty,
                },
            });
        }

        // In a real app, generate a JWT here. For this demo, return the doctor object (ID is crucial)
        return NextResponse.json({
            status: 'verified',
            doctor,
        });
    } catch (error) {
        console.error('Error verifying doctor:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
