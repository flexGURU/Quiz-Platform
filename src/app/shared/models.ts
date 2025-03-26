export interface Quiz {
  id: number;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pointsToEarn: number;
  hasTimeLimit: boolean;
  recommended: boolean;
}

interface Options {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface QuestionsDB {
  id?: number;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: Options;
  correct_answer: string;
  points: number;
  created_at?: Date;
}

export interface Questions {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct_answer: string;
  points: number;
  created_at: Date;
}

export interface Topic {
  name: string;
}

export interface QuizDB {
  id?: string;
  title: string;
  subject: string;
  difficulty: string;
  created_at?: Date;
}
