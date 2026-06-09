'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import {
  Plus,
  Gamepad2,
  Trash2,
  Clock,
  Send,
  Sparkles,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  prompt: string;
  created_at: string;
  updated_at: string;
  game_code: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // Store relative dates client-side only to avoid hydration mismatch
  const [relDates, setRelDates] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/account/signin?callbackUrl=/dashboard');
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user) {
      void fetchGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  async function fetchGames() {
    try {
      const res = await fetch('/api/games');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = (await res.json()) as { games: Game[] };
      setGames(data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Compute relative dates after mount to avoid SSR mismatch
  useEffect(() => {
    if (games.length === 0) return;
    const map: Record<string, string> = {};
    games.forEach((g) => {
      const diffMs =
        window.performance.now() -
        (window.performance.now() - (Date.now() - new Date(g.updated_at).getTime()));
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) {
        map[g.id] = 'just now';
        return;
      }
      if (mins < 60) {
        map[g.id] = `${mins}m ago`;
        return;
      }
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) {
        map[g.id] = `${hrs}h ago`;
        return;
      }
      map[g.id] = `${Math.floor(hrs / 24)}d ago`;
    });
    setRelDates(map);
  }, [games]);

  async function createGame(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: prompt.slice(0, 60), prompt }),
      });
      if (!res.ok) throw new Error('Failed to create');
      const { game } = (await res.json()) as { game: Game };
      router.push(`/game/${game.id}?prompt=${encodeURIComponent(prompt)}`);
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  }

  async function deleteGame(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/games/${id}`, { method: 'DELETE' });
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  const examplePrompts = [
    'Flappy bird clone with neon colors',
    'Snake game with power-ups',
    'Breakout with glowing bricks',
    'Space shooter with asteroids',
    'Pac-Man style maze game',
    'Tetris with modern visuals',
  ];

  if (isPending || (!session?.user && !isPending)) {
    return (
      <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center text-[#191919]">
        <div className="flex items-center gap-3 text-[#6E6D6A]">
          <Sparkles size={18} className="text-[#C25E43] animate-pulse" />
          <span className="font-medium">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#191919]">
      {/* Top Bar */}
      <header className="border-b border-[#E5E0D8] bg-[#FBF9F6]/85 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-serif font-black text-[#191919]"
        >
          <Gamepad2 size={20} className="text-[#C25E43]" /> Khel AI
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-[#E5E0D8] bg-[#F5F2EC]/40 px-3 py-1.5 text-sm text-[#191919] hover:bg-[#F5F2EC] transition-colors font-medium cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C25E43] to-[#D97706] flex items-center justify-center text-[10px] font-bold text-white">
                {(session?.user?.name || session?.user?.email || 'U')[0].toUpperCase()}
              </div>
              <span className="hidden md:block text-sm">
                {session?.user?.name || session?.user?.email}
              </span>
              <ChevronDown size={12} className="text-[#6E6D6A]" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-[#E5E0D8] bg-[#FBF9F6] shadow-xl overflow-hidden z-50">
                <Link
                  href="/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-[#2E2E2D] hover:bg-[#F5F2EC] transition-colors"
                >
                  <LayoutDashboard size={13} /> Dashboard
                </Link>
                <Link
                  href="/account/logout"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-[#191919] mb-1">My Games</h1>
          <p className="text-[#6E6D6A] text-sm mb-6">
            Build, iterate, and share browser games with AI
          </p>

          <form
            onSubmit={(e) => {
              void createGame(e);
            }}
            className="relative max-w-2xl"
          >
            <div className="flex items-center gap-3 rounded-xl border border-[#E5E0D8] bg-white px-5 py-4 focus-within:border-[#C25E43] focus-within:ring-1 focus-within:ring-[#C25E43]/30 transition-all shadow-sm">
              <Sparkles size={18} className="text-[#C25E43] flex-shrink-0" />
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What game do you want to build today?"
                className="flex-1 bg-transparent text-[#191919] placeholder-gray-400 outline-none text-sm"
                disabled={creating}
              />
              <button
                type="submit"
                disabled={creating || !prompt.trim()}
                className="flex-shrink-0 rounded-lg bg-[#191919] px-4 py-2 text-xs font-semibold text-[#FBF9F6] hover:bg-[#2E2E2D] disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={13} /> {creating ? 'Building…' : 'Build'}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mt-3">
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="rounded-full border border-[#E5E0D8] bg-[#F5F2EC]/50 px-3 py-1 text-xs text-[#6E6D6A] hover:bg-[#F5F2EC] hover:text-[#191919] transition-all cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-52 rounded-xl bg-white border border-[#E5E0D8] animate-pulse"
              />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#C25E43]/5 border border-[#C25E43]/10 flex items-center justify-center mb-6">
              <Gamepad2 size={36} className="text-[#C25E43]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#191919] mb-2">No games yet</h3>
            <p className="text-[#6E6D6A] text-sm max-w-xs">
              Type a description above to build your first AI game — it takes seconds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => document.querySelector('input')?.focus()}
              className="h-52 rounded-xl border border-dashed border-[#E5E0D8] bg-white/50 hover:bg-white hover:border-[#C25E43]/50 transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl border border-dashed border-[#E5E0D8] group-hover:border-[#C25E43]/50 flex items-center justify-center transition-colors">
                <Plus
                  size={22}
                  className="text-[#6E6D6A] group-hover:text-[#C25E43] transition-colors"
                />
              </div>
              <span className="text-sm text-[#6E6D6A] group-hover:text-[#191919] transition-colors font-medium">
                New Game
              </span>
            </button>

            {games.map((game) => (
              <div
                key={game.id}
                className="relative h-52 rounded-xl border border-[#E5E0D8] bg-white hover:border-[#C25E43]/50 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer"
                onClick={() => router.push(`/game/${game.id}`)}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <Gamepad2 size={48} className="text-[#C25E43]/5" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E5E0D8]/40 bg-[#FBF9F6]/90 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-[#191919] truncate mb-1">{game.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6E6D6A]">
                    <Clock size={10} />
                    <span suppressHydrationWarning>{relDates[game.id] ?? '…'}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void deleteGame(game.id);
                  }}
                  disabled={deletingId === game.id}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
