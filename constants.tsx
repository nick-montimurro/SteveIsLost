
import { Country, PlayerStats, JourneyNode } from './types';

export const INITIAL_STATS: PlayerStats = {
  hp: 15,
  maxHp: 15,
  hunger: 15,
  maxHunger: 15,
  thirst: 15,
  maxThirst: 15,
  insanity: 0,
  maxInsanity: 15,
  level: 1,
  xp: 0,
  maxXp: 10,
  unlockedVocab: [],
};

export const COUNTRY_LANGUAGES: Record<Country, string> = {
  [Country.SPAIN]: 'Spanish',
  [Country.ITALY]: 'Italian',
  [Country.GERMANY]: 'German',
  [Country.SWEDEN]: 'Swedish',
  [Country.ROMANIA]: 'Romanian',
  [Country.JERSEY_SHORE]: 'Jersey Shore Slang',
};

export const COUNTRY_FLAGS: Record<Country, string> = {
  [Country.SPAIN]: '🇪🇸',
  [Country.ITALY]: '🇮🇹',
  [Country.GERMANY]: '🇩🇪',
  [Country.SWEDEN]: '🇸🇪',
  [Country.ROMANIA]: '🇷🇴',
  [Country.JERSEY_SHORE]: '🏖️',
};

export const COUNTRY_COLORS: Record<Country, { primary: string; glow: string }> = {
  [Country.SPAIN]: { primary: '#e53e3e', glow: 'rgba(229, 62, 62, 0.4)' },
  [Country.ITALY]: { primary: '#38a169', glow: 'rgba(56, 161, 105, 0.4)' },
  [Country.GERMANY]: { primary: '#ecc94b', glow: 'rgba(236, 201, 75, 0.4)' },
  [Country.SWEDEN]: { primary: '#4299e1', glow: 'rgba(66, 153, 225, 0.4)' },
  [Country.ROMANIA]: { primary: '#805ad5', glow: 'rgba(128, 90, 213, 0.4)' },
  [Country.JERSEY_SHORE]: { primary: '#ed8936', glow: 'rgba(237, 137, 54, 0.4)' },
};

/** The 6 journey stages every country path follows */
export const JOURNEY_STAGES: JourneyNode[] = [
  { label: 'The Bar', icon: '🍺', description: 'Find your bearings and get a drink' },
  { label: 'Transport', icon: '🚌', description: 'Find a way to the next city' },
  { label: 'The Market', icon: '🛒', description: 'Stock up on supplies and food' },
  { label: 'Checkpoint', icon: '👮', description: 'Deal with the local authorities' },
  { label: 'Airport', icon: '✈️', description: 'Navigate the airport terminal' },
  { label: 'Boarding', icon: '🎫', description: 'Get on your flight home' },
];

export const LOADING_MESSAGES = [
  "STEVE IS TRYING TO FOLD A PAPER MAP...",
  "SEARCHING FOR A TACO BELL IN THE TUSCAN COUNTRYSIDE...",
  "STEVE IS LOUDLY ASKING 'DO YOU SPEAK AMERICAN?'...",
  "CONFUSING 5 EUROS WITH A MONOPOLY BILL...",
  "STEVE IS EXPLAINING BASEBALL TO A CONFUSED LOCAL...",
  "TEACHING STEVE THE DIFFERENCE BETWEEN 'HOLA' AND 'POLLO'...",
  "STEVE IS WONDERING WHY THE COFFEE IS SO SMALL...",
  "TRYING TO USE A COSTCO CARD AS A SECOND FORM OF ID...",
  "STEVE IS CURRENTLY PANICKING ABOUT ROUNDABOUTS...",
  "WONDERING IF 'BONJOUR' WORKS IN SPAIN (IT DOESN'T)...",
  "APPLYING TOO MUCH HAIR GEL...",
  "STEVE IS LOOKING FOR THE NEAREST TANNING SALON...",
  "TRYING TO ORDER A TALL GLASS OF PROTEIN SHAKE...",
  "STEVE IS CONVERTING CELSIUS TO 'AMERICAN'...",
  "ASKING WHY THERE'S NO FREE REFILLS...",
  "STEVE JUST TIPPED IN DOLLARS AGAIN...",
  "GOOGLING 'HOW TO SAY BLESS YOU IN GERMAN'...",
  "STEVE IS ARGUING WITH A PIGEON...",
];
