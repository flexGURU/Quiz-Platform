import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { from, map, Observable } from 'rxjs';
import { Questions, QuestionsDB, Topic } from '../../shared/models';

export const QUESTIONS_TABLE = 'questions';
export const SUBJECT_TABLE = 'subjects';

@Injectable({
  providedIn: 'root',
})
export class QuestionBankService {
  private supabaseClient = createClient(
    environment.projectUrl,
    environment.apiKey
  );

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

  getSubjects = (): Observable<Topic[]> => {
    const promise = this.supabaseClient.from(SUBJECT_TABLE).select('*');

    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          console.error('supabase err', response.error.message);
          throw new Error(response.error.message);
        }
        return response.data;
      })
    );
  };
}
