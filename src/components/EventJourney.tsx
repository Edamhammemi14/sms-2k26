import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, ChevronRight, Zap, Award } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface JourneyEvent {
  time: string;
  title: string;
  type: string;
  description: string;
  stoneAligned: string;
  stoneColor: string;
}

const actsData: {
  act: string;
  date: string;
  title: string;
  theme: string;
  color: string;
  events: JourneyEvent[];
}[] = [
  {
    act: 'ACT I',
    date: 'FRIDAY, OCTOBER 23, 2026',
    title: 'THE CONVERGENCE',
    theme: 'Awakening The Singularities',
    color: '#35B9FF',
    events: [
      {
        time: '14:00 - 16:30',
        title: 'ARRIVAL & TACTICAL CHECK-IN',
        type: 'Logistics',
        description: 'Delegates cross into the SMS 2K26 sanctuary, receive the official VIP Dossier & Stone Alignment.',
        stoneAligned: 'SPACE STONE',
        stoneColor: '#35B9FF',
      },
      {
        time: '17:00 - 19:30',
        title: 'THE OPENING PLENARY: ASSEMBLE',
        type: 'Ceremony',
        description: 'Keynote addresses by AIESEC leadership, presentation of the Organizing Committee, and the official awakening of SMS 2K26.',
        stoneAligned: 'POWER STONE',
        stoneColor: '#F04452',
      },
      {
        time: '20:30 - 23:00',
        title: 'THE GLOBAL VILLAGE & CELESTIAL NIGHT',
        type: 'Cultural Nexus',
        description: 'Immersive cross-cultural celebration uniting traditions, regional delicacies, and first alliances.',
        stoneAligned: 'SOUL STONE',
        stoneColor: '#FF8C42',
      },
    ],
  },
  {
    act: 'ACT II',
    date: 'SATURDAY, OCTOBER 24, 2026',
    title: 'THE CRUCIBLE',
    theme: 'Forging Unstoppable Will',
    color: '#F5C451',
    events: [
      {
        time: '09:00 - 12:30',
        title: 'SIX STONES LEADERSHIP GAUNTLET',
        type: 'Intensive Labs',
        description: 'Breakout simulation rooms deconstructing data-driven strategy, emotional fortitude, and team mastery.',
        stoneAligned: 'MIND STONE',
        stoneColor: '#F5C451',
      },
      {
        time: '14:00 - 18:00',
        title: 'THE REALITY BENDER HACKATHON',
        type: 'Execution Sprint',
        description: 'Teams race against the clock to solve complex real-world youth and community challenges in Tunisia.',
        stoneAligned: 'REALITY STONE',
        stoneColor: '#D62E45',
      },
      {
        time: '20:30 - 00:00',
        title: 'THE INFINITY GALA & AWARDS NIGHT',
        type: 'Gala Dinner',
        description: 'An elegant theatrical banquet celebrating standout achievements, artistic performances, and unbreakable brotherhood.',
        stoneAligned: 'TIME STONE',
        stoneColor: '#45D483',
      },
    ],
  },
  {
    act: 'ACT III',
    date: 'SUNDAY, OCTOBER 25, 2026',
    title: 'THE INFINITY IMPACT',
    theme: 'Generational Commissioning',
    color: '#45D483',
    events: [
      {
        time: '09:30 - 12:00',
        title: 'STRATEGIC COMMITMENT & ROADMAP 2027',
        type: 'Commitment Plenary',
        description: 'Translating weekend breakthroughs into concrete annual action plans for each delegate’s local committee.',
        stoneAligned: 'TIME STONE',
        stoneColor: '#45D483',
      },
      {
        time: '13:30 - 15:30',
        title: 'THE COMMISSIONING SNAP & CLOSING PLENARY',
        type: 'Grand Finale',
        description: 'The symbolic Gauntlet Snap: unleashing delegates back into the world as certified guardians of tomorrow.',
        stoneAligned: 'POWER STONE',
        stoneColor: '#F04452',
      },
    ],
  },
];

export const EventJourney: React.FC = () => {
  const [activeActIndex, setActiveActIndex] = useState(0);

  const handleActClick = (idx: number) => {
    audioEngine.playTacticalClick();
    setActiveActIndex(idx);
  };

  const currentAct = actsData[activeActIndex];

  return (
    <section id="journey" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050609] border-t border-[#D4A72C]/20 overflow-hidden">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      {/* Background Cosmic Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-color-dodge filter contrast-125"
        style={{ backgroundImage: 'url(/brand/texture_cosmic_dust.jpg)' }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-mono tracking-[0.3em] uppercase mb-4 shadow-[0_0_15px_rgba(212,167,44,0.25)]">
            <Calendar className="w-3.5 h-3.5 text-[#D4A72C]" />
            CHRONOLOGICAL MISSION LOGS • OCTOBER 23–25, 2026
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-marvel font-black tracking-[0.08em] text-white uppercase leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            THE 3-ACT SAGA
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 font-grotesk max-w-2xl leading-relaxed tracking-wider">
            Three days forged into a theatrical trilogy. Explore the progression from your initial arrival to the final generational impact commissioning.
          </p>
        </div>

        {/* 3-Act Selector Tabs */}
        <div className="flex justify-center mb-10 sm:mb-12 w-full">
          <div className="w-full sm:w-auto grid grid-cols-3 sm:flex p-1 sm:p-1.5 rounded-xl bg-[#0D1326]/90 border border-[#D4A72C]/30 shadow-2xl gap-1 sm:gap-2">
            {actsData.map((act, idx) => (
              <button
                key={act.act}
                onClick={() => handleActClick(idx)}
                className={`px-2 sm:px-5 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-xs font-marvel tracking-[0.14em] sm:tracking-[0.2em] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 active:scale-95 ${
                  activeActIndex === idx
                    ? 'bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] shadow-[0_0_20px_rgba(212,167,44,0.6)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{act.act}</span>
                <span className="hidden md:inline">: {act.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Act Spotlight Banner */}
        <div className="relative mb-10 p-6 rounded bg-gradient-to-r from-[#0D1326] via-[#151D33] to-[#0D1326] border border-[#D4A72C]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4A72C] font-bold">
              {currentAct.date}
            </span>
            <h3 className="font-marvel text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-0.5">
              {currentAct.act} — {currentAct.title}
            </h3>
            <span className="text-xs text-white/60 font-body mt-0.5 italic">
              Theme: {currentAct.theme}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#050609]/80 border border-[#D4A72C]/40 text-xs font-mono text-[#F6CC78]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>SECTOR: SFAX SANCTUARY</span>
          </div>
        </div>

        {/* Chronological Event Timeline */}
        <div className="space-y-4">
          {currentAct.events.map((ev, i) => (
            <div
              key={i}
              className="group relative rounded p-5 sm:p-6 bg-[#0D1326]/85 border border-[#D4A72C]/20 hover:border-[#D4A72C]/60 transition-all duration-300 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Time & Stone Indicator */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded bg-[#050609]/90 border border-white/10 text-xs font-mono text-white/80 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4A72C]" />
                    <span>{ev.time}</span>
                  </div>

                  <span
                    className="text-[10px] font-marvel font-bold tracking-widest px-2.5 py-0.5 rounded border"
                    style={{
                      borderColor: `${ev.stoneColor}55`,
                      backgroundColor: `${ev.stoneColor}15`,
                      color: ev.stoneColor,
                    }}
                  >
                    {ev.stoneAligned}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-white/40 tracking-wider">
                  OPERATIONAL LOG // 0{i + 1}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="mt-3">
                <h4 className="font-marvel text-lg sm:text-xl font-black text-white uppercase tracking-wider group-hover:text-[#F6CC78] transition-colors">
                  {ev.title}
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-white/70 font-body leading-relaxed max-w-4xl">
                  {ev.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
