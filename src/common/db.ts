import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    // log: ['info', 'warn', 'error'],
    log: ['query', 'info', 'warn', 'error'],
});

/**
 * Graceful shutdown helper: closes Prisma client.
 * Exported so server.ts can call it when shutting down.
 */
export const shutdownPrisma = async (): Promise<void> => {
    try {
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error while disconnecting Prisma', error);
    }
}

export default prisma;