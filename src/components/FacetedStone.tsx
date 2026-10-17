import React from 'react';

interface FacetedStoneProps {
  id: string;
  color: string;
  size?: number; // size in px (default: 48)
  isSelected?: boolean;
  isHovered?: boolean;
  className?: string;
}

export const FacetedStone: React.FC<FacetedStoneProps> = ({
  id,
  color,
  size = 48,
  isSelected = false,
  isHovered = false,
  className = '',
}) => {
  // Unique gemstone facet styling per stone
  const renderGemGeometry = () => {
    switch (id) {
      case 'power':
        // Raw violent cosmic crystal with jagged facets and lightning
        return (
          <g>
            {/* Base faceted crystal silhouette */}
            <polygon points="50,6 84,26 94,66 68,94 32,94 6,66 16,26" fill="url(#gem-power-body)" stroke="#FFA0B0" strokeWidth="1.2" opacity="0.95" />
            {/* Upper facets */}
            <polygon points="50,6 50,38 84,26" fill="white" opacity="0.35" />
            <polygon points="50,6 16,26 50,38" fill="white" opacity="0.55" />
            {/* Center table facet */}
            <polygon points="50,38 74,52 64,78 36,78 26,52" fill="url(#gem-power-core)" stroke="#FF8096" strokeWidth="0.8" />
            {/* Lower facets */}
            <polygon points="26,52 36,78 32,94 6,66" fill="#800A1A" opacity="0.7" />
            <polygon points="74,52 84,26 94,66 68,94" fill="#600512" opacity="0.8" />
            <polygon points="36,78 64,78 68,94 32,94" fill="#FF2040" opacity="0.6" />
            {/* Violent cosmic lightning crackle */}
            <polyline points="48,16 52,34 44,52 56,70 50,88" fill="none" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.85" filter="url(#gem-glow)" />
          </g>
        );

      case 'space':
        // Tesseract isometric hypercube crystal
        return (
          <g>
            {/* Outer isometric cube */}
            <polygon points="50,10 88,32 88,72 50,92 12,72 12,32" fill="url(#gem-space-body)" stroke="#8BE5FF" strokeWidth="1.5" />
            {/* Top cube facet */}
            <polygon points="50,10 88,32 50,52 12,32" fill="#E0F7FF" opacity="0.45" />
            {/* Right cube facet */}
            <polygon points="50,52 88,32 88,72 50,92" fill="#0D47A1" opacity="0.85" />
            {/* Left cube facet */}
            <polygon points="50,52 12,32 12,72 50,92" fill="#0288D1" opacity="0.75" />
            {/* Inner suspended tesseract cube */}
            <polygon points="50,30 68,40 68,60 50,70 32,60 32,40" fill="url(#gem-space-core)" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.95" />
            <line x1="50" y1="10" x2="50" y2="30" stroke="#8BE5FF" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="88" y1="72" x2="68" y2="60" stroke="#8BE5FF" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="12" y1="72" x2="32" y2="60" stroke="#8BE5FF" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        );

      case 'reality':
        // Liquid Aether oval radiant gem with shifting energy tendrils
        return (
          <g>
            {/* Emerald radiant cut silhouette */}
            <polygon points="32,10 68,10 90,32 90,68 68,90 32,90 10,68 10,32" fill="url(#gem-reality-body)" stroke="#FFA3B0" strokeWidth="1.2" />
            {/* Inner octagon table */}
            <polygon points="38,25 62,25 78,38 78,62 62,75 38,75 22,62 22,38" fill="url(#gem-reality-core)" stroke="#FF6B82" strokeWidth="0.8" />
            {/* Bevel facet cuts */}
            <line x1="32" y1="10" x2="38" y2="25" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" />
            <line x1="68" y1="10" x2="62" y2="25" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" />
            <line x1="90" y1="32" x2="78" y2="38" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.4" />
            <line x1="90" y1="68" x2="78" y2="62" stroke="#4A0510" strokeWidth="1.2" />
            <line x1="68" y1="90" x2="62" y2="75" stroke="#4A0510" strokeWidth="1.2" />
            <line x1="32" y1="90" x2="38" y2="75" stroke="#4A0510" strokeWidth="1.2" />
            <line x1="10" y1="68" x2="22" y2="62" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.6" />
            <line x1="10" y1="32" x2="22" y2="38" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
            {/* Swirling crimson core glow */}
            <circle cx="50" cy="50" r="14" fill="#FF1A38" filter="url(#gem-glow)" opacity="0.9" />
          </g>
        );

      case 'mind':
        // Radiant Golden Marquise / Navette cut gem (Vision's brow stone)
        return (
          <g>
            {/* Marquise pointed oval */}
            <path d="M50,4 C75,25 88,40 88,50 C88,60 75,75 50,96 C25,75 12,60 12,50 C12,40 25,25 50,4 Z" fill="url(#gem-mind-body)" stroke="#FFF2B0" strokeWidth="1.4" />
            {/* Center diamond table */}
            <polygon points="50,22 72,50 50,78 28,50" fill="url(#gem-mind-core)" stroke="#FFE066" strokeWidth="1" />
            {/* Specular facets */}
            <polygon points="50,4 50,22 28,50 12,50" fill="#FFFFFF" opacity="0.6" />
            <polygon points="50,4 72,50 50,22" fill="#FFF9D2" opacity="0.4" />
            <polygon points="50,78 72,50 88,50 50,96" fill="#A16207" opacity="0.7" />
            <polygon points="50,78 28,50 12,50 50,96" fill="#854D0E" opacity="0.8" />
            {/* Cerebral pulse spark */}
            <circle cx="50" cy="50" r="8" fill="#FFFFFF" filter="url(#gem-glow)" />
          </g>
        );

      case 'time':
        // Eye of Agamotto mystic emerald octagonal relic
        return (
          <g>
            {/* Outer talisman ring */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#22C55E" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {/* Octagonal emerald cut */}
            <polygon points="35,12 65,12 88,35 88,65 65,88 35,88 12,65 12,35" fill="url(#gem-time-body)" stroke="#86EFAC" strokeWidth="1.4" />
            {/* Step cut facets */}
            <polygon points="40,24 60,24 76,40 76,60 60,76 40,76 24,60 24,40" fill="url(#gem-time-core)" stroke="#4ADE80" strokeWidth="0.9" />
            {/* Table */}
            <polygon points="44,34 56,34 66,44 66,56 56,66 44,66 34,56 34,44" fill="#BBF7D0" opacity="0.8" />
            {/* Mystic Agamotto runic accents */}
            <circle cx="50" cy="50" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
          </g>
        );

      case 'soul':
      default:
        // Radiant solar octahedron Vormir celestial gem
        return (
          <g>
            {/* Brilliant oval star cut */}
            <polygon points="50,6 74,18 92,42 92,58 74,82 50,94 26,82 8,58 8,42 26,18" fill="url(#gem-soul-body)" stroke="#FED7AA" strokeWidth="1.3" />
            {/* Brilliant facet triangles */}
            <polygon points="50,6 50,30 26,18" fill="#FFFFFF" opacity="0.6" />
            <polygon points="50,6 74,18 50,30" fill="#FFF7ED" opacity="0.45" />
            {/* Center table */}
            <polygon points="50,30 70,42 70,58 50,70 30,58 30,42" fill="url(#gem-soul-core)" stroke="#FB923C" strokeWidth="1" />
            {/* Lower pavilion facets */}
            <polygon points="30,58 50,70 26,82 8,58" fill="#9A3412" opacity="0.75" />
            <polygon points="70,58 92,58 74,82 50,70" fill="#7C2D12" opacity="0.85" />
            <polygon points="50,70 74,82 50,94 26,82" fill="#C2410C" opacity="0.7" />
            {/* Vormir soul solar flare */}
            <circle cx="50" cy="50" r="10" fill="#FFF7ED" filter="url(#gem-glow)" opacity="0.9" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-500 select-none ${className} ${
        isSelected ? 'scale-110 drop-shadow-[0_0_28px_rgba(255,255,255,0.7)]' : ''
      } ${isHovered ? 'scale-115' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Cosmic Halo Aura */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-70 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          transform: isSelected || isHovered ? 'scale(1.6)' : 'scale(1.2)',
          opacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.45,
        }}
      />

      {/* SVG Faceted Cosmic Crystal */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 transition-transform duration-500 filter"
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 16px ${color}) drop-shadow(0 0 30px ${color})`
            : isHovered
            ? `drop-shadow(0 0 14px ${color})`
            : `drop-shadow(0 0 8px ${color}88)`,
        }}
      >
        <defs>
          {/* Global Gem Glow Filter */}
          <filter id="gem-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Power Stone Gradients */}
          <radialGradient id="gem-power-core" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FF4066" />
            <stop offset="100%" stopColor="#A80720" />
          </radialGradient>
          <linearGradient id="gem-power-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B8B" />
            <stop offset="50%" stopColor="#F04452" />
            <stop offset="100%" stopColor="#4A000A" />
          </linearGradient>

          {/* Space Stone Gradients */}
          <radialGradient id="gem-space-core" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#70D8FF" />
            <stop offset="100%" stopColor="#0B409C" />
          </radialGradient>
          <linearGradient id="gem-space-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A6ECFF" />
            <stop offset="50%" stopColor="#35B9FF" />
            <stop offset="100%" stopColor="#022152" />
          </linearGradient>

          {/* Reality Stone Gradients */}
          <radialGradient id="gem-reality-core" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF0F2" />
            <stop offset="40%" stopColor="#FF3855" />
            <stop offset="100%" stopColor="#660012" />
          </radialGradient>
          <linearGradient id="gem-reality-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A8E" />
            <stop offset="50%" stopColor="#D62E45" />
            <stop offset="100%" stopColor="#3A0009" />
          </linearGradient>

          {/* Mind Stone Gradients */}
          <radialGradient id="gem-mind-core" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#854D0E" />
          </radialGradient>
          <linearGradient id="gem-mind-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4A3" />
            <stop offset="50%" stopColor="#F5C451" />
            <stop offset="100%" stopColor="#452703" />
          </linearGradient>

          {/* Time Stone Gradients */}
          <radialGradient id="gem-time-core" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F0FDF4" />
            <stop offset="40%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#065F46" />
          </radialGradient>
          <linearGradient id="gem-time-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="50%" stopColor="#45D483" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>

          {/* Soul Stone Gradients */}
          <radialGradient id="gem-soul-core" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#7C2D12" />
          </radialGradient>
          <linearGradient id="gem-soul-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="50%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>
        </defs>

        {renderGemGeometry()}
      </svg>
    </div>
  );
};
