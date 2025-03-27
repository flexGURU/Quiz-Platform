import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { QuestionMinimal, QuizDB, SampleQuizQuestion } from '../../shared/models';
import { from, map, Observable } from 'rxjs';

export const QUIZ_TABLE = 'quizzes';
export const QUESTIONS_TABLE = 'questions';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private supabaseClient = createClient(
    environment.projectUrl,
    environment.apiKey
  );

  getQuizzes = (): Observable<QuizDB[]> => {
    const promise = this.supabaseClient.from(QUIZ_TABLE).select('*');

    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          console.log(response.error);
        }
        return response.data as QuizDB[];
      })
    );
  };

  getQuizQuestions = (quiz_id: string): Observable<SampleQuizQuestion[]> => {
    const promise = this.supabaseClient
      .from(QUESTIONS_TABLE)
      .select('*')
      .eq('quiz_id', quiz_id);
  
    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          console.log('Error getting quiz questions:', response.error.message);
          return [];
        }
        console.log('Supabase response:', response.data);
  
        return response.data.map((q: QuestionMinimal, index: number) => ({
          id: index + 1,
          question_text: q.question_text,
          options: Object.entries(q.options).map(([key, value]) => ({
            id: key,
            text: value as any,  
          })),
          correct_answer: q.correct_answer,
        })) as SampleQuizQuestion[];
      })
    );
  };
  
  
}
