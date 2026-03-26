// @dino-atlas/types - Shared type definitions

// ── Player & Family ──

export interface Family {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface Player {
  id: string;
  familyId: string;
  name: string;
  avatarEmoji: string;
  birthYear: number;
  interests: string[];
  createdAt: string;
}

// ── Dinosaurs ──

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type Diet = "Pflanzenfresser" | "Fleischfresser" | "Allesfresser" | "Fischfresser";
export type Period = "Trias" | "Jura" | "Kreide";

export interface DinoSpecies {
  id: string;
  slug: string;
  scientificName: string;
  displayNameDe: string;
  period: Period;
  diet: Diet;
  lengthM: number;
  weightKg: number;
  continent: string;
  rarity: Rarity;
  kidSummary: string;
  funFact: string;
  detailText: string;
  sizeComparison: string;
  imageReal?: string;
  imageComic?: string;
  imageSkeleton?: string;
  audioSteckbrief?: string;
  audioName?: string;
  quizQuestions: QuizQuestion[];
}

// ── Expedition ──

export type ExpeditionStatus =
  | "pending"
  | "excavating"
  | "puzzling"
  | "identifying"
  | "completed";

export interface Expedition {
  id: string;
  playerId: string;
  dinoSpeciesId: string;
  date: string;
  status: ExpeditionStatus;
  excavationTimeMs?: number;
  puzzleTimeMs?: number;
  identifyAttempts?: number;
  offlineTask: string;
}

// ── Museum ──

export interface MuseumEntry {
  id: string;
  playerId: string;
  dinoSpeciesId: string;
  discoveredAt: string;
  artworkPhoto?: string;
  artworkAiFeedback?: string;
  favorite: boolean;
}

// ── Story ──

export interface Story {
  id: string;
  familyId: string;
  date: string;
  playerDinos: { playerId: string; dinoSpeciesId: string }[];
  storyText: string;
  audioUrl?: string;
  timestamps?: WordTimestamp[];
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

// ── Mini-Games ──

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctIndex: number;
  hint: string;
}

export interface QuizOption {
  text: string;
  image?: string;
}

export type MinigameType =
  | "quiz"
  | "size-sort"
  | "timeline"
  | "food-match"
  | "shadow-guess";

export interface MinigameSession {
  id: string;
  playerId: string;
  gameType: MinigameType;
  dinoSpeciesId?: string;
  score: number;
  timeMs: number;
  starsEarned: number;
  completedAt: string;
}

export interface MinigameResult {
  score: number;
  starsEarned: number;
  timeMs: number;
}

// ── Budget ──

export interface DailyBudget {
  id: string;
  playerId: string;
  date: string;
  expeditionsUsed: number;
  expeditionsMax: number;
  minigamesUsed: number;
  minigamesMax: number;
  eveningSessionDone: boolean;
  isTired: boolean;
}

export interface BudgetReset {
  id: string;
  playerId: string;
  date: string;
  resetByUserId: string;
  mathQuestion: string;
  mathAnswerGiven: string;
  resetAt: string;
}

// ── Jobs ──

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  type: string;
  status: JobStatus;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// ── Minigame Props (shared contract) ──

export interface DifficultyLevel {
  puzzlePieces: number;
  quizOptions: number;
  showOutline: boolean;
  hintsEnabled: boolean;
}

export interface MinigameProps {
  player: Player;
  dinos: DinoSpecies[];
  difficulty: DifficultyLevel;
  onComplete: (result: MinigameResult) => void;
  onExit: () => void;
}
