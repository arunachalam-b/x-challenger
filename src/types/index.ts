// src/types/index.ts
export type OperationType = '+' | '-' | '*' | '/' | '%' | '^';

export interface Question {
  id: number; // Unique ID for React keys
  text: string; // e.g., "5 + 3 ="
  answer: number;
  operation: OperationType;
  level: number;
}

export interface GameStats {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAttempts: number; // Total wrong tries across all questions
  level: number;
  timeTaken: number; // Total time configured
}
