import React from 'react';
import { ArrowUp, Sparkles, MapPin, Calendar, ShieldAlert, Table } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { googleSheetService } from '../utils/googleSheetService';

interface FooterProps {
  onOpenRegister: () => void;
  onTriggerSnap: () => void;
  onOpenRoster?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegister, onTriggerSnap, onOpenRoster }) => {
  const scrollToTop = () => {
    audioEngine.playTacticalClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050609] border-t border-[#D4A72C]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden text-white/70">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/brand/sms_logo_gold.png"
                alt="SMS 2K26 Logo"
                className="w-12 sm:w-16 md:w-20 h-auto object-contain filter drop-shadow-[0_0_16px_rgba(212,167,44,0.75)] shrink-0"
              />
              <div className="flex flex-col whitespace-nowrap shrink-0">
                <span className="font-marvel text-xl sm:text-2xl md:text-3xl font-black tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFFDF5] to-[#F6CC78]">
                  SMS 2K26
                </span>
                <span className="text-[8px] sm:text-[10px] md:text-xs font-montserrat font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#D4A72C] uppercase mt-0.5 sm:mt-1">
                  SFAX MOTIVATIONAL SEMINAR
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/60 font-grotesk max-w-sm leading-relaxed">
              "A generation united for a greater tomorrow." Bringing together Tunisia’s boldest young changemakers to awaken their cosmic potential and forge lifelong unity.
            </p>

            <div className="flex flex-col gap-1.5 text-xs font-mono text-white/50 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F04452]" />
                <span>Sector: 35°46' N, 10°50' E (Monastir Center Hotel, Tunisia)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>October 23–25, 2026</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-marvel tracking-[0.25em] text-[#F6CC78] uppercase font-bold">
              NAVIGATION PROTOCOLS
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              {[
                { name: 'THE SAGA', href: '#hero' },
                { name: 'THE MISSION', href: '#mission' },
                { name: 'THE 6 STONES', href: '#stones' },
                { name: 'CHRONOLOGY', href: '#journey' },
                { name: 'OC TEAM', href: '#team' },
                { name: 'SANCTUARY', href: '#location' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => audioEngine.playTacticalClick()}
                    className="text-white/60 hover:text-[#F6CC78] transition-colors"
                  >
                    ▸ {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The Gauntlet Protocol & Easter Egg Trigger */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-marvel tracking-[0.25em] text-[#F6CC78] uppercase font-bold">
              CLASSIFIED GAUNTLET SNAP
            </h4>
            <p className="text-xs text-white/60 font-body leading-relaxed">
              Type <code className="px-1.5 py-0.5 rounded bg-black/60 border border-[#D4A72C]/40 text-[#F6CC78] font-mono">THANOS</code> or <code className="px-1.5 py-0.5 rounded bg-black/60 border border-[#D4A72C]/40 text-[#F6CC78] font-mono">AVENGERS</code> anywhere on your keyboard to trigger the cosmic snap.
            </p>

            <button
              onClick={() => {
                audioEngine.playCinematicBraaam();
                onTriggerSnap();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#0D1326] border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-marvel tracking-[0.2em] uppercase hover:bg-[#D4A72C]/20 transition-all shadow-md"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>TEST THE SNAP PROTOCOL</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/40">
          <div>
            © 2026 AIESEC IN SFAX • ALL RIGHTS RESERVED
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenRoster && (
              <button
                onClick={() => {
                  audioEngine.playTacticalClick();
                  onOpenRoster();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#D4A72C]/40 bg-[#0D1326] hover:bg-[#D4A72C]/20 text-[#F6CC78] hover:text-white transition-all text-xs font-mono"
                title="S.H.I.E.L.D. Registrations Roster & Google Sheets"
              >
                <Table className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>ORGANIZER ROSTER</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 bg-[#0D1326] hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs font-mono"
              aria-label="Scroll back to top"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
