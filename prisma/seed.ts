import prisma from "../src/common/db.js";

async function seed() {
    console.log('Seeding database...');

    await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            firstName: 'Admin',
            email: 'admin@admin.com',
            role: 'ADMIN',
            userType: 'ERP_USER',
            password: ''
        }
    });
    console.log('Seed completed');
}

seed()
    .catch((e) => {
        console.error('Seed Failed', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });