import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;

// Hash Password
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare Password
export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashPassword);
}

