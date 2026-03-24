const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.usuario.findFirst({ where: { rol: 'ADMIN' } });
    if (admin) {
        console.log(`INFO: Admin ya existe con email: ${admin.email}`);
    } else {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.usuario.create({
            data: {
                email: 'admin@ajdrew.com',
                password: hashedPassword,
                rol: 'ADMIN',
                nombre: 'Admin AJDREW'
            }
        });
        console.log('SUCCESS: Usuario admin creado: admin@ajdrew.com / admin123');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
