import React from 'react';
import { Zap, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { infinityStones } from '../data/stonesData';
import { FacetedStone } from './FacetedStone';
import { audioEngine } from '../utils/audioEngine';

interface CallToActionProps {
  onOpenRegister: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onOpenRegister }) => {
  const handleRegisterClick = () => {
    onOpenRegister();
  };

  return (
    <section id="final-cta" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050609] border-t border-[#D4A72C]/20 overflow-hidden">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      {/* Background Cosmic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(36,19,61,0.5)_0%,_rgba(13,19,38,0.7)_50%,_rgba(5,6,9,0.98)_100%)] pointer-events-none" />

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Six Faceted Infinity Stones Convergence Arc */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-8 select-none">
          {infinityStones.map((stone) => (
            <div
              key={stone.id}
              onClick={() => audioEngine.playStoneResonance(stone.frequency)}
              className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-125 active:scale-95"
            >
              <div className="sm:hidden">
                <FacetedStone id={stone.id} color={stone.hex} size={30} isHovered={false} />
              </div>
              <div className="hidden sm:block">
                <FacetedStone id={stone.id} color={stone.hex} size={42} isHovered={false} />
              </div>
              <span
                className="mt-2 text-[7px] sm:text-[8px] font-marvel tracking-widest uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: stone.hex }}
              >
                {stone.name.replace(' Stone', '')}
              </span>
            </div>
          ))}
        </div>

        {/* Identity Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-[11px] sm:text-xs font-mono tracking-[0.22em] sm:tracking-[0.3em] uppercase mb-4 shadow-[0_0_20px_rgba(212,167,44,0.3)]">
          <Sparkles className="w-4 h-4 text-[#D4A72C]" />
          SMS 2K26 • THE COMMISSIONING SNAP
        </div>

        {/* Theatrical Headline */}
        <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-marvel font-black tracking-[0.08em] text-white uppercase leading-[0.95] sm:leading-[0.92] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          THE UNIVERSE AWAITS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF0] via-[#F6CC78] to-[#D4A72C]">
            ITS NEXT GUARDIANS.
          </span>
        </h2>

        <p className="mt-6 sm:mt-8 text-sm sm:text-lg text-white/85 font-grotesk max-w-2xl leading-relaxed tracking-wider">
          "A generation united for a greater tomorrow." Will you watch history unfold from the sidelines, or will you take your seat among Earth’s mightiest changemakers?
        </p>

        {/* Primary Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative group w-full sm:w-auto">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] opacity-75 blur-md beacon-aura pointer-events-none" />

            <button
              onClick={handleRegisterClick}
              className="assemble-btn-epic relative inline-flex items-center justify-center gap-3.5 px-9 sm:px-12 py-4.5 sm:py-5 rounded-xl bg-gradient-to-r from-[#D4A72C] via-[#FFFDF5] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel font-black text-sm sm:text-base tracking-[0.24em] sm:tracking-[0.28em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto text-center border-2 border-[#FFFDF5]/50 overflow-hidden shadow-[0_0_40px_rgba(212,167,44,0.7)]"
            >
              {/* Automatic Continuous Crystal Sweep */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/35 skew-x-12 -translate-x-full animate-crystal-sweep pointer-events-none" />
              <Shield className="w-5 h-5 fill-current text-[#050609]" />
              <span className="relative z-10 font-black">ASSEMBLE // CLAIM VIP CREDENTIALS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </button>
          </div>
        </div>

        {/* Security Stamp */}
        <div className="mt-8 text-[11px] font-mono text-white/40 tracking-[0.2em] uppercase">
          SECURE ENCRYPTED CLEARANCE // AIESEC IN SFAX • SFAX MOTIVATIONAL SEMINAR
        </div>
      </div>
    </section>
  );
};
