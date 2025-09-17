import type { Server } from 'http';
import app from './app.js';
import prisma, { shutdownPrisma } from './common/db.js';

const PORT = 5000;

let server: Server;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Database Connected');
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
        return server;
    } catch (error) {
        console.error('Failed to connect to database', error);
        process.exit(1); // exit with failure code
    }
}

async function shutdown(signal?: string) {
    try {
        server.close((err?: Error) => {
            if (err) {
                console.error('Error closing HTTP Server', err);
                process.exit(1);
            }
            // disconnect Prisma and exit
            shutdownPrisma()
                .then(() => {
                    console.log('Prisma disconnected');
                    process.exit(0);   // used when things exited properly/success
                })
                .catch((err) => {
                    console.log('Prisma disconnecting Prisma', err);
                    process.exit(1);    // something happened and it didn't exited gracefully
                })

        })
    } catch (error) {
        console.error('Unexpected error during shutdown', error);
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();