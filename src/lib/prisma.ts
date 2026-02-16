import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // TEMPORARY: Hardcoded connection to bypass Vercel Env Var issues.
    // User provided credentials in chat.
    return new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://neondb_owner:npg_06anioOXHgIu@ep-snowy-recipe-ait3otsk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
            },
        },
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
