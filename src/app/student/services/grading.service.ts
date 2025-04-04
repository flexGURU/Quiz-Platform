import { Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { QuestionResult, QuizResult } from '../../shared/models';
import { Supabase } from '../../shared/supabase/supabase.client';

export const QUIZ_RESULTS_TABLE = 'quiz_results';
export const QUIZ_QUESTIONS_RESULTS_TABLE = 'quiz_question_results';

@Injectable({
  providedIn: 'root',
})
export class GradingService {
  private supabaseClient = Supabase;

  constructor() {}

  getGradedQuiz = (quizId: string): Observable<QuizResult | null> => {
    const promise = this.supabaseClient
      .from(QUIZ_RESULTS_TABLE)
      .select('*')
      .eq('quiz_id', quizId)
      .single();

    return from(promise).pipe(
      map((response) => {
        if (response.error || !response.data) {
          console.error('error getting graded quiz');
          return null;
        }
        return response.data as QuizResult;
      })
    );
  };

  getQuestionResults = (resultId: string | undefined): Observable<QuestionResult[]> => {
    // First get all question results for this quiz result
    return from(
      this.supabaseClient
        .from('quiz_question_results')
        .select('*')
        .eq('result_id', resultId)
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        
        const questionResults = response.data;
        // Extract all question IDs
        const questionIds = questionResults.map(qr => qr.question_id);
        
        // If there are no question results, return empty array
        if (questionIds.length === 0) {
          return of([]);
        }
        
        // Get all questions in one query
        return from(
          this.supabaseClient
            .from('questions')
            .select('id, question_type, options')
            .in('id', questionIds)
        ).pipe(
          map(questionsResponse => {
            if (questionsResponse.error) throw questionsResponse.error;
            
            // Create a map for easy lookup
            const questionsMap: {[key: string]: any} = {};
            questionsResponse.data.forEach(q => {
              questionsMap[q.id] = q;
            });
            
            // Combine the data
            return questionResults.map(qr => ({
              question_id: qr.question_id,
              question_text: qr.question_text,
              user_answer: qr.user_answer,
              correct_answer: qr.correct_answer,
              is_correct: qr.is_correct,
              question_type: questionsMap[qr.question_id]?.question_type,
              options: questionsMap[qr.question_id]?.options
            })) as QuestionResult[];
          })
        );
      })
    );
  }
}
