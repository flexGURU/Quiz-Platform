import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabaseClient = createClient(
    environment.projectUrl,
    environment.apiKey
  );

  signUp = (
    email: string,
    password: string,
    username: string,
    role: string
  ): Observable<any> => {
    const promise = this.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          role: role,
        },
      },
    });

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

  login = (email: string, password: string): Observable<any> => {
    const promise = this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    return from(promise).pipe(
      map((response) => {
        if (response.error || !response) {
          console.error('error signing up', response.error.message);
          return;
        }

        return from(
          this.supabaseClient
            .from('users')
            .select('*')
            .eq('auth_id', response.data.user.id)
        );
      })
    );
  };
}
