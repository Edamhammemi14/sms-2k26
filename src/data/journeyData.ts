import { TimelineEvent } from '../types';

export const eventTimeline: TimelineEvent[] = [
  {
    id: 'dimension-01',
    dimension: 'DIMENSION 01',
    dimensionNumber: '01',
    date: 'FRIDAY, FEBRUARY 13, 2026',
    title: 'LEARNING MODE: THE AWAKENING',
    badge: 'UNLOCKED',
    badgeColor: 'border-[#35B9FF] text-[#35B9FF] bg-[#35B9FF]/10',
    theme: 'Space & Mind Stones — Calibration & Foundational Power',
    description: 'The convergence begins. Delegates arrive at Hotel Sol Palmeras, establish communication channels, unlock mission credentials, and ignite foundational leadership competencies through intensive simulations.',
    sessions: [
      {
        time: '13:00 - 15:00',
        name: 'The Quantum Gate: Check-In & Delegate Accreditations',
        category: 'Arrival & Logistics',
        lead: 'Logistics Command'
      },
      {
        time: '15:30 - 17:30',
        name: 'Plenary Opening: The AVEN’Unity Decree & Keynote',
        category: 'Inspiration Plenary',
        lead: 'OCP Soulaima Zghal'
      },
      {
        time: '18:00 - 20:00',
        name: 'The Mind Stone Crucible: Advanced Leadership Strategy Labs',
        category: 'Skill Workshop',
        lead: 'Facilitator Corps'
      },
      {
        time: '21:00 - 23:00',
        name: 'Cross-LC Orbital Mixer & Team Identity Ignition',
        category: 'Networking',
        lead: 'Delegate Services'
      }
    ]
  },
  {
    id: 'dimension-02',
    dimension: 'DIMENSION 02',
    dimensionNumber: '02',
    date: 'SATURDAY, FEBRUARY 14, 2026',
    title: 'TEAM MODE: THE CRUCIBLE & OC NIGHT',
    badge: 'UNLOCKED',
    badgeColor: 'border-[#D62E45] text-[#D62E45] bg-[#D62E45]/10',
    theme: 'Reality & Power Stones — High-Stakes Collaboration & Unity',
    description: 'Bending reality through relentless teamwork. Delegates tackle pressurized case simulations, cross-functional hackathons, and experience the legendary OC Night—a thematic cultural celebration of unity.',
    sessions: [
      {
        time: '09:00 - 12:30',
        name: 'Reality Manipulation: Crisis Simulation & Live Hackathon',
        category: 'Interactive Challenge',
        lead: 'Strategy Division'
      },
      {
        time: '14:00 - 17:00',
        name: 'Power Stone Dynamics: High-Voltage Team Pitching',
        category: 'Case Competition',
        lead: 'External Relations & Partners'
      },
      {
        time: '17:30 - 19:30',
        name: 'Soul Resonance: Peer Mentorship & Vulnerable Leadership Circles',
        category: 'Self-Reflection',
        lead: 'AIESEC Facilitators'
      },
      {
        time: '21:30 - LATE',
        name: 'THE LEGENDARY OC NIGHT: Multiverse Party & Cultural Fusion',
        category: 'Celebration',
        lead: 'Entire Organizing Committee'
      }
    ]
  },
  {
    id: 'dimension-03',
    dimension: 'DIMENSION 03',
    dimensionNumber: '03',
    date: 'SUNDAY, FEBRUARY 15, 2026',
    title: 'LEADERSHIP MODE: BOSS LEVEL & GALA NIGHT',
    badge: 'BOSS LEVEL',
    badgeColor: 'border-[#F5C451] text-[#F5C451] bg-[#F5C451]/10',
    theme: 'Time & Soul Stones — The Infinity Alignment & Eternal Legacy',
    description: 'The climax of the experience. Delegates synthesize all six powers into an actionable annual blueprint, present their leadership manifestos, and celebrate at the prestigious Infinity Gala Night.',
    sessions: [
      {
        time: '09:30 - 12:30',
        name: 'The Time Stone Convergence: Future Blueprinting & Election Forum',
        category: 'Action Planning',
        lead: 'National Leadership Body'
      },
      {
        time: '14:00 - 16:30',
        name: 'The Boss Level: Final Manifesto Defenses & Commissioning',
        category: 'Culmination',
        lead: 'Plenary Board'
      },
      {
        time: '17:00 - 18:30',
        name: 'Closing Ceremony: The Infinity Alignment & Transition Decree',
        category: 'Closing Plenary',
        lead: 'OCP & VIP Guests'
      },
      {
        time: '20:30 - 01:00',
        name: 'THE INFINITY GALA NIGHT: Red Carpet, Awards & Farewell Banquet',
        category: 'Black Tie Gala',
        lead: 'SMS 2K26 Organizing Committee'
      }
    ]
  }
];
