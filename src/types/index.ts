export type OperationType = '+' | '-' | '*' | '/' | '%' | '^';

export interface Question {
  id: number;
  text: string;
  answer: number;
  operation: OperationType;
  level: number;
}

export interface GameStats {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAttempts: number;
  level: number;
  timeTaken: number;
}
