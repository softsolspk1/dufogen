const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_06anioOXHgIu@ep-snowy-recipe-ait3otsk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
        },
    },
});

async function main() {
    try {
        console.log("Checking Cases in Neon DB...");
        const cases = await prisma.case.findMany();
        console.log(`Found ${cases.length} cases.`);
        cases.forEach((c: any) => console.log(` - ${c.title} (${c.id})`));
    } catch (e) {
        console.error("Query FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
