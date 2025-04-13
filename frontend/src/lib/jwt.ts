// src/lib/jwt.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'Str0ngS3cr3tK3y'; 

export function signToken(payload: object, options?: jwt.SignOptions): string {
  // Default expiration of 1 hour; override in options if needed
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h', ...options });
}

export function verifyToken(token: string): object | string {
  return jwt.verify(token, SECRET_KEY);
}
