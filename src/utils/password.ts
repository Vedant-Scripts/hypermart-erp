import bcrypt from 'bcrypt';
import crypto from 'crypto';
const SALT_ROUNDS: number = 10;

// Hash Password
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare Password
export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashPassword);
}

export const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export const csrfTokenGenerate = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('base64url');
}
