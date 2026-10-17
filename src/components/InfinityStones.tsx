import React, { useState } from 'react';
import { X, Sparkles, Flame, Volume2, ArrowUpRight, Shield } from 'lucide-react';
import { infinityStones } from '../data/stonesData';
import { Stone } from '../types';
import { FacetedStone } from './FacetedStone';
import { audioEngine } from '../utils/audioEngine';

interface InfinityStonesProps {
  selectedStoneId: string | null;
  onSelectStone: (stoneId: string | null) => void;
  onStoneHoverColor: (color: string) => void;
}

const stoneArtifactNames: Record<string, { relic: string; vessel: string; roman: string }> = {
  power: { relic: 'THE POWER STONE', vessel: 'THE ORB OF MORAG', roman: 'RELIC I' },
  space: { relic: 'THE SPACE STONE', vessel: 'THE TESSERACT', roman: 'RELIC II' },
  reality: { relic: 'THE REALITY STONE', vessel: 'THE AETHER', roman: 'RELIC III' },
  soul: { relic: 'THE SOUL STONE', vessel: 'THE VORMIR ALTAR', roman: 'RELIC IV' },
  time: { relic: 'THE TIME STONE', vessel: 'THE EYE OF AGAMOTTO', roman: 'RELIC V' },
  mind: { relic: 'THE MIND STONE', vessel: "VISION'S CORE", roman: 'RELIC VI' },
};

export const InfinityStones: React.FC<InfinityStonesProps> = ({
  selectedStoneId,
  onSelectStone,
  onStoneHoverColor,
}) => {
  const [activeModalStone, setActiveModalStone] = useState<Stone | null>(null);

  const handleCardClick = (stone: Stone) => {
    audioEngine.playStoneResonance(stone.frequency, stone.name, stone.attribute);
    setActiveModalStone(stone);
    onSelectStone(stone.id);
  };

  const handleHover = (stone: Stone | null) => {
    if (stone) {
      onStoneHoverColor(stone.hex);
      audioEngine.playHudBeep(stone.frequency, 0.03);
    } else {
      onStoneHoverColor('#D4A72C');
    }
  };

  const closeModal = () => {
    audioEngine.playTacticalClick();
    setActiveModalStone(null);
    onSelectStone(null);
  };

  return (
    <section id="stones" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050609] border-t border-[#D4A72C]/20 overflow-hidden">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      {/* Background Obsidian & Gold Vein Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-color-dodge filter contrast-150"
        style={{ backgroundImage: 'url(/brand/texture_obsidian_gold.jpg)' }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Section Theatrical Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-mono tracking-[0.3em] uppercase mb-4 shadow-[0_0_15px_rgba(212,167,44,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            COSMIC SINGULARITIES • SMS 2K26
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-marvel font-black tracking-[0.08em] text-white uppercase leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            THE SIX INFINITY STONES
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 font-grotesk leading-relaxed tracking-wider">
            "Before creation itself, there were six singularities. Then the universe exploded into existence, and the remnants were forged into concentrated ingots."
          </p>
          <p className="mt-1 text-xs text-[#F6CC78] font-mono tracking-widest uppercase">
            AT SMS 2K26, LEADERSHIP IS DECONSTRUCTED INTO SIX COSMIC FORCES.
          </p>
        </div>

        {/* The Six Ancient Cosmic Vault Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {infinityStones.map((stone) => {
            const isSelected = selectedStoneId === stone.id;
            const meta = stoneArtifactNames[stone.id] || { relic: stone.name, vessel: 'ANCIENT VESSEL', roman: 'RELIC' };

            return (
              <div
                key={stone.id}
                onClick={() => handleCardClick(stone)}
                onMouseEnter={() => handleHover(stone)}
                onMouseLeave={() => handleHover(null)}
                className={`group relative rounded p-6 sm:p-8 cursor-pointer transition-all duration-500 overflow-hidden select-none ${
                  isSelected
                    ? 'scale-[1.02] shadow-[0_0_40px_rgba(212,167,44,0.4)]'
                    : 'hover:scale-[1.02] hover:-translate-y-1'
                }`}
                style={{
                  background: 'linear-gradient(155deg, rgba(13, 19, 38, 0.95), rgba(5, 6, 9, 0.98))',
                  border: `1px solid ${isSelected ? stone.hex : 'rgba(212, 167, 44, 0.25)'}`,
                  boxShadow: isSelected
                    ? `0 0 35px ${stone.glowColor}, inset 0 0 25px ${stone.glowColor}`
                    : '0 10px 30px rgba(0, 0, 0, 0.7)',
                }}
              >
                {/* Background Cosmic Energy on Hover */}
                <div
                  className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: stone.hex }}
                />

                {/* Relic Roman Numeral Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4A72C] font-bold">
                    {meta.roman} //
                  </span>
                  <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white/50">
                    FREQ: {stone.frequency}Hz
                  </span>
                </div>

                {/* 3D Faceted Cosmic Stone Visual Display */}
                <div className="flex items-center gap-5 my-2">
                  <div className="relative flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                    <FacetedStone id={stone.id} color={stone.hex} size={64} isSelected={isSelected} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">
                      {meta.vessel}
                    </span>
                    <h3 className="font-marvel text-2xl font-black tracking-wider text-white uppercase group-hover:text-[#F6CC78] transition-colors leading-tight">
                      {stone.name}
                    </h3>
                    <span className="text-xs font-mono font-bold tracking-wider mt-0.5" style={{ color: stone.hex }}>
                      {stone.attribute}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs text-white/70 font-body leading-relaxed line-clamp-2">
                  {stone.description}
                </p>

                {/* Bottom Footer Info */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/40 group-hover:text-[#F6CC78] transition-colors flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    INSPECT RELIC LORE
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#D4A72C] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holographic Marvel Lore Modal */}
      {activeModalStone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[#0D1326] border p-5 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto touch-scroll"
            style={{
              borderColor: activeModalStone.hex,
              boxShadow: `0 0 50px ${activeModalStone.glowColor}, inset 0 0 30px rgba(0,0,0,0.8)`,
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full border border-white/20 bg-black/60 hover:bg-white/20 text-white transition-all active:scale-95 z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 pb-6 border-b border-white/10 pt-2 sm:pt-0">
              <div className="shrink-0">
                <FacetedStone id={activeModalStone.id} color={activeModalStone.hex} size={58} isSelected={true} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4A72C]">
                  {stoneArtifactNames[activeModalStone.id]?.vessel || 'ANCIENT COSMIC RELIC'}
                </span>
                <h3 className="font-marvel text-2xl sm:text-4xl font-black text-white uppercase tracking-wider mt-0.5">
                  {activeModalStone.name}
                </h3>
                <span className="text-xs font-mono font-bold tracking-widest mt-1" style={{ color: activeModalStone.hex }}>
                  {activeModalStone.attribute}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 mt-6">
              <div>
                <h4 className="text-[11px] font-marvel tracking-[0.25em] text-[#F6CC78] uppercase mb-2">
                  THE COSMIC LORE & ESSENCE
                </h4>
                <p className="text-sm text-white/85 font-grotesk leading-relaxed">
                  {activeModalStone.description}
                </p>
              </div>

              <div className="p-4 rounded bg-[#050609]/80 border border-[#D4A72C]/30">
                <h4 className="text-[11px] font-marvel tracking-[0.25em] text-[#D4A72C] uppercase mb-1.5 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  SMS 2K26 LEADERSHIP DOCTRINE
                </h4>
                <p className="text-xs text-white/80 font-body leading-relaxed italic">
                  "{activeModalStone.leadershipLore}"
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-marvel tracking-[0.25em] text-[#F6CC78] uppercase mb-2">
                  CRITICAL SAGA TAKEAWAYS
                </h4>
                <ul className="space-y-2">
                  {activeModalStone.takeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-white/75 font-body">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: activeModalStone.hex }} />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={closeModal}
                className="w-full py-3.5 rounded bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-black tracking-[0.25em] uppercase hover:brightness-110 transition-all shadow-lg"
              >
                CLOSE ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
