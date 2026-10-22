import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/cms/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    },
  });
}
