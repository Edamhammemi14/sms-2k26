import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Navbar } from './components/Navbar';
import { IntroSequence } from './components/IntroSequence';
import { HeroSection } from './components/HeroSection';
import { MissionSection } from './components/MissionSection';
import { InfinityStones } from './components/InfinityStones';
import { EventJourney } from './components/EventJourney';
import { WhatAwaitsYou } from './components/WhatAwaitsYou';
import { TeamRoster } from './components/TeamRoster';
import { SafehouseVenue } from './components/SafehouseVenue';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { RegistrationsSheetModal } from './components/RegistrationsSheetModal';
import { EasterEggModal } from './components/EasterEggModal';
import { audioEngine } from './utils/audioEngine';

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [activeStoneColor, setActiveStoneColor] = useState('#D4A72C'); // Imperial Gold (Official SMS 2K26 Primary)
  const [selectedStoneId, setSelectedStoneId] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isScreenSnapped, setIsScreenSnapped] = useState(false);

  // Easter Egg listener: Typing 'THANOS', 'AVENGERS', or 'SMS'
  useEffect(() => {
    let keyBuffer: string[] = [];
    const targetSecrets = ['THANOS', 'AVENGERS', 'SMS'];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      keyBuffer.push(e.key.toUpperCase());
      if (keyBuffer.length > 10) {
        keyBuffer.shift();
      }

      const currentTyped = keyBuffer.join('');
      const matched = targetSecrets.some((secret) => currentTyped.endsWith(secret));

      if (matched) {
        triggerSnapExperience();
        keyBuffer = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerSnapExperience = () => {
    audioEngine.playCinematicBraaam();

    // Snap Screen Disintegration / Ash effect
    setIsScreenSnapped(true);
    setTimeout(() => {
      setIsScreenSnapped(false);
    }, 600);

    // Blast celebratory cosmic confetti (gold, ember, imperial violet)
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#D4A72C', '#F6CC78', '#D96A32', '#F04452', '#35B9FF', '#7B2CFF'],
    });

    setIsEasterEggOpen(true);
  };

  return (
    <div
      className={`min-h-screen bg-[#050609] text-[#F4F5FA] relative selection:bg-[#D4A72C] selection:text-black transition-all duration-500 overflow-x-hidden ${
        isScreenSnapped ? 'filter contrast-200 grayscale-75 brightness-125' : ''
      }`}
    >
      {/* 35mm Celluloid Film Grain Overlay */}
      <div className="film-grain" />

      {/* Cinematic Opening Intro Sequence */}
      {showIntro && (
        <IntroSequence
          onComplete={() => {
            sessionStorage.setItem('sms_intro_seen', 'true');
            setShowIntro(false);
          }}
        />
      )}

      {/* Persistent Ambient Cosmic Nebula Particle Canvas */}
      <ParticleCanvas stoneAuraColor={activeStoneColor} />

      {/* Main Top Theatrical Navbar */}
      <Navbar
        onOpenRegister={() => setIsRegisterOpen(true)}
        onTriggerSnap={triggerSnapExperience}
      />

      {/* Theatrical Hero Section */}
      <HeroSection
        onStoneSelect={(id) => setSelectedStoneId(id)}
        activeStoneColor={activeStoneColor}
        setActiveStoneColor={setActiveStoneColor}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onPlayIntro={() => setShowIntro(true)}
      />

      {/* The Mission Briefing Section */}
      <MissionSection />

      {/* The Six Ancient Cosmic Relics (Vault of Stones) */}
      <InfinityStones
        selectedStoneId={selectedStoneId}
        onSelectStone={setSelectedStoneId}
        onStoneHoverColor={setActiveStoneColor}
      />

      {/* The 3-Act Chronological Theatrical Journey */}
      <EventJourney />

      {/* What Awaits You (Leadership Capabilities Core) */}
      <WhatAwaitsYou onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Earth's Mightiest Heroes (Theatrical Character Posters) */}
      <TeamRoster />

      {/* The Sanctuary / Venue (Sfax Tactical Telemetry) */}
      <SafehouseVenue />

      {/* The Commissioning Call To Action & VIP Ticket */}
      <CallToAction onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Theatrical Footer */}
      <Footer
        onOpenRegister={() => setIsRegisterOpen(true)}
        onTriggerSnap={triggerSnapExperience}
        onOpenRoster={() => setIsRosterOpen(true)}
      />

      {/* Interactive Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Centralized Registrations Roster & Google Sheets Modal */}
      <RegistrationsSheetModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
      />

      {/* Classified Infinity Gauntlet Snap Easter Egg Modal */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />
    </div>
  );
};

export default App;
