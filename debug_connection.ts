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
        console.log("Attempting to connect to Neon DB...");
        const count = await prisma.doctor.count();
        console.log("Connection SUCCESS! Doctor count:", count);
    } catch (e) {
        console.error("Connection FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
