import type { Server } from 'http';
import app from './app.js';
import prisma, { shutdownPrisma } from './common/db.js';
import config from './config/env.config.js';
import redis from './config/redis.config.js';

const PORT = config.app.port;

let server: Server;

async function startServer() {
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        console.log('Database Connected');
        await redis.connect();
        console.log('Redis Connected');
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
        return server;
    } catch (error) {
        console.error('Failed to connect to database', error);
        process.exit(1); // exit with failure code
    }
}

// Need to build shutdown for services


// async function shutdown(signal?: string) {
//     try {
//         server.close((err?: Error) => {
//             if (err) {
//                 console.error('Error closing HTTP Server', err);
//                 process.exit(1);
//             }
//             // disconnect Prisma and exit
//             shutdownPrisma()
//                 .then(() => {
//                     console.log('Prisma disconnected');
//                     // process.exit(0);   // used when things exited properly/success
//                 })
//                 .catch((err) => {
//                     console.log('Prisma disconnecting Prisma', err);
//                     // process.exit(1);    // something happened and it didn't exited gracefully
//                 })
//         })
//         try {
//             await redis.quit();
//             console.log('Redis quit gracefully');
//         } catch (err) {
//             console.warn('redis.quit() failed, calling disconnect():', err);
//             redis.disconnect()
//         }
//         process.exit(0);
//     } catch (error) {
//         console.error('Unexpected error during shutdown', error);
//         process.exit(1);
//     }
// }

// process.on('SIGINT', () => shutdown('SIGINT'));
// process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();