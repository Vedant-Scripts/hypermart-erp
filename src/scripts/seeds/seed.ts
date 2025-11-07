import prisma from "../../common/db.js";

async function seed() {
    console.log('Seeding database...');

    await prisma.$transaction(async (tx) => {
        const clients = [
            { clientId: 'erp_web', name: 'ERP Web', secret: null },
            { clientId: 'customer_app', name: 'Customer App', secret: null },
            { clientId: 'delivery_app', name: 'Delivery App', secret: null },
        ];

        for (const client of clients) {
            await tx.client.upsert({
                where: { clientId: client.clientId },   // uses the model field name
                update: {
                    name: client.name,
                    secret: client.secret,
                    updatedAt: new Date(),
                },
                create: {
                    clientId: client.clientId,
                    name: client.name,
                    secret: client.secret,
                },
            });
        }

        let user = await tx.user.findFirst({ where: { email: 'admin@admin.com', deletedAt: null }, select: { id: true } });

        if (!user) {
            user = await tx.user.create({
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
            user = await tx.user.update({
                where: { id: user.id },
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
        await tx.userAllowedClient.create({
            data: {
                user: { connect: { id: user.id } },
                client: { connect: { clientId: 'erp_web' } }
            }
        });
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