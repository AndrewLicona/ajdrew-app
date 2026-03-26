import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@eliterankings.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.usuario.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            nombre: 'Administrador Elite',
            rol: 'ADMIN'
        }
    });

    console.log('✅ Admin creado/verificado:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
