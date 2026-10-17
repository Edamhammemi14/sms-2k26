import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Calendar, ShieldCheck, Check, Copy, Radio, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const sectorFeatures = [
  {
    id: 'plenary',
    code: 'SECTOR 01',
    title: 'GRAND PLENARY AMPHITHEATER',
    desc: 'Acoustically tuned master hall for high-impact cinematic keynotes, national assemblies, and opening ceremonies.',
    status: 'ACOUSTIC MATRIX ACTIVE',
    bearing: 'MAIN AMPHITHEATER',
  },
  {
    id: 'labs',
    code: 'SECTOR 02',
    title: 'INFINITY BREAKOUT LABS',
    desc: 'Dedicated tactical strategy chambers engineered for the 6 Stones leadership crucibles and interactive workshops.',
    status: '6 STONES LAB ARMED',
    bearing: 'TACTICAL WING',
  },
  {
    id: 'gala',
    code: 'SECTOR 03',
    title: 'GALA & NETWORKING ARENA',
    desc: 'Prestigious grand ballroom and banquet setting for the Night of Earth’s Mightiest celebration.',
    status: 'ROYAL BANQUET CONFIRMED',
    bearing: 'GRAND BALLROOM',
  },
  {
    id: 'transit',
    code: 'SECTOR 04',
    title: 'STRATEGIC TRANSIT CORRIDOR',
    desc: 'Prime coastal downtown avenue with seamless transit connections linking all incoming Local Committees.',
    status: 'NATIONAL ARTERY OPEN',
    bearing: 'AVE. HABIB BOURGUIBA',
  },
];

export const SafehouseVenue: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);
  const coordinates = '35.7707° N, 10.8382° E';

  const currentSector = sectorFeatures[activeSectorIndex];

  const handleCopyCoordinates = () => {
    audioEngine.playTacticalClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('35.7707, 10.8382');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSectorSelect = (index: number) => {
    setActiveSectorIndex(index);
    audioEngine.playHudBeep(700 + index * 80, 0.03);
  };

  return (
    <section id="location" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050609] border-t border-[#D4A72C]/20 overflow-hidden">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-mono tracking-[0.3em] uppercase mb-4 shadow-[0_0_15px_rgba(212,167,44,0.25)]">
            <Compass className="w-3.5 h-3.5 text-[#F04452]" />
            COSMIC SANCTUARY // OPERATIONAL SECTOR
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-marvel font-black tracking-[0.08em] text-white uppercase leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            THE SANCTUARY // MONASTIR CENTER HOTEL
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70 font-grotesk max-w-2xl leading-relaxed tracking-wider">
            The secured fortress where Earth's Mightiest delegates converge. Stationed at the prestigious Monastir Center Hotel along the Mediterranean coast of Tunisia.
          </p>
        </div>

        {/* Synchronized Venue Layout Grid (Equal Height items-stretch) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: S.H.I.E.L.D. Holographic Radar HUD */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative h-full min-h-[360px] sm:min-h-[440px] lg:min-h-full rounded-2xl bg-[#0D1326] border border-[#D4A72C]/40 p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(212,167,44,0.25)]">
              {/* Background Radar Rings */}
              <div className="absolute inset-8 rounded-full border border-white/10 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-[#D4A72C]/25 pointer-events-none" />
              <div className="absolute inset-36 rounded-full border border-white/5 pointer-events-none" />

              {/* Crosshairs */}
              <div className="absolute inset-x-4 top-1/2 h-[1px] bg-[#D4A72C]/20 pointer-events-none" />
              <div className="absolute inset-y-4 left-1/2 w-[1px] bg-[#D4A72C]/20 pointer-events-none" />

              {/* Sweeping Radar Beam */}
              <div
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,_rgba(212,167,44,0.3)_0deg,_transparent_65deg)] animate-spin-slow pointer-events-none"
              />

              {/* Top Radar HUD Bar */}
              <div className="relative z-10 flex items-center justify-between w-full pb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#D4A72C]">
                  <Radio className="w-3.5 h-3.5 text-[#D4A72C] animate-pulse" />
                  <span>RADAR SWEEP // LIVE</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#45D483]/10 border border-[#45D483]/30 text-[9px] font-mono text-[#45D483]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>PERIMETER ACTIVE</span>
                </div>
              </div>

              {/* Central Synchronized Marker Hub */}
              <div className="relative z-10 flex flex-col items-center text-center my-auto py-6">
                <div className="w-14 h-14 rounded-full bg-[#F04452]/20 border-2 border-[#F04452] flex items-center justify-center animate-bounce shadow-[0_0_25px_#F04452] mb-3">
                  <MapPin className="w-7 h-7 text-[#F04452]" />
                </div>
                
                <span className="px-3 py-0.5 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/60 text-[10px] font-marvel font-bold tracking-[0.2em] text-[#F6CC78] shadow-lg">
                  WAYPOINT LOCKED
                </span>
                
                <h4 className="text-base sm:text-lg font-marvel font-black text-white mt-1.5 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  HÔTEL MONASTIR CENTER
                </h4>
                
                <span className="text-xs font-mono text-[#D4A72C] mt-1 tracking-widest font-semibold">
                  35°46'15" N • 10°50'17" E
                </span>

                {/* Real-time Sector Synchronization Badge */}
                <div className="mt-4 px-3.5 py-1.5 rounded-lg bg-[#050609]/90 border border-[#D4A72C]/35 text-[10px] font-mono text-[#F6CC78] flex items-center gap-2 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-[#45D483] animate-ping" />
                  <span>SYNC: {currentSector.code} — {currentSector.status}</span>
                </div>
              </div>

              {/* Bottom Radar Telemetry Bar */}
              <div className="relative z-10 flex items-center justify-between w-full pt-3 border-t border-white/10 text-[10px] font-mono text-white/50">
                <span>ZONE: MONASTIR, TN</span>
                <span className="text-[#F6CC78] font-bold tracking-wider">{currentSector.bearing}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sector Briefing Details */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="h-full rounded-2xl bg-[#0D1326]/90 border border-[#D4A72C]/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
              <div>
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-white/10 mb-5 gap-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4A72C] block">
                      RECONNAISSANCE DOSSIER
                    </span>
                    <h3 className="font-marvel text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1 leading-tight">
                      SECTOR: MONASTIR CENTER HOTEL
                    </h3>
                    <p className="text-xs font-mono text-[#F6CC78] mt-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F04452] shrink-0" />
                      <span>Avenue Habib Bourguiba, 5000 Monastir, Tunisia</span>
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-[#050609]/80 border border-[#D4A72C]/30 text-left sm:text-right shrink-0">
                    <span className="text-[9px] font-mono uppercase text-white/50 block tracking-widest">CONVERGENCE</span>
                    <p className="text-xs font-mono font-bold text-[#F6CC78] whitespace-nowrap">OCT 23–25, 2026</p>
                  </div>
                </div>

                <p className="text-sm text-white/80 font-grotesk leading-relaxed">
                  Located on Avenue Habib Bourguiba in the vibrant coastal heart of Monastir, Hôtel Monastir Center serves as the fortified command sanctuary for SMS 2K26. Featuring grand conference auditoriums, private strategy chambers, and resort accommodations, it unites changemakers from every corner of Tunisia.
                </p>

                {/* 4 Interactive Synchronized Sector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5 pt-5 border-t border-white/10">
                  {sectorFeatures.map((feat, idx) => {
                    const isSelected = activeSectorIndex === idx;
                    return (
                      <div
                        key={feat.id}
                        onMouseEnter={() => handleSectorSelect(idx)}
                        onClick={() => handleSectorSelect(idx)}
                        className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#D4A72C]/15 border-[#D4A72C] shadow-[0_0_20px_rgba(212,167,44,0.3)] -translate-y-0.5'
                            : 'bg-[#050609]/80 border-white/10 hover:border-[#D4A72C]/50 hover:bg-[#050609]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-marvel font-bold text-xs text-[#F6CC78] tracking-wider">
                            {feat.title}
                          </h4>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                            isSelected ? 'bg-[#D4A72C] text-[#050609] border-[#D4A72C] font-bold' : 'bg-black/60 text-[#D4A72C] border-[#D4A72C]/30'
                          }`}>
                            {feat.code}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 font-body leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Hotel+Monastir+Center+Avenue+Habib+Bourguiba+Monastir+Tunisia"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioEngine.playTacticalClick()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-black tracking-[0.2em] uppercase hover:brightness-110 transition-all shadow-[0_0_25px_rgba(212,167,44,0.5)] active:scale-95 text-center w-full sm:w-auto"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  INITIALIZE TACTICAL NAVIGATION
                </a>

                <button
                  onClick={handleCopyCoordinates}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-[#D4A72C]/40 bg-[#050609]/90 hover:bg-[#D4A72C]/15 text-[#F6CC78] font-mono text-xs tracking-wider transition-all active:scale-95 text-center w-full sm:w-auto"
                  title="Copy GPS Coordinates"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#45D483]" /> : <Copy className="w-3.5 h-3.5 text-[#D4A72C]" />}
                  <span>{copied ? 'COORDINATES COPIED' : coordinates}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
