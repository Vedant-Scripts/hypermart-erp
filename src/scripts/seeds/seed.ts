import prisma from "../../common/db.js";

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
            password: '$2a$10$rvMm.jEUPVQT18Oi4bth6uL35M/YFPNQTBsKx9041dj7yLWPA0UP2',
            gender: 'MALE',
            address: 'Basketfull, broadway empire',
            country: 'India',
            state: 'Gujarat',
            city: 'Vadodara',
            status: 'ACTIVE'
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