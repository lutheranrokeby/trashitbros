import { cookies } from 'next/headers';
import crypto from 'crypto';
import { User } from './types';

const SECRET_KEY = process.env.CMS_JWT_SECRET || 'trash-it-bros-secure-secret-key-2026';

interface SessionPayload {
  userId: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  name?: string;
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
  return {
    id: payload.userId,
    username: payload.username,
    passwordHash: '',
    role: payload.role,
    name: payload.name || payload.username.split('@')[0],
  };
}
