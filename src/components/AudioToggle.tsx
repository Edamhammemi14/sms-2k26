import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsPlaying(audioEngine.isOfficialThemeActive());
  }, []);

  const toggleThemeAudio = () => {
    const willPlay = !isPlaying;
    setIsPlaying(willPlay);
    if (willPlay) {
      audioEngine.setMuted(false);
      audioEngine.playOfficialAvengersTheme();
    } else {
      audioEngine.pauseOfficialAvengersTheme();
    }
  };

  return (
    <button
      onClick={toggleThemeAudio}
      className={`group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border transition-all duration-300 shrink-0 select-none ${
        isPlaying
          ? 'bg-[#D4A72C]/25 border-[#D4A72C] text-[#F6CC78] shadow-[0_0_20px_rgba(212,167,44,0.6)]'
          : 'bg-[#0D1326]/70 border-white/15 text-white/60 hover:text-white hover:border-[#D4A72C]/50'
      }`}
      aria-label={isPlaying ? 'Pause Marvel Studios opening theme' : 'Play Marvel Studios opening theme'}
      title={isPlaying ? 'Marvel Studios Opening Theme is playing (Click to pause)' : 'Click to play Marvel Studios Opening Theme Song'}
    >
      {isPlaying ? (
        <Music className="w-4 h-4 text-[#F6CC78] animate-bounce shrink-0" />
      ) : (
        <VolumeX className="w-4 h-4 text-white/50 group-hover:text-white transition-colors shrink-0" />
      )}

      {/* Mini equalizer bars when audio is active */}
      {isPlaying && (
        <div className="flex items-end gap-[2px] h-3 shrink-0">
          <span className="w-[2px] bg-[#D4A72C] animate-[pulse_0.4s_ease-in-out_infinite] h-2" />
          <span className="w-[2px] bg-[#F6CC78] animate-[pulse_0.7s_ease-in-out_infinite_0.15s] h-3.5" />
          <span className="w-[2px] bg-[#35B9FF] animate-[pulse_0.5s_ease-in-out_infinite_0.3s] h-2.5" />
        </div>
      )}

      <span className="text-[10px] font-marvel tracking-widest uppercase font-bold hidden sm:inline whitespace-nowrap">
        {isPlaying ? 'THEME ON' : 'PLAY THEME'}
      </span>
    </button>
  );
};
