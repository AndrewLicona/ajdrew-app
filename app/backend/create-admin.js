const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@eliterankings.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.usuario.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      rol: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      nombre: 'Administrador',
      rol: 'ADMIN',
    },
  });

  console.log('✅ Usuario Administrador listo en la base de datos:');
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Rol:      ${admin.rol}`);
}

main()
  .catch((err) => {
    console.error('❌ Error creando admin:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
