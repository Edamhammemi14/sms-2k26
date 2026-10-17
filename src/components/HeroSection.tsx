import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Calendar, MapPin, Zap, Flame, Shield, Sparkles, Play } from 'lucide-react';
import { infinityStones } from '../data/stonesData';
import { FacetedStone } from './FacetedStone';
import { audioEngine } from '../utils/audioEngine';

interface HeroSectionProps {
  onStoneSelect: (stoneId: string) => void;
  activeStoneColor: string;
  setActiveStoneColor: (color: string) => void;
  onOpenRegister: () => void;
  onPlayIntro?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStoneSelect,
  activeStoneColor,
  setActiveStoneColor,
  onOpenRegister,
  onPlayIntro,
}) => {
  // Target: October 23, 2026 (SMS 2K26)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [hoveredStone, setHoveredStone] = useState<string | null>(null);
  const [sealRadius, setSealRadius] = useState(152);
  const [stoneSize, setStoneSize] = useState(42);

  // Responsive radius calculation so all 6 stones always stay perfectly IN the circle on phone & desktop
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        const w = window.innerWidth;
        if (w < 390) {
          setSealRadius(96);
          setStoneSize(28);
        } else if (w < 640) {
          setSealRadius(112);
          setStoneSize(32);
        } else if (w < 1024) {
          setSealRadius(135);
          setStoneSize(38);
        } else {
          setSealRadius(152);
          setStoneSize(42);
        }
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // High-performance DOM refs for mouse parallax (ZERO React re-renders during mouse movement)
  const heroRef = useRef<HTMLElement | null>(null);
  const emblemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = new Date('2026-10-23T09:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Direct GPU Transform without triggering React state re-renders (desktop only for smooth mobile scrolling)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    if (!heroRef.current || !emblemRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    emblemRef.current.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  };

  const handleMouseLeave = () => {
    if (emblemRef.current) {
      emblemRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    }
  };

  const handleStoneClick = (stone: (typeof infinityStones)[0]) => {
    audioEngine.playStoneResonance(stone.frequency, stone.name, stone.attribute);
    setActiveStoneColor(stone.hex);
    onStoneSelect(stone.id);
  };

  const handleStoneHover = (stone: (typeof infinityStones)[0] | null) => {
    if (stone) {
      setHoveredStone(stone.name);
      setActiveStoneColor(stone.hex);
      audioEngine.playHudBeep(stone.frequency, 0.035);
    } else {
      setHoveredStone(null);
      setActiveStoneColor('#D4A72C');
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050609]"
    >
      {/* 35mm Celluloid Film Grain */}
      <div className="film-grain" />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 cinematic-vignette pointer-events-none z-10" />

      {/* Dynamic Cosmic Radial Glow (Pure, clean cosmic gradient without watermark slides) */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 68% 40%, ${activeStoneColor}22 0%, rgba(36, 19, 61, 0.25) 45%, rgba(5, 6, 9, 0.98) 85%)`,
        }}
      />

      {/* Subtle Anamorphic Lens Flare Line */}
      <div className="anamorphic-streak top-1/2 -translate-y-1/2 opacity-60" />

      {/* Central Hero Theatrical Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Epic Marvel Studios Editorial Title */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* S.H.I.E.L.D. Tactical Clearance Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-mono tracking-[0.25em] uppercase mb-5 shadow-[0_0_20px_rgba(212,167,44,0.25)]">
              <Shield className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>AIESEC IN SFAX // OCT 23–25, 2026</span>
            </div>

            {/* Main Theatrical Headline in Cinzel / font-marvel */}
            <h1 className="font-marvel font-black uppercase text-4xl sm:text-6xl md:text-7xl xl:text-8xl tracking-[0.07em] leading-[0.98] drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]">
              <span className="block text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.25)]">
                SMS 2K26
              </span>
              <span
                className="block text-transparent bg-clip-text transition-all duration-700 drop-shadow-[0_0_40px_rgba(212,167,44,0.6)]"
                style={{
                  backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, #F6CC78 35%, ${activeStoneColor} 70%, #996B12 100%)`,
                }}
              >
                DESTINY ARRIVES
              </span>
            </h1>

            {/* Divider Tagline */}
            <div className="flex items-center gap-3 my-4">
              <span className="h-[2px] w-12 bg-gradient-to-r from-[#D4A72C] to-transparent" />
              <p className="text-xs sm:text-sm font-marvel font-bold tracking-[0.3em] text-[#F6CC78] uppercase">
                ONE MISSION • SIX STONES • INFINITE IMPACT
              </p>
            </div>

            {/* Cinematic Creed from Visual Charter */}
            <blockquote className="my-3 text-base sm:text-lg text-white/90 font-grotesk max-w-xl leading-relaxed italic border-l-2 border-[#D4A72C] pl-4 py-1">
              "A Generation United for a Greater Tomorrow."
            </blockquote>

            <p className="mt-2 text-xs sm:text-sm text-white/70 font-body max-w-lg leading-relaxed">
              Step onto the cosmic stage where Sfax's boldest youth changemakers assemble. Harness the six primordial pillars of leadership to awaken your power, unite under one oath, and forge generational legacy.
            </p>

            {/* Epic Call To Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full">
              {/* Primary High-Value Hero CTA: Assemble */}
              <div className="relative group w-full sm:w-auto">
                {/* Outward Radiating Pulsing Beacon Aura */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] opacity-75 blur-md beacon-aura pointer-events-none" />

                <button
                  onClick={() => {
                    onOpenRegister();
                  }}
                  className="assemble-btn-epic relative inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4 sm:py-4.5 rounded-xl bg-gradient-to-r from-[#D4A72C] via-[#FFFDF5] via-[#F6CC78] to-[#D4A72C] bg-[length:200%_auto] text-[#050609] font-marvel font-black text-sm sm:text-base tracking-[0.24em] sm:tracking-[0.28em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto text-center border-2 border-[#FFFDF5]/50 shadow-[0_0_35px_rgba(212,167,44,0.7)]"
                >
                  {/* Automatic Continuous Crystal Sweep */}
                  <div className="absolute inset-0 w-1/2 h-full bg-white/35 skew-x-12 -translate-x-full animate-crystal-sweep pointer-events-none" />
                  
                  {/* Interactive hover gleam */}
                  <div className="absolute inset-0 w-2/3 h-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-700 ease-out pointer-events-none" />

                  {/* Icon */}
                  <div className="p-1 rounded bg-[#050609]/10 border border-[#050609]/20 shadow-inner">
                    <Zap className="w-5 h-5 fill-current text-[#050609] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  </div>

                  <span className="relative z-10 font-black drop-shadow-sm">ASSEMBLE FOR SMS 2K26</span>
                  
                  <ArrowRight className="w-4 h-4 text-[#050609] transition-transform duration-300 group-hover:translate-x-1.5" />

                  {/* Pulsing Live Enlistment Badge */}
                  <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-[#E50914] text-white text-[9px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(229,9,20,0.85)] border border-white/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <a
                  href="#stones"
                  onClick={(e) => {
                    e.preventDefault();
                    audioEngine.playTacticalClick();
                    document.getElementById('stones')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded border border-[#D4A72C]/40 bg-[#0D1326]/60 hover:bg-[#D4A72C]/15 hover:border-[#F6CC78] text-[#F6CC78] font-mono text-xs tracking-[0.16em] uppercase transition-all duration-300 active:scale-95 text-center"
                >
                  <Flame className="w-4 h-4 text-[#D96A32]" />
                  <span>6 STONES</span>
                </a>

                {onPlayIntro && (
                  <button
                    onClick={() => {
                      audioEngine.playCinematicBraaam();
                      onPlayIntro();
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#D4A72C]/40 text-white/80 hover:text-white font-mono text-xs tracking-[0.16em] uppercase transition-all duration-300 active:scale-95 text-center"
                  >
                    <Play className="w-3.5 h-3.5 text-[#F6CC78] fill-current" />
                    <span>PROLOGUE</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Stone Resonance HUD Feedback */}
            <div className="mt-6 h-6 flex items-center gap-2 text-xs font-mono">
              {hoveredStone ? (
                <span className="animate-pulse font-bold tracking-wider" style={{ color: activeStoneColor }}>
                  ▸ HARMONIC RESONANCE: {hoveredStone.toUpperCase()} // UNLOCKED
                </span>
              ) : (
                <span className="text-white/45 tracking-wider text-[11px] sm:text-xs">
                  ▸ TOUCH THE ORBITING RELICS TO CALIBRATE POWER FREQUENCIES
                </span>
              )}
            </div>
          </div>

          {/* Right Column: The Grand Infinity Seal with ALL 6 STONES IN THE CIRCLE */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center my-4 sm:my-0">
            <div
              ref={emblemRef}
              className="relative w-64 h-64 xs:w-72 xs:h-72 sm:w-80 sm:h-80 md:w-[440px] md:h-[440px] rounded-full flex items-center justify-center select-none transition-transform duration-500 ease-out will-change-transform shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
              style={{
                transform: 'perspective(1000px)',
                background: 'radial-gradient(circle at 48% 48%, rgba(13, 19, 38, 0.98) 0%, rgba(5, 6, 9, 0.99) 70%, #050609 100%)',
                border: `3px solid ${activeStoneColor}`,
                boxShadow: `0 0 70px ${activeStoneColor}45, inset 0 0 50px ${activeStoneColor}30, 0 25px 70px rgba(0,0,0,0.95)`,
              }}
            >
              {/* Outer Golden Bezel Accent Ring Inside Circle */}
              <div
                className="absolute inset-3 sm:inset-4 rounded-full border border-[#D4A72C]/35 pointer-events-none"
                style={{ borderStyle: 'dashed' }}
              />

              {/* Inner Cosmic Stardust Ring */}
              <div
                className="absolute inset-10 sm:inset-12 rounded-full border border-white/10 pointer-events-none animate-orbit"
              />

              {/* Central Official SMS 2K26 Emblem */}
              <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center pointer-events-none select-none">
                <img
                  src="/brand/sms_logo_gold.png"
                  alt="Official SMS 2K26 Logo"
                  className="w-28 xs:w-32 sm:w-44 md:w-52 h-auto object-contain filter drop-shadow-[0_0_24px_rgba(212,167,44,0.9)] transition-transform duration-500 hover:scale-105"
                />
                <span className="text-[10px] sm:text-xs font-marvel tracking-[0.35em] text-[#F6CC78] font-bold mt-1 uppercase">
                  OC SMS
                </span>
              </div>

              {/* ALL SIX 3D FACETED INFINITY STONES IN THE CIRCLE */}
              {infinityStones.map((stone, index) => {
                // Symmetrically distributed inside the golden circle perimeter (starting top 12 o'clock = -90 deg)
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const x = Math.cos(angle) * sealRadius;
                const y = Math.sin(angle) * sealRadius;

                const isCurrent = activeStoneColor === stone.hex;
                const isHovered = hoveredStone === stone.name;

                return (
                  <button
                    key={stone.id}
                    onClick={() => handleStoneClick(stone)}
                    onMouseEnter={() => handleStoneHover(stone)}
                    onMouseLeave={() => handleStoneHover(null)}
                    className="group absolute z-30 flex flex-col items-center justify-center transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    aria-label={`Inspect ${stone.name}`}
                  >
                    {/* Glowing Socket Mounting Bezel Inside the Circle */}
                    <div
                      className={`rounded-full p-1 sm:p-1.5 transition-all duration-300 flex items-center justify-center ${
                        isCurrent || isHovered
                          ? 'bg-[#050609] scale-110 shadow-lg'
                          : 'bg-[#050609]/90 border border-white/15 hover:border-[#D4A72C]/60'
                      }`}
                      style={{
                        border: `1.5px solid ${isCurrent || isHovered ? stone.hex : 'rgba(212, 167, 44, 0.4)'}`,
                        boxShadow: isCurrent || isHovered ? `0 0 25px ${stone.hex}90, inset 0 0 10px ${stone.hex}50` : undefined,
                      }}
                    >
                      {/* 3D Faceted Crystal Gemstone */}
                      <FacetedStone
                        id={stone.id}
                        color={stone.hex}
                        size={stoneSize}
                        isSelected={isCurrent}
                        isHovered={isHovered}
                      />
                    </div>

                    {/* Stone Tooltip Badge positioned cleanly above or below */}
                    <span
                      className={`absolute whitespace-nowrap text-[8px] sm:text-[9px] font-marvel font-bold tracking-[0.2em] px-2 py-0.5 rounded bg-[#050609]/95 border border-[#D4A72C]/40 transition-all duration-200 pointer-events-none shadow-xl ${
                        y < 0 ? '-top-6' : '-bottom-6'
                      } ${
                        isCurrent || isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                      style={{ color: stone.hex }}
                    >
                      {stone.name.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Theatrical Countdown HUD to SMS 2K26 */}
        <div className="mt-16 bg-[#0D1326]/85 border border-[#D4A72C]/30 rounded-xl p-5 sm:p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-xs font-marvel tracking-[0.25em] text-[#F6CC78] uppercase flex items-center gap-2 font-bold">
                <Zap className="w-4 h-4 text-[#D4A72C]" />
                COUNTDOWN TO CONVERGENCE
              </span>
              <span className="text-xs text-white/60 font-mono mt-1 tracking-wider">
                OCTOBER 23, 2026 • 35°46' N, 10°50' E (MONASTIR CENTER HOTEL, TUNISIA)
              </span>
            </div>

            {/* Countdown Digit Blocks with Metallic Chiseled Bevels */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full sm:w-auto">
              {[
                { label: 'DAYS', val: timeLeft.days },
                { label: 'HOURS', val: String(timeLeft.hours).padStart(2, '0') },
                { label: 'MINUTES', val: String(timeLeft.minutes).padStart(2, '0') },
                { label: 'SECONDS', val: String(timeLeft.seconds).padStart(2, '0') },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="flex flex-col items-center justify-center bg-[#050609]/90 border border-[#D4A72C]/25 rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[76px] shadow-inner transition-transform duration-300 hover:scale-105"
                >
                  <span className="font-marvel font-black text-xl sm:text-3xl text-[#F6CC78] tracking-wider drop-shadow-[0_2px_8px_rgba(212,167,44,0.4)]">
                    {unit.val}
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-mono text-white/50 tracking-[0.15em] sm:tracking-[0.2em] mt-0.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Down Scroll Indicator */}
        <div className="mt-12 flex flex-col items-center">
          <a
            href="#mission"
            onClick={(e) => {
              e.preventDefault();
              audioEngine.playTacticalClick();
              document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-[#F6CC78] transition-colors"
            aria-label="Scroll to Mission"
          >
            <span className="text-[9px] font-mono tracking-[0.25em]">DISCOVER THE SAGA</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#D4A72C]" />
          </a>
        </div>
      </div>
    </section>
  );
};
