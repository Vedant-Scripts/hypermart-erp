import redis from "../../config/redis.config.js";
import type { RedisKey } from "ioredis";

export const setRedisValue = async (key: RedisKey, expiry: number, value: string) => {
    return redis.setex(key, expiry, value);
}

export const getRedisValue = async (key: RedisKey) => {
    return redis.get(key);
} 

export const delRedisValue = async (key: RedisKey) => {
    return redis.del(key);
} 