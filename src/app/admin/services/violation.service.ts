import { Injectable } from '@angular/core';
import { Supabase } from '../../shared/supabase/supabase.client';
import { Observable, from, map } from 'rxjs';
import { QuizViolation, Violation } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ViolationService {
  supabase = Supabase

  constructor() { }

  getQuizViolations(): Observable<QuizViolation[]> {
    return from(
      this.supabase
        .rpc('get_quiz_violations')
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching violations:', error);
          throw new Error(error.message);
        }
        return this.mapViolationsData(data);
      })
    );
  }

  private mapViolationsData(data: any[]): QuizViolation[] {
    return data.map(item => ({
      violation_id: item.violation_id,
      user_id: item.user_id,
      full_name: item.full_name,
      email: item.email,
      quiz_id: item.quiz_id,
      quiz_title: item.quiz_title,
      violations: this.parseViolations(item.violations),
      created_at: new Date(item.created_at)
    }));
  }

  private parseViolations(violationsArray: any[]): Violation[] {
    let violations: Violation[] = [];
    
    violationsArray.forEach(violationGroup => {
      // Parse JSON string if needed
      if (typeof violationGroup === 'string') {
        try {
          violationGroup = JSON.parse(violationGroup);
        } catch (e) {
          console.error('Error parsing violation JSON:', e);
        }
      }
      
      // Handle array of violations
      if (Array.isArray(violationGroup)) {
        violations = violations.concat(violationGroup);
      } else {
        violations.push(violationGroup);
      }
    });
    
    return violations.map(v => ({
      type: v.type,
      timestamp: v.timestamp ? new Date(v.timestamp) : undefined
    }));
  }

}
