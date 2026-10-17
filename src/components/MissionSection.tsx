import React from 'react';
import { Target, Users, Lightbulb, Compass, Zap, Award } from 'lucide-react';

const pillars = [
  {
    num: '01',
    title: 'PEOPLE',
    subtitle: 'Unity & Brotherhood',
    desc: 'Bringing isolated leaders out of silos to build an unbreakable fraternity of youth changemakers across Sfax.',
    icon: Users,
    color: '#D4A72C',
  },
  {
    num: '02',
    title: 'IDEAS',
    subtitle: 'Creativity & Disruption',
    desc: 'Bending standard limitations into revolutionary social and professional breakthroughs for the nation.',
    icon: Lightbulb,
    color: '#35B9FF',
  },
  {
    num: '03',
    title: 'LEADERSHIP',
    subtitle: 'Guidance & Authority',
    desc: 'Stepping forward into the storm with moral fortitude, strategic vision, and deep collective accountability.',
    icon: Compass,
    color: '#F5C451',
  },
  {
    num: '04',
    title: 'ACTION',
    subtitle: 'Execution & Ownership',
    desc: 'Transforming abstract vision into relentless tactical execution on the ground with high-velocity drive.',
    icon: Zap,
    color: '#F04452',
  },
  {
    num: '05',
    title: 'IMPACT',
    subtitle: 'Generational Legacy',
    desc: 'Ensuring that what we forge at SMS 2K26 resonates across Tunisian communities for years to come.',
    icon: Award,
    color: '#45D483',
  },
];

export const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/20 bg-[#050609] overflow-hidden">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      {/* Background Cosmic Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-color-dodge filter contrast-125"
        style={{ backgroundImage: 'url(/brand/texture_purple_nebula.jpg)' }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Mission Briefing Header */}
        <div className="flex flex-col items-start mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-mono tracking-[0.3em] uppercase mb-4 shadow-[0_0_15px_rgba(212,167,44,0.25)]">
            <Target className="w-3.5 h-3.5 text-[#F04452]" />
            WAR COUNCIL BRIEFING // DIRECTIVE: AVEN'UNITY
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-marvel font-black tracking-[0.08em] text-white uppercase leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            "THERE WAS AN IDEA." <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF0] via-[#F6CC78] to-[#D4A72C]">
              TO ASSEMBLE REMARKABLE LEADERS.
            </span>
          </h2>
        </div>

        {/* Cinematic Theatrical Narrative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Narrative Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative p-6 sm:p-8 rounded bg-[#0D1326]/90 border border-[#D4A72C]/30 backdrop-blur-xl shadow-2xl">
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              <h3 className="font-marvel text-2xl font-black text-white mb-3 flex items-center gap-2 tracking-wider">
                <span className="text-[#D4A72C]">01 //</span> THIS IS NOT A SIMPLE SEMINAR.
              </h3>

              <p className="text-base sm:text-lg text-white/85 leading-relaxed font-grotesk">
                It is a cosmic convergence. In an era of fragmentation, no lone hero can defend tomorrow alone. Raw potential scattered in isolation will inevitably fall. But when united under one banner, our collective strength bends reality itself.
              </p>

              <p className="text-sm text-white/70 leading-relaxed font-body mt-4">
                <strong>SMS 2K26 (Sfax Motivational Seminar)</strong> is the battleground where Tunisia's next generation of bold leaders converges. Here, you unlock your distinct Infinity Stone, align your powers with earth’s mightiest peers, and rise as unstoppable guardians of the future.
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-white/60">
                <span className="text-[#D4A72C]">COORDINATES: 34°44' N, 10°46' E</span>
                <span>•</span>
                <span className="text-[#F6CC78]">ONE MISSION. ONE DESTINY.</span>
              </div>
            </div>

            {/* The 3 Core Tactical Imperatives */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'THE CRISIS',
                  desc: 'Individual potential constrained by isolation and fear of the unknown.',
                  border: 'border-[#F04452]',
                },
                {
                  title: 'THE CALL',
                  desc: '3 intensive days in Sfax to forge an unshakeable brotherhood.',
                  border: 'border-[#D4A72C]',
                },
                {
                  title: 'THE IMPACT',
                  desc: 'Return to lead your communities armed with unstoppable momentum.',
                  border: 'border-[#45D483]',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-4 rounded bg-[#050609]/90 border border-t-2 ${item.border} backdrop-blur-md`}
                >
                  <h4 className="font-marvel font-bold text-xs tracking-[0.2em] text-[#F6CC78] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/70 font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sfax Graphic Charter 5 Pillars Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded bg-[#0D1326]/95 border border-[#D4A72C]/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4A72C] font-bold">
                    CANONICAL CHARTER // 5 PILLARS
                  </span>
                  <h4 className="font-marvel text-xl font-black text-white tracking-wider mt-0.5">
                    THE CODE OF SMS 2K26
                  </h4>
                </div>
                <img
                  src="/brand/sms_logo_gold.png"
                  alt="SMS Logo"
                  className="w-10 h-auto object-contain filter drop-shadow-[0_0_8px_rgba(212,167,44,0.6)]"
                />
              </div>

              <div className="space-y-4">
                {pillars.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.num}
                      className="group p-3 rounded bg-[#050609]/70 border border-white/5 hover:border-[#D4A72C]/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold" style={{ color: p.color }}>
                          {p.num}
                        </span>
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: p.color }} />
                        <span className="font-marvel font-bold text-sm text-white tracking-wider group-hover:text-[#F6CC78] transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 ml-auto tracking-wider hidden sm:inline">
                          {p.subtitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 font-body mt-1 pl-6 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
