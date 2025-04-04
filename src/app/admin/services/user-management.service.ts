import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { User } from '../../shared/models';
import { Supabase } from '../../shared/supabase/supabase.client';

export const USERS_TABLE = 'users';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private supabaseClient = Supabase;

  getUsers = (): Observable<User[]> => {
    const promise = this.supabaseClient
      .from(USERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    return from(promise).pipe(
      map((response) => {
        if (response.error || !response) {
          console.error('error getting users', response.error.message);
          return [];
        }

        return response.data as User[];
      })
    );
  };

  updateUsers = (userId: number, user: User): Observable<any> => {
    const promise = this.supabaseClient
      .from(USERS_TABLE)
      .update(user)
      .eq('id', userId)
      .select();

    return from(promise).pipe(
      map((response) => {
        if (response.error || !response) {
          console.error('error signing up', response.error.message);
          return;
        }

        return response.data;
      })
    );
  };

  deleteUser = (userId: string) => {
    return from(
      this.supabaseClient.from(USERS_TABLE).delete().eq('id', userId)
    ).pipe(
      map((response) => {
        if (response.error) {
          console.error('Error deleting user:', response.error.message);
          return null;
        }
        return 'User deleted successfully';
      })
    );
  };
}
