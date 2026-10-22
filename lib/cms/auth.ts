import { cookies } from 'next/headers';
import crypto from 'crypto';
import { readDatabase } from './db';
import { User } from './types';

const SECRET_KEY = process.env.CMS_JWT_SECRET || 'trash-it-bros-secure-secret-key-2026';

interface SessionPayload {
  userId: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  exp: number;
}

export function signToken(payload: Omit<SessionPayload, 'exp'>, expiresInHours = 24): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(encodedPayload)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload: SessionPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('cms_session')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const db = readDatabase();
  const user = db.users.find((u) => u.id === payload.userId);
  return user || null;
}
