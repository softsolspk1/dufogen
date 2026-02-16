
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const caseId = "49026835-76d5-48fd-9205-20a78957b727";
    const caseData = await prisma.case.findUnique({
        where: { id: caseId }
    })
    console.log(JSON.stringify(caseData, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
