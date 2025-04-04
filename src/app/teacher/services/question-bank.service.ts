import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Questions, QuestionsDB, QuizDB, Topic } from '../../shared/models';
import { Supabase } from '../../shared/supabase/supabase.client';

export const QUESTIONS_TABLE = 'questions';
export const SUBJECT_TABLE = 'subjects';
export const QUIZ_TABLE = 'quizzes';

@Injectable({
  providedIn: 'root',
})
export class QuestionBankService {
  private supabaseClient = Supabase;


  constructor() {}

  getQuestions = (): Observable<Questions[]> => {
    const promise = this.supabaseClient.from(QUESTIONS_TABLE).select('*');

    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          console.log(response.error);
        }
        return response.data as Questions[];
      })
    );
  };

  addQuestions = (questionBank: QuestionsDB[]): Observable<Questions[]> => {
    const promise = this.supabaseClient
      .from(QUESTIONS_TABLE)
      .insert(questionBank)
      .select('*');
    return from(promise).pipe(
      map((resp) => {
        if (resp.error) {
          console.error('supabase err', resp.error.message);
          throw new Error(resp.error.message);
        }
        return resp.data as Questions[];
      })
    );
  };

  addSubjects = (subject: Topic): Observable<Topic> => {
    const promise = this.supabaseClient
      .from(SUBJECT_TABLE)
      .insert(subject)
      .select('*');

    return from(promise).pipe(
      map((response) => {
        console.log(response);

        if (response.error) {
          console.error('error adding subject', response.error);
        }
        if (!response.data) {
          throw new Error('No data returned from insert operation');
        }
        return response.data as unknown as Topic;
      })
    );
  };

  // getSubjects = (): Observable<Topic[]> => {
  //   const promise = this.supabaseClient.from(SUBJECT_TABLE).select('*');

  //   return from(promise).pipe(
  //     map((response) => {
  //       if (response.error) {
  //         console.error('supabase err', response.error.message);
  //         throw new Error(response.error.message);
  //       }
  //       return response.data;
  //     })
  //   );
  // };

  addQuiz = (quiz: QuizDB): Observable<QuizDB[]> => {
    const promise = this.supabaseClient
      .from(QUIZ_TABLE)
      .insert(quiz)
      .select('*');

    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          console.error('error fecthing quizes', response.error.message);
        }
        return response.data as QuizDB[];
      })
    );
  };

  getQuizzes = (): Observable<QuizDB[]> => {
    const promise = this.supabaseClient.from(QUIZ_TABLE).select('*');

    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          console.error('error getting quizzes', response.error.message);
          throw new Error(response.error.message);
        }
        return response.data;
      })
    );
  };
}
