import { Injectable } from '@angular/core';
import { Supabase } from '../../shared/supabase/supabase.client';
import { Observable, from, switchMap, catchError, of, tap, map } from 'rxjs';
import { Badge, UserBadge } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private supabase = Supabase;

  awardPoints(
    userId: string,
    quizResultId: string,
    points: number
  ): Observable<boolean> {
    return from(
      this.supabase.from('user_points').insert([
        {
          user_id: userId,
          points: points,
          source_id: quizResultId,
          earned_at: new Date().toISOString(),
        },
      ])
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError((error) => {
        console.error('Error awarding points:', error);
        return of(false);
      })
    );
  }

  // Get user's badges
  getUserBadges(userId: string): Observable<UserBadge[]> {
    return from(
      this.supabase
        .from('user_badges')
        .select(`
          id,
          user_id,
          badge_id,
          earned_at,
          created_at,
          badge:badge_id (id, name, description, image_url, points_threshold)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        // Transform the data to match our interface
        return (response.data || []).map((item) => ({
          id: item.id,
          user_id: item.user_id,
          badge_id: item.badge_id,
          earned_at: item.earned_at,
          created_at: item.created_at,
          badge: Array.isArray(item.badge) ? item.badge[0] : item.badge, // Extract first element if it's an array
        })) as UserBadge[];
      }),
      catchError((error) => {
        console.error('Error fetching badges:', error);
        return of([]);
      })
    );
  }
}
