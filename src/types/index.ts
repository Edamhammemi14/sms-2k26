export interface Stone {
  id: string;
  name: string;
  stoneColor: string;
  hex: string;
  glowColor: string;
  attribute: string;
  tagline: string;
  description: string;
  leadershipLore: string;
  eventApplication: string;
  takeaways: string[];
  frequency: number; // For Web Audio synthesizer note
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  department: 'Command' | 'Marketing' | 'Operations & Logistics' | 'External Relations' | 'Finance & DXP';
  image: string;
  accentColor?: string;
  bio?: string;
  responsibilities?: string[];
  codename?: string;
  stoneAffinity?: string;
  stoneColor?: string;
  quote?: string;
  powers?: string[];
  stats?: {
    leadership: number;
    strategy: number;
    energy: number;
  };
}

export interface TimelineEvent {
  id: string;
  dimension: string;
  dimensionNumber: string;
  date: string;
  title: string;
  badge: 'COMPLETED' | 'UNLOCKED' | 'BOSS LEVEL';
  badgeColor: string;
  theme: string;
  description: string;
  sessions: {
    time: string;
    name: string;
    category: string;
    lead: string;
  }[];
}

export interface CapabilityCard {
  number: string;
  title: string;
  stoneColor: string;
  subtitle: string;
  description: string;
  gains: string[];
}
