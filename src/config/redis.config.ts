import { Redis } from "ioredis";
import config from "./env.config.js";


const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    lazyConnect: true,
    // tls: {} // enables secure TSL connection   // NOTE: TLS is not available for Free Redis Cloud Essentials plans.
});

redis.on('error', (err) => console.error('Redis Error', err));
redis.on('ready', () => console.log('Redis Ready'));

export default redis;

