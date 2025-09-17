import { config as loadEnv } from "dotenv";
import { z } from "zod/v4";

loadEnv(); // loading env into process.env

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
    PORT: z.coerce.number().default(5000),

    DATABASE_URL: z.url(),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.coerce.number(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.coerce.number(),


    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().default(18096),
    REDIS_REFRESH_TOKEN_EXPIRES_IN: z.string(),
});

type Env = z.infer<typeof envSchema>;

let parsed: Env;
try {
    parsed = envSchema.parse(process.env);
} catch (err) {
    console.error("Environment variables validation failed:", err);
    throw new Error("Critical environment variables missing or invalid");
}

const config = {
    app: {
        env: parsed.NODE_ENV,
        port: parsed.PORT,
        isDev: parsed.NODE_ENV === "development",
        isStaging: parsed.NODE_ENV === "staging",
        isProduction: parsed.NODE_ENV === "production"
    },
    db: {
        url: parsed.DATABASE_URL,
    },
    redis: {
        username: parsed.REDIS_USERNAME,
        password: parsed.REDIS_PASSWORD,
        host: parsed.REDIS_HOST,
        port: parsed.REDIS_PORT,
        refreshTokenExpireIn: parsed.REDIS_REFRESH_TOKEN_EXPIRES_IN,
    },
    jwt: {
        secret: parsed.JWT_SECRET,
        expiresIn: parsed.JWT_EXPIRES_IN,
        refreshSecret: parsed.JWT_REFRESH_SECRET,
        refreshExpiresIn: parsed.JWT_REFRESH_EXPIRES_IN,
    }
    // integrations
    // s3 
} as const;

export type Config = typeof config;

export default config;