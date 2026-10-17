import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { awaitsCapabilities } from '../data/awaitsData';
import { audioEngine } from '../utils/audioEngine';

interface WhatAwaitsYouProps {
  onOpenRegister: () => void;
}

export const WhatAwaitsYou: React.FC<WhatAwaitsYouProps> = ({ onOpenRegister }) => {
  return (
    <section id="capabilities" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050609] border-t border-[#D4A72C]/20 overflow-hidden">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-mono tracking-[0.3em] uppercase mb-4 shadow-[0_0_15px_rgba(212,167,44,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            LEADERSHIP TRANSFORMATION CORE // SMS 2K26
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-marvel font-black tracking-[0.08em] text-white uppercase leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            WHAT AWAITS YOU
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 font-grotesk max-w-2xl leading-relaxed tracking-wider">
            SMS 2K26 is not passive theory. It is a high-voltage crucible designed to equip you with tangible powers you will wield across AIESEC, your career, and the future of Tunisia.
          </p>
        </div>

        {/* 3 Core Capability Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {awaitsCapabilities.map((item) => (
            <div
              key={item.number}
              onMouseEnter={() => audioEngine.playHudBeep(800, 0.02)}
              className="group relative rounded bg-[#0D1326]/90 border border-[#D4A72C]/30 p-8 hover:border-[#D4A72C] transition-all duration-500 flex flex-col justify-between shadow-xl hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(212,167,44,0.25)] select-none"
            >
              {/* Corner Glow */}
              <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: item.stoneColor }}
              />

              <div>
                {/* Number & Accent Line */}
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <span
                    className="font-marvel font-black text-4xl"
                    style={{ color: item.stoneColor }}
                  >
                    {item.number}
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4A72C] uppercase font-bold">
                    POWER MANIFEST
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-marvel font-black text-2xl text-white group-hover:text-[#F6CC78] transition-colors uppercase leading-tight">
                  {item.title}
                </h3>
                <h4 className="text-xs font-mono text-white/50 tracking-wider mt-1 mb-4 italic">
                  {item.subtitle}
                </h4>

                {/* Description */}
                <p className="text-sm text-white/75 font-body leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* What You Gain List */}
                <div className="pt-6 border-t border-white/10">
                  <span className="text-[10px] font-marvel tracking-[0.2em] uppercase text-[#F6CC78] font-bold block mb-3">
                    TACTICAL CAPABILITIES ACQUIRED:
                  </span>
                  <ul className="space-y-3">
                    {item.gains.map((gain, gIndex) => (
                      <li key={gIndex} className="flex items-start gap-2.5 text-xs text-white/85 font-body leading-snug">
                        <ShieldCheck
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: item.stoneColor }}
                        />
                        <span>{gain}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-white/40">
                  SMS 2K26 // SFAX
                </span>
                <button
                  onClick={() => {
                    onOpenRegister();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-marvel tracking-widest text-[#F6CC78] hover:text-white font-bold transition-colors group-hover:translate-x-1"
                >
                  <span>CLAIM SEAT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4A72C]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
