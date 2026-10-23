'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
      } else {
        window.location.href = '/admin';
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-near-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-charcoal border border-steel-grey rounded-xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/brand/logo-dark-cropped.png"
              alt="Trash It Bros Logo"
              className="h-14 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-montserrat font-bold text-xl text-white tracking-wide">
            CMS ADMIN PORTAL
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in with your credentials to access the admin portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trashitbros.com.au"
                className="w-full bg-near-black border border-steel-grey rounded px-3 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-safety-orange text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-near-black border border-steel-grey rounded px-3 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-safety-orange text-sm"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase py-3.5 rounded transition-all shadow-lg shadow-safety-orange/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-steel-grey/60 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-safety-orange transition-colors"
          >
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
