import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Debug: Testing DB Connection...");

        // 1. Check Env Var (Safely)
        const dbUrl = process.env.DATABASE_URL;
        const isDbUrlSet = !!dbUrl;
        const dbUrlPreview = isDbUrlSet ? `${dbUrl.substring(0, 15)}...` : 'NOT SET';

        // 2. Test Connection
        const doctorCount = await prisma.doctor.count();

        return NextResponse.json({
            status: 'success',
            message: 'Database connection successful',
            doctorCount,
            env: {
                DATABASE_URL_SET: isDbUrlSet,
                PREVIEW: dbUrlPreview
            }
        });
    } catch (error) {
        console.error("Debug DB Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            env: {
                DATABASE_URL_SET: !!process.env.DATABASE_URL
            }
        }, { status: 500 });
    }
}
