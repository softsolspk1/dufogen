import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ doctorId: string }> }
) {
    const { doctorId } = await params;
    return NextResponse.json({ error: 'Endpoint placeholder', doctorId });
}
