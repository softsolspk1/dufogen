import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure it's not cached

export async function GET() {
    try {
        // 1. Fetch total number of cases to determine "Certificate" eligibility
        const totalCases = await prisma.case.count();

        // 2. Fetch all doctors with their progress
        const doctors = await prisma.doctor.findMany({
            include: {
                progress: {
                    where: { is_completed: true }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // 3. Transform data for the frontend
        const data = doctors.map(doc => {
            const completedCount = doc.progress.length;
            const hasCertificate = totalCases > 0 && completedCount >= totalCases;

            return {
                id: doc.id,
                name: doc.name,
                pmdc_number: doc.pmdc_number,
                specialty: doc.specialty,
                created_at: doc.created_at,
                cases_completed: completedCount,
                total_cases: totalCases,
                has_certificate: hasCertificate
            };
        });

        return NextResponse.json({ doctors: data });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
