import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, Image as ImageIcon, PhoneCall, ShieldCheck, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SymphonyLogo } from './SymphonyLogo';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Gallery Showcase', path: '/gallery', icon: ImageIcon },
    { name: 'Book Event', path: '/book', icon: Calendar },
    { name: 'Contact Us', path: '/contact', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md text-[#E5E5E5] border-b border-white/10 shadow-xl">
      {/* Gold Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <Link to="/" className="flex items-center group">
            <SymphonyLogo showText size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D4AF37]' : 'text-white/40'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA & Admin Portal Link */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/book"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs shadow-lg hover:bg-amber-400 transition-all transform hover:-translate-y-0.5"
            >
              <Heart className="w-3.5 h-3.5 text-black fill-black" />
              Book Kalyanam / Event
            </Link>

            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                user
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900'
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              {user ? 'Admin Dashboard' : 'Admin Portal'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/70 hover:bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 flex flex-col gap-2">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-[#D4AF37] text-black font-bold rounded-full text-xs shadow"
            >
              Book Event Now
            </Link>
            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-white/5 text-white/80 rounded-full border border-white/10 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              {user ? 'Go to Admin Dashboard' : 'Admin Portal Login'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
