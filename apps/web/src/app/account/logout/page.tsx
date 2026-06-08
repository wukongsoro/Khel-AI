/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 * Restyled for Playabl dark theme. Auth-flow logic is intact.
 */
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { Gamepad2, Loader2 } from 'lucide-react';

function LogoutHandler() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { error: signOutError } = await authClient.signOut();
      if (cancelled) return;
      if (signOutError) {
        setError(signOutError.message ?? 'Sign out failed');
        return;
      }
      if (typeof window !== 'undefined') {
        window.location.href = callbackUrl;
      } else {
        console.warn('logout: window is undefined; cannot redirect to callbackUrl');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [callbackUrl]);

  return (
    <main className="min-h-screen bg-[#FBF9F6] flex items-center justify-center text-[#191919]">
      <div className="text-center space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-2xl font-serif font-black text-[#191919]"
        >
          <Gamepad2 size={26} className="text-[#C25E43]" /> Khel AI
        </Link>
        <div className="flex items-center justify-center gap-2 text-[#6E6D6A] text-sm">
          {error ? (
            <span className="text-red-600 font-medium">{error}</span>
          ) : (
            <>
              <Loader2 size={16} className="animate-spin text-[#C25E43]" />
              <span className="font-medium">Signing you out…</span>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutHandler />
    </Suspense>
  );
}
