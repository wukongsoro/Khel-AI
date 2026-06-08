import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E0D8] bg-[#F5F2EC] pt-16 pb-8 text-[#191919]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-serif font-black text-[#191919] mb-4 block"
            >
              Khel AI
            </Link>
            <p className="text-[#6E6D6A] text-xs leading-relaxed max-w-[200px]">
              Compiling ideas into playable retro canvas games instantly.
            </p>
          </div>
          <div>
            <h4 className="text-[#191919] font-mono font-bold mb-4 text-[10px] tracking-wider uppercase">Sandbox</h4>
            <ul className="space-y-2 text-xs text-[#6E6D6A] font-medium">
              <li>
                <Link href="/dashboard" className="hover:text-[#191919] transition-colors">
                  Game Editor
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[#191919] transition-colors">
                  Playable Demos
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#191919] transition-colors">
                  Custom Generation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#191919] font-mono font-bold mb-4 text-[10px] tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-xs text-[#6E6D6A] font-medium">
              <li>
                <Link href="https://github.com/wukongsoro/Khel-AI" target="_blank" rel="noopener noreferrer" className="hover:text-[#191919] transition-colors">
                  Source Code
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#191919] font-mono font-bold mb-4 text-[10px] tracking-wider uppercase">Security</h4>
            <ul className="space-y-2 text-xs text-[#6E6D6A] font-medium">
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Execution Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E5E0D8] gap-4">
          <p className="text-[#6E6D6A] text-xs">© 2026 Khel AI. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#6E6D6A]">
            <Link href="https://github.com/wukongsoro/Khel-AI" target="_blank" rel="noopener noreferrer" className="hover:text-[#191919] transition-colors">
              <Github size={18} />
            </Link>
            <Link href="mailto:info@khelai.com" className="hover:text-[#191919] transition-colors">
              <Mail size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
