import Link from 'next/link';
import { Globe, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E0D8] bg-[#F5F2EC] pt-16 pb-8 text-[#191919]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-serif font-black text-[#191919] mb-4 block"
            >
              Khel AI
            </Link>
            <p className="text-[#6E6D6A] text-sm max-w-[200px]">
              Building the future of AI-powered digital experiences.
            </p>
          </div>
          <div>
            <h4 className="text-[#191919] font-bold mb-4 text-xs tracking-wider uppercase">Product</h4>
            <ul className="space-y-2 text-sm text-[#6E6D6A]">
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Voice AI
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Content AI
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Vision AI
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Image AI
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#191919] font-bold mb-4 text-xs tracking-wider uppercase">Company</h4>
            <ul className="space-y-2 text-sm text-[#6E6D6A]">
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#191919] font-bold mb-4 text-xs tracking-wider uppercase">Support</h4>
            <ul className="space-y-2 text-sm text-[#6E6D6A]">
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#191919] transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E5E0D8] gap-4">
          <p className="text-[#6E6D6A] text-sm">© 2026 Khel AI. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#6E6D6A]">
            <Link href="#" className="hover:text-[#191919] transition-colors">
              <Globe size={20} />
            </Link>
            <Link href="#" className="hover:text-[#191919] transition-colors">
              <Github size={20} />
            </Link>
            <Link href="#" className="hover:text-[#191919] transition-colors">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="hover:text-[#191919] transition-colors">
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
