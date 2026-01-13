export interface Subtitle {
  id: number;
  startTime: string; // HH:MM:SS format
  endTime: string;
  textOriginal: string;
  textVietnamese: string;
}

export interface Note {
  timestamp: string;
  title: string;
  content: string;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  context: string;
}

export interface ProcessedData {
  subtitles: Subtitle[];
  notes: Note[];
  flashcards: Flashcard[];
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}

export interface ProcessingOptions {
  generateNotes: boolean;
  generateFlashcards: boolean;
  originalLanguage: string;
}

export interface BackgroundJob {
  id: string;
  file: File | string; // File object or URL
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  result?: ProcessedData;
  createdAt: number;
}

export type StatusUpdateCallback = (status: string, progress?: number) => void;