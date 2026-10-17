import React, { useState, useEffect } from 'react';
import { FastForward, Play, X } from 'lucide-react';
import { FacetedStone } from './FacetedStone';
import { audioEngine } from '../utils/audioEngine';

interface IntroSequenceProps {
  onComplete: () => void;
}

const introStones = [
  { id: 'power', name: 'POWER', color: '#F04452', title: 'DECISIVE COURAGE', delay: 400, angle: 0 },
  { id: 'space', name: 'SPACE', color: '#35B9FF', title: 'BOUNDLESS HORIZONS', delay: 900, angle: 60 },
  { id: 'reality', name: 'REALITY', color: '#D62E45', title: 'CREATIVE TRANSFORMATION', delay: 1400, angle: 120 },
  { id: 'soul', name: 'SOUL', color: '#FF8C42', title: 'SACRIFICE & UNITY', delay: 1900, angle: 180 },
  { id: 'time', name: 'TIME', color: '#45D483', title: 'ENDURING LEGACY', delay: 2400, angle: 240 },
  { id: 'mind', name: 'MIND', color: '#F5C451', title: 'STRATEGIC VISION', delay: 2900, angle: 300 },
];

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'prologue' | 'stones' | 'converging' | 'revealed'>('prologue');
  const [visibleStones, setVisibleStones] = useState<number[]>([]);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const quotes = [
    "DREAD IT. RUN FROM IT.",
    "DESTINY ARRIVES ALL THE SAME.",
    "AND NOW, IT'S HERE."
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Prologue quotes timing
    const q1 = setTimeout(() => setQuoteIdx(1), 1100);
    const q2 = setTimeout(() => setQuoteIdx(2), 2200);

    // Transition to Stones ignition
    const stonesTimer = setTimeout(() => {
      setPhase('stones');
      audioEngine.playStoneResonance(220);
    }, 3200);

    // Ignite each stone
    introStones.forEach((stone, index) => {
      setTimeout(() => {
        setVisibleStones((prev) => [...prev, index]);
        audioEngine.playStoneResonance(220 + index * 60);
      }, 3400 + index * 450);
    });

    // Convergence
    const convergeTimer = setTimeout(() => {
      setPhase('converging');
      audioEngine.playQuantumWarp();
    }, 6200);

    // Logo reveal with cinematic trailer braaam
    const revealTimer = setTimeout(() => {
      setPhase('revealed');
      audioEngine.playCinematicBraaam();
    }, 7200);

    return () => {
      clearTimeout(q1);
      clearTimeout(q2);
      clearTimeout(stonesTimer);
      clearTimeout(convergeTimer);
      clearTimeout(revealTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    audioEngine.playCinematicBraaam();
    onComplete();
  };

  const handleEnter = () => {
    audioEngine.playCinematicBraaam();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050609] overflow-y-auto select-none p-4 sm:p-6">
      {/* 35mm Celluloid Film Grain */}
      <div className="film-grain" />

      {/* Cinematic Top Letterbox Bar */}
      <div className="absolute top-0 left-0 right-0 h-9 bg-black/90 z-40 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 text-[10px] font-mono text-white/40 tracking-widest">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          REC ● 24 FPS [ANAMORPHIC 2.39:1]
        </span>
        <span className="hidden sm:inline">AIESEC IN SFAX // THE INFINITY SAGA</span>
        <span>SMS-2K26</span>
      </div>

      {/* Cinematic Bottom Letterbox Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-9 bg-black/90 z-40 border-t border-white/5 flex items-center justify-between px-4 sm:px-6 text-[10px] font-mono text-white/40 tracking-widest">
        <span>SECTOR: SFAX, TUNISIA</span>
        <span className="hidden sm:inline">OCTOBER 23–25, 2026</span>
        <span>ESC TO SKIP</span>
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute top-12 right-4 sm:top-14 sm:right-6 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4A72C]/40 bg-[#050609]/90 hover:bg-[#D4A72C]/20 hover:border-[#F6CC78] text-[#F6CC78] transition-all text-xs font-mono tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(212,167,44,0.3)]"
        aria-label="Skip Cinematic Trailer"
      >
        <FastForward className="w-3.5 h-3.5" />
        <span>SKIP TRAILER</span>
      </button>

      {/* Background Deep Cosmic Nebula */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(36,19,61,0.6)_0%,_rgba(13,19,38,0.85)_50%,_rgba(5,6,9,1)_100%)] pointer-events-none" />

      {/* Horizontal Anamorphic Lens Flare */}
      <div className="anamorphic-streak top-1/2 -translate-y-1/2 opacity-70" />

      {/* PHASE 1: Dramatic Prologue Typography */}
      {phase === 'prologue' && (
        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl animate-[fadeIn_0.8s_ease-out]">
          <p className="text-xs sm:text-sm font-mono tracking-[0.4em] text-[#D4A72C] uppercase mb-4">
            AIESEC IN SFAX PRESENTS
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-marvel font-bold text-white tracking-[0.2em] leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            {quotes[quoteIdx]}
          </h2>
          <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4A72C] to-transparent animate-pulse" />
        </div>
      )}

      {/* PHASE 2 & 3: The 6 Stones Ignition & Convergence Arena */}
      {(phase === 'stones' || phase === 'converging') && (
        <div className="relative w-full max-w-3xl h-[400px] sm:h-[480px] flex items-center justify-center">
          {/* Orbital Celestial Rings */}
          <div
            className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#D4A72C]/25 transition-all duration-1000 ${
              phase === 'converging' ? 'scale-25 opacity-20' : 'scale-100 opacity-60'
            }`}
            style={{
              animation: 'orbitClockwise 28s linear infinite',
              borderStyle: 'dashed',
            }}
          />
          <div
            className={`absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-[#35B9FF]/30 transition-all duration-1000 ${
              phase === 'converging' ? 'scale-10 opacity-10' : 'scale-100 opacity-70'
            }`}
            style={{
              animation: 'orbitCounterClockwise 20s linear infinite',
            }}
          />

          {/* Central Celestial Core */}
          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-[#D4A72C]/40 to-[#24133D]/60 blur-xl animate-pulse" />

          {/* The 6 Faceted Crystalline Infinity Stones */}
          {introStones.map((stone, index) => {
            const isVisible = visibleStones.includes(index);
            const isSmall = typeof window !== 'undefined' && window.innerWidth < 480;
            const baseRadius = isSmall ? 98 : 130;
            const radius = phase === 'converging' ? 12 : baseRadius;
            const angleRad = (stone.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <div
                key={stone.id}
                className="absolute transition-all duration-700 ease-out flex flex-col items-center"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${isVisible ? (phase === 'converging' ? 0.2 : 1) : 0})`,
                  opacity: isVisible ? (phase === 'converging' ? 0.3 : 1) : 0,
                }}
              >
                {/* 3D Faceted Cosmic Gemstone */}
                <FacetedStone id={stone.id} color={stone.color} size={isSmall ? 32 : 42} isSelected={isVisible} />

                {phase === 'stones' && isVisible && (
                  <div className="mt-2 flex flex-col items-center">
                    <span
                      className="text-[9px] font-marvel tracking-[0.25em] font-bold uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]"
                      style={{ color: stone.color }}
                    >
                      {stone.name}
                    </span>
                    <span className="text-[7px] font-mono tracking-widest text-white/50">
                      {stone.title}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Supernova Flash on Convergence */}
          {phase === 'converging' && (
            <div className="absolute w-40 h-40 bg-white rounded-full animate-ping opacity-90 blur-lg" />
          )}
        </div>
      )}

      {/* PHASE 4: THE OFFICIAL SMS 2K26 AVENGERS REVEAL */}
      {phase === 'revealed' && (
        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-3xl my-auto animate-[fadeIn_0.8s_ease-out]">
          {/* Sfax Edition Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4A72C]/40 bg-[#0D1326]/80 text-[#F6CC78] text-[11px] font-mono tracking-[0.25em] uppercase mb-4 shadow-[0_0_20px_rgba(212,167,44,0.3)]">
            AIESEC IN SFAX • SFAX MOTIVATIONAL SEMINAR
          </div>

          {/* Official SMS 2K26 Metallic Logo */}
          <div className="relative w-40 sm:w-52 h-24 sm:h-32 flex items-center justify-center my-1">
            <img
              src="/brand/sms_logo_gold.png"
              alt="SMS 2K26 Avengers Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(212,167,44,0.8)]"
            />
          </div>

          {/* Epic Movie Title */}
          <h1 className="mt-1 text-3xl sm:text-5xl md:text-6xl font-marvel font-black tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#F6CC78] to-[#996B12] drop-shadow-[0_4px_30px_rgba(212,167,44,0.7)] leading-tight uppercase">
            SFAX MOTIVATIONAL SEMINAR
          </h1>

          <div className="flex items-center gap-3 my-2.5">
            <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-[#D4A72C] to-transparent" />
            <p className="text-sm sm:text-lg font-marvel font-bold tracking-[0.3em] text-[#F6CC78]">
              ONE MISSION. SIX STONES.
            </p>
            <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-[#D4A72C] to-transparent" />
          </div>

          {/* Tagline & Date */}
          <p className="text-xs sm:text-sm text-white/80 font-grotesk max-w-md mb-6 leading-relaxed tracking-wider">
            "A GENERATION UNITED FOR A GREATER TOMORROW"
            <br />
            <span className="text-[11px] font-mono text-[#D4A72C] tracking-widest mt-1 block">
              OCTOBER 23–25, 2026 • SFAX, TUNISIA
            </span>
          </p>

          {/* Enter The Experience CTA */}
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel font-black text-xs sm:text-sm tracking-[0.25em] uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,167,44,0.9)] active:scale-95"
          >
            <span>ENTER THE INFINITY EXPERIENCE</span>
            <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
};
