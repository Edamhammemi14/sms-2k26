import React, { useState } from 'react';
import { Users, X, Award, Activity } from 'lucide-react';
import { teamMembers } from '../data/teamData';
import { TeamMember } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface DepartmentFilter {
  key: string;
  label: string;
}

export const TeamRoster: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [activeDossier, setActiveDossier] = useState<TeamMember | null>(null);

  const departments: DepartmentFilter[] = [
    { key: 'All', label: 'ALL MEMBERS' },
    { key: 'Command', label: 'COMMAND (OCP)' },
    { key: 'Marketing', label: 'MARKETING' },
    { key: 'Operations & Logistics', label: 'LOGISTICS' },
    { key: 'External Relations', label: 'EXTERNAL RELATIONS' },
    { key: 'Finance & DXP', label: 'FINANCE & DXP' },
  ];

  const filteredMembers = selectedDept === 'All'
    ? teamMembers
    : teamMembers.filter((m) => m.department === selectedDept);

  const handleCardClick = (member: TeamMember) => {
    audioEngine.playStoneResonance(440);
    setActiveDossier(member);
  };

  const closeDossier = () => {
    audioEngine.playTacticalClick();
    setActiveDossier(null);
  };

  return (
    <section id="team" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050609] border-t border-[#D4A72C]/20 overflow-hidden">
      {/* 35mm Film Grain */}
      <div className="film-grain" />

      {/* Background Golden Cosmic Dust */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-color-dodge filter contrast-150"
        style={{ backgroundImage: 'url(/brand/texture_golden_stream.jpg)' }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0D1326]/90 border border-[#D4A72C]/40 text-[#F6CC78] text-xs font-mono tracking-[0.3em] uppercase mb-4 shadow-[0_0_15px_rgba(212,167,44,0.25)]">
            <Users className="w-3.5 h-3.5 text-[#D4A72C]" />
            ORGANIZING COMMITTEE // SMS 2K26
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-marvel font-black tracking-[0.08em] text-white uppercase leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            MEET THE OC TEAM
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70 font-grotesk max-w-2xl leading-relaxed tracking-wider">
            The dedicated Organizing Committee engineering the SMS 2K26 conference. United under one mission to orchestrate an unforgettable, transformative milestone for every delegate.
          </p>

          {/* Department Filter Selector */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept.key}
                onClick={() => {
                  audioEngine.playTacticalClick();
                  setSelectedDept(dept.key);
                }}
                className={`px-4 py-2 rounded text-xs font-marvel tracking-[0.2em] uppercase transition-all duration-300 border ${
                  selectedDept === dept.key
                    ? 'bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] border-[#D4A72C] text-[#050609] font-black shadow-[0_0_20px_rgba(212,167,44,0.6)]'
                    : 'bg-[#0D1326]/80 border-white/10 text-white/60 hover:text-white hover:border-[#D4A72C]/40'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>

        {/* OC Character Posters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleCardClick(member)}
              onMouseEnter={() => audioEngine.playHudBeep(900, 0.02)}
              className="group relative rounded bg-[#0D1326] border border-[#D4A72C]/30 hover:border-[#D4A72C] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_45px_rgba(212,167,44,0.3)] select-none"
            >
              {/* Position Badge Stamp */}
              <div className="absolute top-3 right-3 z-30 px-2 py-0.5 rounded bg-[#050609]/90 border border-[#D4A72C]/40 text-[10px] font-mono tracking-widest text-[#F6CC78] font-bold">
                {member.role}
              </div>

              {/* Portrait Frame */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#050609]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter saturate-[0.95] contrast-[1.05] group-hover:saturate-[1.1]"
                  loading="lazy"
                />
                
                {/* Cinematic Gradient Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1326] via-[#0D1326]/40 to-transparent opacity-90" />

                {/* Subtle Scanlines */}
                <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

                {/* Accent Bottom Bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                  style={{ backgroundColor: member.accentColor || '#D4A72C' }}
                />
              </div>

              {/* Member Callout Details */}
              <div className="p-5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4A72C] font-semibold block mb-1">
                  {member.department}
                </span>

                <h3 className="font-marvel text-xl font-black text-white tracking-wider group-hover:text-[#F6CC78] transition-colors leading-tight">
                  {member.name}
                </h3>

                <p className="text-xs text-white/70 font-body mt-1 line-clamp-1">
                  {member.title}
                </p>

                {/* Position Footer */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/50 tracking-wider">POSITION:</span>
                  <span className="font-bold tracking-wider text-[#F6CC78]">
                    {member.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theatrical Dossier Modal */}
      {activeDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D1326] border border-[#D4A72C]/60 p-5 sm:p-8 shadow-[0_0_80px_rgba(212,167,44,0.5)] max-h-[92vh] overflow-y-auto touch-scroll">
            {/* Close Button */}
            <button
              onClick={closeDossier}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full border border-white/20 bg-black/60 hover:bg-white/20 text-white transition-all active:scale-95 z-10"
              aria-label="Close dossier"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dossier Header with Photo */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 border-b border-white/10 pt-2 sm:pt-0">
              <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden border-2 border-[#D4A72C] flex-shrink-0 shadow-xl bg-[#050609]">
                <img
                  src={activeDossier.image}
                  alt={activeDossier.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex flex-col text-center sm:text-left">
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-[10px] font-mono tracking-[0.25em] text-[#D4A72C] uppercase font-bold">
                  <span>OC DOSSIER // {activeDossier.role}</span>
                </div>
                <h3 className="font-marvel text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1">
                  {activeDossier.name}
                </h3>
                <span className="text-xs font-mono font-bold tracking-widest text-[#F6CC78] mt-0.5">
                  POSITION: {activeDossier.role}
                </span>
                <span className="text-xs text-white/70 font-body mt-1">
                  {activeDossier.title} • {activeDossier.department}
                </span>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="space-y-6 mt-6">
              {/* Bio / Mandate */}
              {activeDossier.bio && (
                <div className="p-4 rounded bg-[#050609]/80 border-l-2 border-[#D4A72C]">
                  <p className="text-xs sm:text-sm text-white/90 font-body italic leading-relaxed">
                    "{activeDossier.bio}"
                  </p>
                </div>
              )}

              {/* Responsibilities */}
              {activeDossier.responsibilities && activeDossier.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-marvel tracking-[0.25em] text-[#F6CC78] uppercase mb-2">
                    CORE RESPONSIBILITIES & MANDATE
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeDossier.responsibilities.map((resp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded bg-[#050609] border border-[#D4A72C]/30 text-xs font-mono text-[#F6CC78] flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-[#D4A72C]" />
                        {resp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Committee Profile Summary */}
              <div>
                <h4 className="text-[10px] font-marvel tracking-[0.25em] text-[#F6CC78] uppercase mb-3 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  COMMITTEE PROFILE
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-[#050609]/90 border border-white/10 flex flex-col items-center text-center">
                    <span className="font-marvel font-black text-lg text-[#F6CC78]">
                      {activeDossier.role}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white/50 mt-0.5">
                      ROLE
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#050609]/90 border border-white/10 flex flex-col items-center text-center">
                    <span className="font-marvel font-black text-xs sm:text-sm text-[#F6CC78] line-clamp-1">
                      {activeDossier.department}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white/50 mt-0.5">
                      COMMISSION
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#050609]/90 border border-white/10 flex flex-col items-center text-center">
                    <span className="font-marvel font-black text-sm text-[#F6CC78]">
                      SMS 2K26
                    </span>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white/50 mt-0.5">
                      CONFERENCE
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeDossier}
                className="w-full py-3.5 rounded bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-black tracking-[0.25em] uppercase hover:brightness-110 transition-all shadow-lg"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
