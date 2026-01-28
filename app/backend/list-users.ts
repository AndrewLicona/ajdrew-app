import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.usuario.findMany({
        select: { email: true, nombre: true, rol: true }
    });
    console.log('USERS_START');
    console.log(JSON.stringify(users));
    console.log('USERS_END');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
