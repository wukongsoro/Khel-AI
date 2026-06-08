/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. Restyled for Playabl dark theme.
 * Auth-flow logic (form onSubmit, e.preventDefault, authClient.signIn.email) is intact.
 */
'use client';

import { Suspense, useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { Gamepad2, Sparkles } from 'lucide-react';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const isDemo = searchParams.get('demo') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setEmail('demo@playabl.ai');
      setPassword('Demo@12345');
    }
  }, [isDemo]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let { error: signInError } = await authClient.signIn.email({ email, password });

    if (signInError) {
      if (email.toLowerCase() === 'demo@playabl.ai') {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name: 'Demo User',
        });

        if (!signUpError) {
          const retry = await authClient.signIn.email({ email, password });
          signInError = retry.error;
        } else {
          signInError = signUpError;
        }
      }
    }

    if (signInError) {
      setError(signInError.message ?? 'Sign in failed');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    }
  };

  const fillDemo = () => {
    setEmail('demo@playabl.ai');
    setPassword('Demo@12345');
  };

  return (
    <main className="min-h-screen bg-[#FBF9F6] text-[#191919] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-serif font-black text-[#191919]"
          >
            <Gamepad2 size={26} className="text-[#C25E43]" /> Khel AI
          </Link>
          <p className="text-[#6E6D6A] text-sm mt-2">Sign in to start building games</p>
        </div>

        {/* Demo banner */}
        {isDemo && (
          <div className="mb-4 rounded-lg border border-[#C25E43]/20 bg-[#C25E43]/5 px-4 py-3 text-sm text-[#C25E43] flex items-center gap-2 font-medium">
            <Sparkles size={15} />
            Demo credentials pre-filled — just click Sign In!
          </div>
        )}

        <form
          onSubmit={(e) => {
            void onSubmit(e);
          }}
          className="rounded-xl border border-[#E5E0D8] bg-white p-8 space-y-5 shadow-sm"
        >
          <h1 className="text-2xl font-serif font-semibold text-[#191919]">Welcome back</h1>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#6E6D6A]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#E5E0D8] bg-white px-4 py-3 text-[#191919] placeholder-gray-400 outline-none focus:border-[#C25E43] focus:ring-1 focus:ring-[#C25E43]/30 transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#6E6D6A]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#E5E0D8] bg-white px-4 py-3 text-[#191919] placeholder-gray-400 outline-none focus:border-[#C25E43] focus:ring-1 focus:ring-[#C25E43]/30 transition-all text-sm"
            />
          </div>

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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          {/* Demo login shortcut */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full rounded-lg border border-[#E5E0D8] bg-[#F5F2EC] py-3 text-sm text-[#191919] hover:bg-[#E5E0D8] transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <Sparkles size={14} className="text-[#C25E43]" /> Try Demo Account
          </button>

          <p className="text-center text-sm text-[#6E6D6A]">
            No account?{' '}
            <Link
              href={`/account/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-[#C25E43] hover:underline font-medium"
            >
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
