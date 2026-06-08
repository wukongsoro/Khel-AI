'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { ChevronDown, LayoutDashboard, LogOut, User, Gamepad2, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#E5E0D8] bg-[#FBF9F6]/85 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-serif font-black text-[#191919] flex items-center gap-2"
          >
            <Gamepad2 size={22} className="text-[#C25E43]" />
            Khel AI
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#6E6D6A]">
            <Link href="#features" className="hover:text-[#191919] transition-colors font-medium">
              Product
            </Link>
            <Link href="/dashboard" className="hover:text-[#191919] transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="#pricing" className="hover:text-[#191919] transition-colors font-medium">
              Pricing
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-8 w-28 rounded-full bg-black/5 animate-pulse" />
          ) : session?.user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-[#E5E0D8] bg-[#F5F2EC]/40 px-3 py-1.5 text-sm text-[#191919] hover:bg-[#F5F2EC] transition-colors font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C25E43] to-[#D97706] flex items-center justify-center text-xs font-bold text-white">
                  {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden md:block max-w-[120px] truncate text-sm">
                  {session.user.name || session.user.email}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#E5E0D8] bg-[#FBF9F6] shadow-xl overflow-hidden z-50">
                  <div className="px-3 py-2.5 border-b border-[#E5E0D8]">
                    <p className="text-xs text-[#6E6D6A] truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#2E2E2D] hover:bg-[#F5F2EC] hover:text-[#191919] transition-colors"
                  >
                    <LayoutDashboard size={14} /> My Games
                  </Link>
                  <Link
                    href="/account/logout"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-full bg-[#191919] px-4 py-2 text-sm font-medium text-[#FBF9F6] hover:bg-[#2E2E2D] transition-colors shadow-sm"
              >
                <User size={14} /> Login
                <ChevronDown
                  size={13}
                  className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#E5E0D8] bg-[#FBF9F6] shadow-xl overflow-hidden z-50">
                  <Link
                    href="/account/signin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#2E2E2D] hover:bg-[#F5F2EC] hover:text-[#191919] transition-colors border-b border-[#E5E0D8]"
                  >
                    <LogOut size={14} className="rotate-180" /> Sign In
                  </Link>
                  <Link
                    href="/account/signup"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#2E2E2D] hover:bg-[#F5F2EC] hover:text-[#191919] transition-colors border-b border-[#E5E0D8]"
                  >
                    <User size={14} /> Create Account
                  </Link>
                  <Link
                    href="/account/signin?demo=true"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#C25E43] hover:bg-[#C25E43]/5 transition-colors"
                  >
                    <Sparkles size={14} /> Try Demo Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
