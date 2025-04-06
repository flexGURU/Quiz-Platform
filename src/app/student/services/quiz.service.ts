import { Injectable } from '@angular/core';
import {
  QuestionMinimal,
  QuestionResult,
  QuizDB,
  QuizResult,
  SampleQuizQuestion,
} from '../../shared/models';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Supabase } from '../../shared/supabase/supabase.client';

export const QUIZ_TABLE = 'quizzes';
export const QUESTIONS_TABLE = 'questions';
export const QUIZ_RESULTS_TABLE = 'quiz_results';
export const QUIZ_QUESTIONS_RESULTS_TABLE = 'quiz_question_results';
export const USER_POINTS_TABLE = 'user_points';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private supabaseClient = Supabase;

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

  getQuizQuestions = (quiz_id: string): Observable<SampleQuizQuestion[]> => {
    const promise = this.supabaseClient
      .from(QUESTIONS_TABLE)
      .select('*')
      .eq('quiz_id', quiz_id);

    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          console.log('Error getting quiz questions:', response.error.message);
          return [];
        }
        console.log('Supabase response:', response.data);

        return response.data.map((q: QuestionMinimal, index: number) => ({
          id: q.id,
          question_text: q.question_text,
          options: Object.entries(q.options).map(([key, value]) => ({
            id: key,
            text: value as any,
          })),
          correct_answer: q.correct_answer,
        })) as SampleQuizQuestion[];
      })
    );
  };

  // First function: Save the main quiz result
  saveQuizResult = (result: QuizResult): Observable<number> => {
    let resultObject = {
      user_id: result.user_id,
      quiz_id: result.quiz_id,
      quiz_title: result.quiz_title,
      total_questions: result.total_questions,
      correct_answers: result.correct_answers,
      wrong_answers: result.wrong_answers,
      score_percentage: result.score_percentage,
      completed_at: result.completed_at,
    };

    const promise = this.supabaseClient
      .from(QUIZ_RESULTS_TABLE)
      .insert([resultObject])
      .select();

    return from(promise).pipe(
      switchMap((response) => {
        if (response.error) {
          console.error('Problem adding quiz results', response.error);
          return throwError(() => response.error);
        }

        if (response.data && response.data.length > 0) {
          const resultId = response.data[0].id; // ✅ Extract resultId
          return this.saveQuizQuestionResults(
            result.question_results,
            resultId
          ).pipe(
            map(() => resultId) // ✅ Return only resultId
          );
        }

        return of(null);
      })
    );
  };

  saveQuizQuestionResults = (
    questionResults: QuestionResult[],
    resultId: number
  ): Observable<any> => {
    const questionResultsObservables = questionResults.map((qResult) => {
      let questionResult = {
        result_id: resultId,
        question_id: qResult.question_id,
        question_text: qResult.question_text,
        user_answer: qResult.user_answer,
        correct_answer: qResult.correct_answer,
        is_correct: qResult.is_correct,
      };

      return from(
        this.supabaseClient
          .from(QUIZ_QUESTIONS_RESULTS_TABLE)
          .insert([questionResult])
          .select()
      ).pipe(
        tap((qResponse) => {
          if (qResponse.error) {
            console.error(
              'Problem adding quiz question results',
              qResponse.error
            );
          }
        })
      );
    });

    return forkJoin(questionResultsObservables);
  };

  calculateQuizPoints = (quizResult: QuizResult): Observable<number> => {
    const promise = this.supabaseClient
      .from(QUIZ_TABLE)
      .select('difficulty')
      .eq('id', quizResult.quiz_id)
      .single();

    return from(promise).pipe(
      map(({ data: quiz, error: quizError }) => {
        if (!quiz || quizError) {
          console.error('Error fetching difficulty', quizError);
          return 0;
        }

        const basePoints = Math.floor(quizResult.score_percentage / 10);

        const difficultyMultipliers: Record<
          'easy' | 'medium' | 'hard',
          number
        > = {
          easy: 1,
          medium: 1.5,
          hard: 2,
        };

        const difficulty =
          quiz.difficulty as keyof typeof difficultyMultipliers;
        const difficultyMultiplier = difficultyMultipliers[difficulty] || 1;

        let totalPoints = Math.round(basePoints * difficultyMultiplier);
        if (quizResult.score_percentage === 100) {
          totalPoints += 5;
        }
        return totalPoints;
      })
    );
  };

  awardPoints = (
    userId: string,
    quizResultId: number,
    points: number
  ): void => {
    const promise = this.supabaseClient.from(USER_POINTS_TABLE).insert([
      {
        user_id: userId,
        points: points,
        source_id: quizResultId,
        earned_at: new Date().toISOString(),
      },
    ]);

    from(promise).subscribe({
      next: (data) => console.log('Points awarded successfully:', data),
      error: (error) => console.error('Error awarding points t user:', error),
    });
  };

  getQuizByUser = (userid: string) => {};

  getUpcomingQuizzes(userId: string): Observable<any[]> {
    return from(
      this.supabaseClient.rpc('get_upcoming_quizzes', { p_user_id: userId })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching upcoming quizzes:', error);
        return of([]);
      })
    );
  }

  // Get recent quizzes using SQL function
  getRecentQuizzes(userId: string): Observable<any[]> {
    return from(
      this.supabaseClient.rpc('get_recent_quizzes', { user_id: userId })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching recent quizzes:', error);
        return of([]);
      })
    );
  }

  // Get upcoming quizzes count using SQL function
  getUpcomingQuizzesCount = (userId: string): Observable<number> => {
    const promise = this.supabaseClient.rpc('get_upcoming_quizzes_count', {
      p_user_id: userId,
    });
    return from(promise).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching upcoming quizzes count:', error);
        return of(0);
      })
    );
  };

  getCompletedQuizzesCount(userId: string): Observable<number> {
    return from(
      this.supabaseClient.rpc('get_completed_quizzes_count', {
        p_user_id: userId,
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching completed quizzes count:', error);
        return of(0);
      })
    );
  }
}
