import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import {
  QuestionMinimal,
  QuizDB,
  QuizResult,
  SampleQuizQuestion,
} from '../../shared/models';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

export const QUIZ_TABLE = 'quizzes';
export const QUESTIONS_TABLE = 'questions';
export const QUIZ_RESULTS_TABLE = 'quiz_results';
export const QUIZ_QUESTIONS_RESULTS_TABLE = 'quiz_question_results';

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
          id: q.id,
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

  saveQuizResult = (result: QuizResult): Observable<any> => {
    console.log('saving quiz result');
  
    let resultObject = {
      user_id: result.user_id,
      quiz_id: result.quiz_id,
      quiz_title: result.quiz_title,
      total_questions: result.total_questions,
      correct_answers: result.correct_answers,
      wrong_answers: result.wrong_answers,
      score_percentage: result.score_percentage,
      completed_at: result.completed_at,
    };
  
    const promise = this.supabaseClient
      .from(QUIZ_RESULTS_TABLE)
      .insert([resultObject])
      .select();
  
    return from(promise).pipe(
      switchMap((response) => {
        if (response.error) {
          console.error('Problem adding quiz results', response.error);
          return throwError(() => response.error);
        }
  
        if (response.data && response.data.length > 0) {
          const resultId = response.data[0].id;

          console.log("resopnse response", response.data);
          
  
          // Array of Observables for inserting question results
          const questionResultsObservables = result.question_results.map((qResult) => {
            let questionResult = {
              result_id: resultId,
              question_id: qResult.question_id,
              question_text: qResult.question_text,
              user_answer: qResult.user_answer,
              correct_answer: qResult.correct_answer,
              is_correct: qResult.is_correct,
            };
            console.log("questionResult", questionResult);
            
  
            return from(
              this.supabaseClient.from(QUIZ_QUESTIONS_RESULTS_TABLE).insert([questionResult]).select()
            ).pipe(
              tap((qResponse) => {
                console.log("resopnse", qResponse);
                
                if (qResponse.error) {
                  console.error('Problem adding quiz question results', qResponse.error);
                } else {
                  console.log('Successfully added question result:', qResponse.data);
                }
              })
            );
          });
  
          // Execute all insert operations
          return forkJoin(questionResultsObservables);
        }
  
        return of(null);
      })
    );
  };
  
}
