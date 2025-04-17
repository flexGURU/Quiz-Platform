import { Injectable } from '@angular/core';
import { Session, User } from '@supabase/supabase-js';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  ReplaySubject,
  filter,
  firstValueFrom,
} from 'rxjs';
import { Router } from '@angular/router';
import { Supabase } from '../supabase/supabase.client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabaseClient = Supabase;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentSessionSubject = new BehaviorSubject<Session | null>(null);
  private currentRoleSubject = new BehaviorSubject<string | null>(null);

  private authInitializedSubject = new ReplaySubject<boolean>(1);
  public authInitialized$ = this.authInitializedSubject.asObservable();

  private readonly storedUserKeyID = 'USER_ID';

  constructor(private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      this.handleAuthChange(session);
    });

    // Load initial session
    this.loadInitialSession().subscribe();
  }

  private loadInitialSession(): Observable<void> {
    return from(this.supabaseClient.auth.getSession()).pipe(
      tap(({ data }) => {
        if (data.session) {
          this.handleAuthChange(data.session);
        }
        // Mark initialization as complete regardless of whether we have a session
        this.authInitializedSubject.next(true);
      }),
      map(() => void 0)
    );
  }

  private handleAuthChange(session: Session | null): void {
    this.currentSessionSubject.next(session);
    this.currentUserSubject.next(session?.user || null);

    if (session?.user) {
      this.loadUserRole(session.user);
    } else {
      this.currentRoleSubject.next(null);
    }
  }

  private loadUserRole(user: User): void {
    const role = user.user_metadata?.['role'] || null;
    this.currentRoleSubject.next(role);
  }

  /**
   * Wait for authentication to be initialized before proceeding
   * This is crucial for guards to work properly on direct navigation and refresh
   */
  async waitForAuthInitialized(): Promise<boolean> {
    return await firstValueFrom(
      this.authInitialized$.pipe(filter((initialized) => initialized === true))
    );
  }

  signUp(
    email: string,
    password: string,
    username: string,
    role: string
  ): Observable<any> {
    return from(
      this.supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
          },
        },
      })
    ).pipe(
      tap(({ data, error }) => {
        if (data?.session) {
          this.handleAuthChange(data.session);
        }
        if (error) {
          console.error('Signup error:', error.message);
        }
      })
    );
  }

  login(
    email: string,
    password: string
  ): Observable<{ user: any | null; error: any | null }> {
    return from(
      this.supabaseClient.auth.signInWithPassword({ email, password })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }

        this.handleAuthChange(data.session);

        return from(
          this.supabaseClient
            .from('users')
            .select('*')
            .eq('auth_id', data.user?.id)
            .single()
        ).pipe(
          map(({ data: userData, error: userFetchError }) => {
            if (userData) {
              this.userId = userData.id;
              
            }
            if (userFetchError) {
              console.error(
                'Error fetching user from users table:',
                userFetchError
              );
              return { user: null, error: userFetchError };
            }

            return { user: userData, error: null };
          })
        );
      }),
      catchError((error) => {
        console.error('Login error:', error.message || error);
        return of({ user: null, error });
      })
    );
  }

  signOut() {
    return from(this.supabaseClient.auth.signOut()).pipe(
      tap(() => {
        this.handleAuthChange(null);
        this.router.navigate(['/login']);
      })
    );
  }

  private set userId(id: string) {
    localStorage.setItem(this.storedUserKeyID, id);
  }

  get userId(): string {
    const id = localStorage.getItem(this.storedUserKeyID) || '';
    return id;
  }

  // Observables
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentSession$(): Observable<Session | null> {
    return this.currentSessionSubject.asObservable();
  }

  get userRole$(): Observable<string | null> {
    return this.currentRoleSubject.asObservable();
  }

  // Current values
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get currentSession(): Session | null {
    return this.currentSessionSubject.value;
  }

  get userRole(): string | null {
    return this.currentRoleSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentSession;
  }

  hasRole(role: string | string[]): boolean {
    const currentRole = this.userRole;
    if (!currentRole) return false;
    return Array.isArray(role)
      ? role.includes(currentRole)
      : currentRole === role;
  }
}
