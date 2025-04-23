import { hash, compare } from 'bcryptjs';

export const hashPassword = (plain: string) => hash(plain, 10);

export const verifyPassword = (plain: string, hashed: string) => compare(plain, hashed);
