export interface Violation {
  type: string;
  timestamp?: Date;
}


export interface QuizViolation {
    user_id: string;
    quiz_id: string;
    violations: Violation[];
  }