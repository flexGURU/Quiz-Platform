import { inject, Injectable } from '@angular/core';
import { Supabase } from '../../shared/supabase/supabase.client';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ForumPost, ForumReply } from '../../shared/models';
import { error } from 'console';
import { AuthService } from '../../shared/services/auth.service';

export const GET_FROM_POST_RPC = 'get_forum_posts';
export const FORUM_POST_TABLE = 'forum_posts';
export const FORUM_REPLIES_TABLE = 'forum_replies';
export const FORUM_POSTS_TABLE = 'forum_posts';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private supabaseClient = Supabase;
  private forumPostsSubject = new BehaviorSubject<ForumPost[]>([]);
  forumPosts$ = this.forumPostsSubject.asObservable();
  repliesSubject = new BehaviorSubject<ForumReply[]>([]);
  private userId!: string;
  replies$ = this.repliesSubject.asObservable();
  private forumCountSubject = new BehaviorSubject<number | null>(0);
  forumCount$ = this.forumCountSubject.asObservable();

  authService = inject(AuthService);

  constructor() {
    this.userId = this.authService.userId;
    this.getForumCount().subscribe()
  }

  getForumPosts = (
    parent_post_id: string | null = null
  ): Observable<ForumPost[]> => {
    const promise = this.supabaseClient
      .rpc(GET_FROM_POST_RPC, {
        parent_post_id,
      })
      .select('*');

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      tap((posts) => {
        this.forumPostsSubject.next(posts);
      }),
      catchError((error) => {
        console.error('error fecthing forum posts', error);
        this.forumPostsSubject.next([]);
        return [];
      })
    );
  };

  createForumPost = (
    title: string,
    content: string,
    parentId: string | null = null
  ): Observable<ForumPost | null> => {
    const promise = this.supabaseClient
      .from(FORUM_POST_TABLE)
      .insert({
        user_id: this.userId,
        title,
        content,
        parent_id: parentId,
      })
      .select('*')
      .single();

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      tap((post) => {
        // Refresh the posts list after creation
        if (post.parent_id) {
          this.getForumPosts(post.parent_id).subscribe();
        } else {
          this.getForumPosts().subscribe();
        }
      }),
      catchError((error) => {
        console.error('error creating forum post', error);
        return of(null);
      })
    );
  };

  updatePostReactions = (
    postId: string,
    reaction: 'like' | 'dislike'
  ): Observable<void> => {
    const promise = this.supabaseClient
      .from('forum_posts')
      .select('likes, dislikes')
      .eq('id', postId)
      .single();

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        const updates =
          reaction === 'like'
            ? { likes: (data.likes ?? 0) + 1 }
            : { dislikes: (data.dislikes ?? 0) + 1 };

        return updates;
      }),
      switchMap((updates) =>
        from(
          this.supabaseClient
            .from('forum_posts')
            .update(updates)
            .eq('id', postId)
        )
      ),
      map(({ error }) => {
        if (error) throw error;
        // Refresh the posts after update
        this.getForumPosts().subscribe();
      }),
      catchError((error) => {
        console.error(`Error ${reaction}ing post:`, error);
        return of(); // return an empty observable
      })
    );
  };

  getReplies(postId: string): Observable<ForumReply[]> {
    const promise = this.supabaseClient
      .from(FORUM_REPLIES_TABLE)
      .select(
        `
        *,
        users:user_id (
          id,
          full_name,
          email,
          role
        )
      `
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data.map((reply) => ({
          ...reply,
          user_full_name: reply.users.full_name,
          user_email: reply.users.email,
          user_role: reply.users.role,
        }));
      }),
      tap((replies) => {
        this.repliesSubject.next(replies);
      }),
      catchError((error) => {
        console.error('Error fetching replies', error);
        this.repliesSubject.next([]);
        return of([]);
      })
    );
  }

  createReply(postId: string, content: string): Observable<ForumReply | null> {
    const promise = this.supabaseClient
      .from(FORUM_REPLIES_TABLE)
      .insert({
        post_id: postId,
        user_id: this.userId,
        content,
      })
      .select('*')
      .single();

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      tap(() => {
        // Refresh replies after creating a new one
        this.getReplies(postId).subscribe();
      }),
      catchError((error) => {
        console.error('Error creating reply', error);
        return of(null);
      })
    );
  }

  updateReplyReactions(
    replyId: string,
    reaction: 'like' | 'dislike',
    postId: string
  ): Observable<void> {
    const promise = this.supabaseClient
      .from(FORUM_REPLIES_TABLE)
      .select('likes, dislikes')
      .eq('id', replyId)
      .single();

    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;

        const updates =
          reaction === 'like'
            ? { likes: (data.likes ?? 0) + 1 }
            : { dislikes: (data.dislikes ?? 0) + 1 };

        return updates;
      }),
      switchMap((updates) =>
        from(
          this.supabaseClient
            .from(FORUM_REPLIES_TABLE)
            .update(updates)
            .eq('id', replyId)
        )
      ),
      map(({ error }) => {
        if (error) throw error;
        // Refresh replies after updating reactions
        this.getReplies(postId).subscribe();
      }),
      catchError((error) => {
        console.error(`Error ${reaction}ing reply:`, error);
        return of();
      })
    );
  }

  getForumCount = (): Observable<number> => {
    const promise = this.supabaseClient
      .from(FORUM_POST_TABLE)
      .select('*', { count: 'exact', head: true });
  
    return from(promise).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;
        return count || 0;
      }),
      tap((response) => {
        this.forumCountSubject.next(response);
      })
    );
  };
  
}
