import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readDatabase } from '@/lib/cms/db';
import { signToken } from '@/lib/cms/auth';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = (body.email || body.username || '').trim();
    const password = (body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username/Email and password are required' }, { status: 400 });
    }

    // 1. Check built-in fallback admin credentials / environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.CMS_ADMIN_PASSWORD || 'admin123';
    const isBuiltInAdmin =
      (identifier.toLowerCase() === 'admin' ||
        identifier.toLowerCase() === 'admin@trashitbros.com.au' ||
        identifier.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase()) &&
      password === adminPassword;

    if (isBuiltInAdmin) {
      const token = signToken({
        userId: 'user-admin',
        username: identifier,
        role: 'admin',
        name: 'Administrator',
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'user-admin',
          username: identifier,
          role: 'admin',
          name: 'Administrator',
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

    // 2. Check local database users if configured in cms.json
    try {
      const db = readDatabase();
      const localUser = db.users?.find(
        (u) =>
          u.username.toLowerCase() === identifier.toLowerCase()
      );
      if (localUser && localUser.passwordHash && bcrypt.compareSync(password, localUser.passwordHash)) {
        const token = signToken({
          userId: localUser.id,
          username: localUser.username,
          role: localUser.role || 'admin',
          name: localUser.name || 'Administrator',
        });

        const response = NextResponse.json({
          success: true,
          user: {
            id: localUser.id,
            username: localUser.username,
            role: localUser.role || 'admin',
            name: localUser.name || 'Administrator',
          },
        });

        response.cookies.set('cms_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24,
        });

        return response;
      }
    } catch {
      // Ignore db read error and fall through to Supabase
    }

    // 3. Fall through to Supabase Auth if configured
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: identifier, password }),
        });

        const data = await res.json();

        if (res.ok && data.access_token && data.user) {
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
            maxAge: 60 * 60 * 24,
          });

          return response;
        }

        // Check for specific Supabase error reasons
        if (data.error_code === 'email_not_confirmed' || data.msg === 'Email not confirmed') {
          return NextResponse.json(
            { error: 'Email not confirmed in Supabase. Please verify your email or sign in with the admin account.' },
            { status: 401 }
          );
        }

        if (data.msg && data.msg !== 'Invalid login credentials') {
          return NextResponse.json({ error: data.msg }, { status: 401 });
        }
      } catch (err) {
        console.error('Supabase auth network error:', err);
      }
    }

    return NextResponse.json({ error: 'Invalid username/email or password.' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal authentication error' }, { status: 500 });
  }
}
