// src/lib/jwt.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY =
  process.env.JWT_SECRET ??
  (process.env.NODE_ENV === 'production'
    ? (() => {
        throw new Error('JWT_SECRET must be set in production');
      })()
    : 'Str0ngS3cr3tK3y');

export function signToken(payload: object, options?: jwt.SignOptions): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h', ...options });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, SECRET_KEY) as T;
}
