import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  QuizViolation,
  Violation,
  ViolationSummary,
} from '../../../shared/models';
import { Observable, tap, catchError, of } from 'rxjs';
import { ViolationService } from '../../services/violation.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-violations',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    DividerModule,
  ],
  templateUrl: './violations.component.html',
  styleUrl: './violations.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ViolationsComponent {
  violations$!: Observable<QuizViolation[]>;
  loading = true;
  selectedViolation: QuizViolation | null = null;
  displayViolationDialog = false;

  // For the summary section
  violationSummary: ViolationSummary = {
    totalViolations: 0,
    violationsByType: new Map<string, number>(),
    mostCommonViolation: '',
  };

  constructor(
    private violationService: ViolationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadViolations();
  }

  loadViolations(): void {
    this.loading = true;
    this.violations$ = this.violationService.getQuizViolations().pipe(
      tap((violations) => {
        this.calculateViolationSummary(violations);
        this.loading = false;
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load violations data: ' + error.message,
        });
        this.loading = false;
        return of([]);
      })
    );
  }

  showViolationDetails(violation: QuizViolation): void {
    this.selectedViolation = violation;
    this.displayViolationDialog = true;
  }

  closeViolationDialog(): void {
    this.displayViolationDialog = false;
    this.selectedViolation = null;
  }

  getViolationTypeLabel(type: string): string {
    // Map violation types to more readable labels
    const violationLabels: { [key: string]: string } = {
      tab_change: 'Tab Change',
      window_blur: 'Window Left Focus',
      copy_attempt: 'Copy Attempt',
      multiple_screens: 'Multiple Screens Detected',
      face_not_detected: 'Face Not Detected',
      multiple_faces: 'Multiple Faces Detected',
      speaking: 'Speaking Detected',
    };

    return violationLabels[type] || type;
  }

  getViolationTypeIcon(type: string): string {
    // Map violation types to appropriate icons
    const violationIcons: { [key: string]: string } = {
      tab_change: 'pi pi-external-link',
      window_blur: 'pi pi-window-minimize',
      copy_attempt: 'pi pi-copy',
      multiple_screens: 'pi pi-desktop',
      face_not_detected: 'pi pi-user-minus',
      multiple_faces: 'pi pi-users',
      speaking: 'pi pi-volume-up',
    };

    return violationIcons[type] || 'pi pi-exclamation-triangle';
  }

  getViolationSeverity(type: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    // Map violation types to severity levels for visual indicators
    const violationSeverity: { [key: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' } = {
      tab_change: 'warn',
      window_blur: 'warn',
      copy_attempt: 'danger',
      multiple_screens: 'danger',
      face_not_detected: 'danger',
      multiple_faces: 'danger',
      speaking: 'warn',
    };

    return violationSeverity[type] || 'info';
  }

  // Add this method to your component class
  getViolationTypeKeys(violations: Violation[]): string[] {
    const types = new Set<string>();
    violations.forEach((v) => types.add(v.type));
    return Array.from(types);
  }

  private calculateViolationSummary(violations: QuizViolation[]): void {
    let totalCount = 0;
    const typeCount = new Map<string, number>();

    violations.forEach((v) => {
      v.violations.forEach((violation) => {
        totalCount++;
        const currentCount = typeCount.get(violation.type) || 0;
        typeCount.set(violation.type, currentCount + 1);
      });
    });

    // Find most common violation type
    let maxCount = 0;
    let mostCommon = '';
    typeCount.forEach((count, type) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = type;
      }
    });

    this.violationSummary = {
      totalViolations: totalCount,
      violationsByType: typeCount,
      mostCommonViolation: this.getViolationTypeLabel(mostCommon),
    };
  }

  // Format date for display
  formatDate(date: Date): string {
    return date.toLocaleString();
  }

  // Get count of violations by type from a violation object
  getViolationTypeCounts(violations: Violation[]): Map<string, number> {
    const counts = new Map<string, number>();
    violations.forEach((v) => {
      const current = counts.get(v.type) || 0;
      counts.set(v.type, current + 1);
    });
    return counts;
  }

  // Get total violations count for a student
  getViolationCount(violations: Violation[]): number {
    return violations.length;
  }
}
