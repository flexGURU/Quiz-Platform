import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Observable, from, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.projectUrl, environment.apiKey);
  }

  // Quiz CRUD operations
  getAllQuizzes(): Observable<any[]> {
    return from(
      this.supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError((error) => throwError(() => error))
    );
  }

  getQuizById(id: string): Observable<any> {
    return from(
      this.supabase.from('quizzes').select('*').eq('id', id).single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  createQuiz(quiz: any): Observable<any> {
    return from(
      this.supabase.from('quizzes').insert([quiz]).select().single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  updateQuiz(id: string, quiz: any): Observable<any> {
    return from(
      this.supabase.from('quizzes').update(quiz).eq('id', id).select().single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  deleteQuiz(id: string): Observable<any> {
    return from(this.supabase.from('quizzes').delete().eq('id', id)).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  // Question CRUD operations
  getQuestionsByQuizId(quizId: string): Observable<any[]> {
    return from(
      this.supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: true })
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError((error) => throwError(() => error))
    );
  }

  getQuestionById(id: string): Observable<any> {
    return from(
      this.supabase.from('questions').select('*').eq('id', id).single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  createQuestion(question: any): Observable<any> {
    return from(
      this.supabase.from('questions').insert([question]).select().single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  updateQuestion(id: string, question: any): Observable<any> {
    return from(
      this.supabase
        .from('questions')
        .update(question)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  deleteQuestion(id: string): Observable<any> {
    return from(this.supabase.from('questions').delete().eq('id', id)).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError((error) => throwError(() => error))
    );
  }
}
