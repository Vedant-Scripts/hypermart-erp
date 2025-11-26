import { config as loadEnv } from "dotenv";
import { z } from "zod/v4";

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging") {
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
    const envFile =
        process.env.NODE_ENV === "staging"
            ? ".env.staging"
            : ".env.dev";

    loadEnv({ path: envFile });
}

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
    PORT: z.coerce.number().default(5000),

    DATABASE_URL: z.url(),
    // JWT setting keys
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.coerce.number(),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.coerce.number(),

    // Redis setting keys
    REDIS_USERNAME: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.coerce.number().default(18096),
    REDIS_REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
    REDIS_OTP_EXPIRES_IN: z.string().min(1),

    // MSG-91 setting keys
    AUTH_KEY: z.string().min(1),
    MSG_DLT_TEMPLATE_ID_OTP: z.string().min(1),
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
        otpExpiresIn: parsed.REDIS_OTP_EXPIRES_IN
    },
    jwt: {
        secret: parsed.JWT_SECRET,
        expiresIn: parsed.JWT_EXPIRES_IN,
        refreshSecret: parsed.JWT_REFRESH_SECRET,
        refreshExpiresIn: parsed.JWT_REFRESH_EXPIRES_IN,
    },
    msg91: {
        authKey: parsed.AUTH_KEY,
        msgDltTemplateIdOtp: parsed.MSG_DLT_TEMPLATE_ID_OTP
    }
    // integrations
    // s3 
} as const;

export type Config = typeof config;

export default config;