import { Injectable } from '@angular/core';
import { Supabase } from '../../shared/supabase/supabase.client';
import { from, map, Observable } from 'rxjs';
import { StudentPerformance } from '../../shared/models';

export const GET_USER_PROGRESS = 'get_user_progress';

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private supabaseClient = Supabase;

  getStudentPerformance = (): Observable<StudentPerformance[]> => {
    const promise = this.supabaseClient.rpc(GET_USER_PROGRESS).select('*');

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('error getting student performance');
          throw error;
        }
        return data as StudentPerformance[];
      })
    );
  };
}
