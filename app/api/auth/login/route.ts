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

    // 1. Check built-in local admin fallback (ideal for offline development or when Supabase is unconfigured)
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.CMS_ADMIN_PASSWORD || 'admin123';
    const isBuiltInAdmin =
      (email.toLowerCase() === 'admin' ||
        email.toLowerCase() === 'admin@trashitbros.com.au' ||
        email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase()) &&
      password === adminPassword;

    if (isBuiltInAdmin) {
      const token = signToken({
        userId: 'local-admin',
        username: email,
        role: 'admin',
        name: 'Administrator (Offline Dev)',
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'local-admin',
          username: email,
          role: 'admin',
          name: 'Administrator (Offline Dev)',
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
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          error:
            'Supabase credentials are not configured locally. For offline local development, you can sign in with: admin@trashitbros.com.au / admin123',
        },
        { status: 500 }
      );
    }

    // 2. Authenticate with Supabase Auth when credentials are provided
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.access_token || !data.user) {
      let errorMessage = data.error_description || data.msg || data.message || data.error;

      if (data.error_code === 'email_not_confirmed' || data.msg === 'Email not confirmed') {
        errorMessage =
          'Email not confirmed in Supabase. Please confirm your user in the Supabase Dashboard (Auth > Users > Auto Confirm) or disable email confirmations in Supabase Auth settings.';
      } else if (data.error_code === 'invalid_credentials' || data.msg === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. Please verify that this user exists in your Supabase Auth dashboard.';
      }

      return NextResponse.json(
        { error: errorMessage || 'Invalid email or password' },
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
