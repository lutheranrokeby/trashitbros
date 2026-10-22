import { NextResponse } from 'next/server';
import { signToken } from '@/lib/cms/auth';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || body.username || '').trim();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase authentication is not configured on the server.' },
        { status: 500 }
      );
    }

    // Authenticate strictly with Supabase Auth
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.access_token || !data.user) {
      return NextResponse.json(
        { error: data.error_description || data.msg || 'Invalid email or password' },
        { status: 401 }
      );
    }

    const authUser = data.user;
    const userRole = authUser.app_metadata?.role || authUser.user_metadata?.role || 'admin';
    const userName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'Administrator';

    const token = signToken({
      userId: authUser.id,
      username: authUser.email,
      role: userRole,
      name: userName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        username: authUser.email,
        role: userRole,
        name: userName,
      },
    });

    response.cookies.set('cms_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal authentication error' }, { status: 500 });
  }
}
