
export enum Country {
  SPAIN = 'Spain',
  ITALY = 'Italy',
  GERMANY = 'Germany',
  SWEDEN = 'Sweden',
  ROMANIA = 'Romania',
  JERSEY_SHORE = 'Jersey Shore'
}

export interface VocabularyItem {
  word: string;
  translation: string;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  hunger: number;
  maxHunger: number;
  thirst: number;
  maxThirst: number;
  insanity: number;
  maxInsanity: number;
  level: number;
  xp: number;
  maxXp: number;
  unlockedVocab: VocabularyItem[];
}

export enum DialogueResultType {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  OFFENSIVE = 'offensive',
}

export interface DialogueOption {
  textLocal: string;
  textEnglish: string;
  type: DialogueResultType;
  feedback: string;
  // If this exists, it leads to a specific next response in the SAME interaction
  followUp?: {
    npcResponseLocal: string;
    npcResponseEnglish: string;
    options: DialogueOption[];
  };
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  image: string;
  introLocal: string;
  introEnglish: string;
  initialOptions: DialogueOption[];
}

/** Represents a node on the overworld journey map */
export interface JourneyNode {
  label: string;
  icon: string; // emoji icon
  description: string;
}

/** Game screen states */
export type GameScreen = 'menu' | 'intro' | 'playing' | 'levelup' | 'ending' | 'overworld';

export interface GameState {
  currentCountry: Country | null;
  journeyStage: number; // 0 to totalStages-1
  currentRound: number; // 0 to 2
  isGameOver: boolean;
  gameEnding: 'home' | 'dead' | null;
  currentNpc: NPC | null;
  currentPrompt: {
    npcLineLocal: string;
    npcLineEnglish: string;
    options: DialogueOption[];
  } | null;
  locationImageUrl?: string;
  status: GameScreen;
  babelFishUsed: boolean;
  translatedOptionIndex: number | null;
  isTransitioning: boolean;
  feedbackType: DialogueResultType | null;
}
