import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Supabase } from '../../shared/supabase/supabase.client';
import { Observable, from } from 'rxjs';
import { LeaderboardEntry } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private supabase!: SupabaseClient;
  constructor() {
    this.supabase = Supabase;
  }


  getLeaderboard(limit: number = 10, offset: number = 0): Observable<LeaderboardEntry[]> {
    return from(
      this.supabase
        .rpc('get_leaderboard', { limit_count: limit, offset_value: offset })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
          }
          return data as LeaderboardEntry[];
        })
    );
  }

  // Optional: Get current user's rank
  getCurrentUserRank(userId: string): Observable<LeaderboardEntry | null> {
    return from(
      this.supabase
        .rpc('get_leaderboard', { limit_count: 1000, offset_value: 0 }) // Fetch with large limit to find user
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching user rank:', error);
            throw error;
          }
          
          const userEntry = (data as LeaderboardEntry[]).find(entry => entry.user_id === userId);
          return userEntry || null;
        })
    );
  }



}
