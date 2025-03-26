import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { QuizDB } from '../../shared/models';
import { from, map, Observable } from 'rxjs';

export const QUIZ_TABLE = 'quizzes';

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
}
