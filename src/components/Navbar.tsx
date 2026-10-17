import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Zap } from 'lucide-react';
import { AudioToggle } from './AudioToggle';
import { audioEngine } from '../utils/audioEngine';

interface NavbarProps {
  onOpenRegister: () => void;
  onTriggerSnap: () => void;
}

const navLinks = [
  { name: 'SAGA', href: '#hero' },
  { name: 'MISSION', href: '#mission' },
  { name: 'STONES', href: '#stones' },
  { name: 'TRILOGY', href: '#journey' },
  { name: 'EXPERIENCE', href: '#capabilities' },
  { name: 'ROSTER', href: '#team' },
  { name: 'SANCTUARY', href: '#location' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister, onTriggerSnap }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'mission', 'stones', 'journey', 'capabilities', 'team', 'location'];
      const scrollPos = window.scrollY + 260;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    audioEngine.playTacticalClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050609]/94 backdrop-blur-2xl border-b border-[#D4A72C]/25 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
      {/* Top Specular Anamorphic Gold Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4A72C]/80 to-transparent pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-20 sm:h-24 flex items-center justify-between gap-4">
        {/* Brand / Logo (Bigger Emblem & Smooth Marvel Typography) */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center gap-3 sm:gap-4 group select-none relative shrink-0"
        >
          {/* Subtle Ambient Gold Aura */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-[#D4A72C]/20 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D4A72C]/40 transition-colors" />

          {/* Official SMS 2K26 Emblem (Responsive on phones & desktop) */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105">
            <img
              src="/brand/sms_logo_gold.png"
              alt="SMS 2K26 Avengers Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(212,167,44,0.9)]"
            />
          </div>

          <div className="flex flex-col justify-center whitespace-nowrap shrink-0">
            <span className="font-marvel text-lg sm:text-2xl md:text-[30px] font-black tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF8E7] to-[#F6CC78] group-hover:to-[#D4A72C] transition-all leading-none drop-shadow-[0_2px_12px_rgba(212,167,44,0.5)]">
              SMS 2K26
            </span>
            <span className="text-[8px] sm:text-[10px] md:text-xs font-montserrat font-bold tracking-[0.22em] sm:tracking-[0.3em] text-[#D4A72C] uppercase leading-none mt-1 whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              SFAX MOTIVATIONAL SEMINAR
            </span>
          </div>
        </a>

        {/* Architectural Divider */}
        <div className="hidden 2xl:block h-9 w-[1px] bg-gradient-to-b from-transparent via-[#D4A72C]/35 to-transparent shrink-0 mx-1" />

        {/* Desktop Navigation Links — Unified Capsule Dock */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-2.5 xl:px-3 py-1.5 rounded-full bg-[#0D1326]/75 backdrop-blur-md border border-[#D4A72C]/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_6px_25px_rgba(0,0,0,0.6)] shrink-0">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`relative px-3 xl:px-4 py-1.5 rounded-full transition-all duration-300 text-[11px] xl:text-xs font-marvel tracking-[0.15em] uppercase whitespace-nowrap shrink-0 flex items-center justify-center select-none ${
                  isActive
                    ? 'text-[#F6CC78] font-bold bg-[#D4A72C]/20 border border-[#D4A72C]/60 shadow-[0_0_18px_rgba(212,167,44,0.4)]'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A72C] mr-1.5 shadow-[0_0_8px_#D4A72C] shrink-0 animate-pulse" />
                )}
                <span className="whitespace-nowrap">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Controls & CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio Synthesizer Toggle */}
          <AudioToggle />

          {/* Primary CTA: Register / Assemble */}
          <button
            onClick={() => {
              onOpenRegister();
            }}
            className="assemble-btn-epic group relative hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4A72C] via-[#FFFDF5] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-black tracking-[0.24em] uppercase hover:brightness-110 transition-all shadow-[0_0_25px_rgba(212,167,44,0.65)] hover:shadow-[0_0_40px_rgba(246,204,120,0.95)] active:scale-95 overflow-hidden shrink-0 whitespace-nowrap border border-[#FFFDF5]/50"
          >
            {/* Automatic Continuous Crystal Sweep */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/35 skew-x-12 -translate-x-full animate-crystal-sweep pointer-events-none" />
            <Sparkles className="w-3.5 h-3.5 fill-current text-[#050609] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="relative z-10 whitespace-nowrap font-black">ASSEMBLE NOW</span>
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => {
              audioEngine.playTacticalClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-lg border border-white/10 bg-[#0D1326] text-white/80 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#F6CC78]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Dimmed Backdrop to dismiss smoothly on outside tap */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          />

          <div className="lg:hidden fixed inset-x-3 sm:inset-x-6 top-[76px] sm:top-[88px] z-50 bg-[#050609]/98 backdrop-blur-3xl border border-[#D4A72C]/40 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.98)] max-h-[calc(100vh-92px)] overflow-y-auto touch-scroll animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col divide-y divide-white/5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="py-3 px-1 text-xs font-marvel tracking-[0.2em] uppercase text-white/80 hover:text-[#F6CC78] active:text-[#D4A72C] flex items-center justify-between transition-colors"
                >
                  <span>{link.name}</span>
                  <span className="text-[10px] text-[#D4A72C] font-mono">▸</span>
                </a>
              ))}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="assemble-btn-epic w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-[#D4A72C] via-[#FFFDF5] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-sm font-black tracking-[0.25em] uppercase text-center shadow-[0_0_35px_rgba(212,167,44,0.75)] active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#FFFDF5]/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full animate-crystal-sweep pointer-events-none" />
              <Zap className="w-4 h-4 fill-current text-[#050609]" />
              <span className="relative z-10 font-black">ASSEMBLE NOW</span>
            </button>
          </div>
        </>
      )}
    </header>
  );
};
