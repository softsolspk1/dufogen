import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const cases = await prisma.case.findMany({
            orderBy: {
                sequence_order: 'asc',
            },
            select: {
                id: true,
                title: true,
                sequence_order: true,
                // We only fetch basic info for the dashboard list
            },
        });

        return NextResponse.json({ cases });
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
