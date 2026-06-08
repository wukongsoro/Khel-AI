/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 * Restyled for Playabl dark theme. Auth-flow logic (form onSubmit, authClient.signUp.email) is intact.
 */
'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: '',
    });

    if (signUpError) {
      setError(signUpError.message ?? 'Sign up failed');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    } else {
      console.warn('signup: window is undefined; cannot redirect to callbackUrl');
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF9F6] text-[#191919] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-serif font-black text-[#191919]"
          >
            <Gamepad2 size={26} className="text-[#C25E43]" /> Khel AI
          </Link>
          <p className="text-[#6E6D6A] text-sm mt-2">Build games with AI — no code required</p>
        </div>
        <form
          onSubmit={(e) => {
            void onSubmit(e);
          }}
          className="rounded-xl border border-[#E5E0D8] bg-white p-8 space-y-5 shadow-sm"
        >
          <h1 className="text-2xl font-serif font-semibold text-[#191919]">Create account</h1>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#6E6D6A]">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border border-[#E5E0D8] bg-white px-4 py-3 text-[#191919] placeholder-gray-400 outline-none focus:border-[#C25E43] focus:ring-1 focus:ring-[#C25E43]/30 transition-all text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#6E6D6A]">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-[#E5E0D8] bg-white px-4 py-3 text-[#191919] placeholder-gray-400 outline-none focus:border-[#C25E43] focus:ring-1 focus:ring-[#C25E43]/30 transition-all text-sm"
            />
          </label>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#191919] py-3 text-sm font-semibold text-[#FBF9F6] hover:bg-[#2E2E2D] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-[#6E6D6A]">
            Already have an account?{' '}
            <Link
              href={`/account/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-[#C25E43] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
