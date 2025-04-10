import { Injectable } from '@angular/core';
import { Supabase } from '../../shared/supabase/supabase.client';
import { catchError, from, map, Observable, of, throwError } from 'rxjs';
import { Violation } from '../components/quiz/test/violation/types';

export const QUIZ_VIOLATIONS_TABLE = 'quiz_violations';

@Injectable({
  providedIn: 'root',
})
export class ViolationService {
  private supabaseClient = Supabase;

  recordViolation = (
    user_id: string,
    quiz_id: string,
    violations: Violation[]
  ): Observable<void> => {
    const promise = this.supabaseClient.from(QUIZ_VIOLATIONS_TABLE).insert({
      user_id,
      quiz_id,
      violations,
    });

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
      }),
      catchError((error) => {
        console.error('error creatiog violations', error);
        return throwError(() => {
          error;
        });
      })
    );
  };
}
