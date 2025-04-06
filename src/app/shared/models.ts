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
  numberofquestions: number;
  minutes?: number;
  created_at?: Date;
}

export interface QuizTest {
  id: string;
  title: string;
  questions: QuestionMinimal[];
  timeLimit: number;
}

export interface QuestionMinimal {
  id: string;
  question_text: string;
  options: Options[];
  correct_answer: string;
}

export interface SampleQuizQuestion {
  id: string;
  question_text: string;
  options: {
    id: string;
    text: string;
  }[];
  correct_answer: string;
}

export interface SampleQuiz {
  id: string;
  title: string;
  questions: SampleQuizQuestion[];
  timeLimit: number;
}

export interface QuizResult {
  id?: string;
  user_id?: string;
  quiz_id: string;
  quiz_title: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score_percentage: number;
  question_results: QuestionResult[];
  completed_at: string;
}

export interface QuestionResult {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  options?: any;
}

export interface User {
  id?: string;
  full_name: string;
  email: string;
  role: string;
  password?: string;
}
