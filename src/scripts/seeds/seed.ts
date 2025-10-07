import prisma from "../../common/db.js";

async function seed() {
    console.log('Seeding database...');

    await prisma.$transaction(async (tx) => {
        const existing = await tx.user.findFirst({ where: { email: 'admin@admin.com', deletedAt: null }, select: { id: true } });

        if (!existing) {
            await tx.user.create({
                data: {
                    role: 'ADMIN',
                    firstName: 'Admin',
                    email: 'admin@admin.com',
                    contactNumber: '9874563210',
                    gender: 'MALE',
                    password: '$2a$10$rvMm.jEUPVQT18Oi4bth6uL35M/YFPNQTBsKx9041dj7yLWPA0UP2',
                    status: 'ACTIVE'
                }
            });
        } else {
            await tx.user.update({
                where: { id: existing.id },
                data: {
                    role: 'ADMIN',
                    firstName: 'Admin',
                    email: 'admin@admin.com',
                    contactNumber: '9874563210',
                    gender: 'MALE',
                    password: '$2a$10$rvMm.jEUPVQT18Oi4bth6uL35M/YFPNQTBsKx9041dj7yLWPA0UP2',
                    status: 'ACTIVE'
                }
            });
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