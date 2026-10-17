import React from 'react';
import { X, Sparkles, ShieldAlert, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const triggerMoreConfetti = () => {
    audioEngine.playCinematicBraaam();
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#D4A72C', '#F6CC78', '#D96A32', '#F04452', '#35B9FF', '#7B2CFF'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D1326] border-2 border-[#D4A72C] p-5 sm:p-8 shadow-[0_0_100px_rgba(212,167,44,0.6)] text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-white/20 bg-black/60 hover:bg-white/10 text-white transition-all active:scale-95"
          aria-label="Close easter egg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official SMS 2K26 Emblem */}
        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <img
            src="/brand/sms_logo_gold.png"
            alt="SMS 2K26 Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(212,167,44,0.8)]"
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#050609] border border-[#D4A72C]/50 text-[#F6CC78] text-xs font-mono tracking-[0.25em] uppercase mb-4 shadow-[0_0_15px_rgba(212,167,44,0.3)]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#D4A72C]" />
          CLASSIFIED PROTOCOL: THE SNAP EXECUTED
        </div>

        {/* Title */}
        <h3 className="text-3xl sm:text-4xl font-marvel font-black text-white tracking-wider uppercase">
          THE GAUNTLET IS COMPLETE
        </h3>

        {/* Secret Thanos Quote */}
        <div className="mt-4 p-4 rounded bg-[#050609]/90 border border-[#D4A72C]/40">
          <p className="text-xs sm:text-sm text-[#F6CC78] font-grotesk italic leading-relaxed">
            "I know what it’s like to lose. To feel so desperately that you’re right, yet to fail nonetheless. As long as there are those that remember what was, there will always be those that are unable to accept what can be."
          </p>
          <span className="text-[10px] font-mono text-white/40 tracking-widest block mt-2">
            — THANOS // AVENGERS: INFINITY WAR
          </span>
        </div>

        <p className="mt-4 text-xs text-white/75 font-body leading-relaxed">
          You uncovered the hidden frequency (Typed: <strong>THANOS / AVENGERS / SMS</strong>). You possess the tactical curiosity of the Mind Stone and the tenacity of the Power Stone. Step boldly into SMS 2K26.
        </p>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={triggerMoreConfetti}
            className="flex-1 py-3 rounded bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel font-black text-xs tracking-[0.2em] uppercase hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>UNLEASH COSMIC SHOCKWAVE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
