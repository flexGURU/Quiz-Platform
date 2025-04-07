import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StudentPerformance } from '../../../shared/models';
import { PerformanceService } from '../../services/performance.service';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface QuizAttempt {
  id: number;
  quizName: string;
  dateCompleted: Date;
  score: number;
  timeTaken: number;
  correctAnswers: number;
  totalQuestions: number;
}

@Component({
  selector: 'app-student-performance',
  imports: [
    SliderModule,
    FormsModule,
    CommonModule,
    OverlayPanelModule,
    ChartModule,
    ProgressBarModule,
    TableModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './student-performance.component.html',
  styleUrl: './student-performance.component.css',
})
export class StudentPerformanceComponent {
  students: StudentPerformance[] = [];
  isLoadingSkeleton = false;
  isLoading = false;
  quizAttempts: QuizAttempt[] = [];
  displayStudentDialog: boolean = false;
  selectedStudent!: StudentPerformance;

  quizChartData: any;
  quizChartOptions: any;

  quizScoreOptions: any;
  timeSpentOptions: any;
  strengthsOptions: any;

  searchQuery: string = '';
  sortField: string = 'name';
  sortOrder: number = 1;
  filterOptions: any = {
    pointsRange: [0, 10000],
    quizzesRange: [0, 100],
    averageScoreRange: [0, 100],
  };

  constructor(private messageService: MessageService) {}
  studentService = inject(PerformanceService);

  ngOnInit() {
    this.initChartOptions();
    this.studentService.getStudentPerformance().subscribe((response) => {
      console.log('student performance', response);

      this.students = response;
    });
  }

  viewStudentDetails(student: StudentPerformance) {
    console.log('student slected', student);
    this.selectedStudent = student;
    this.displayStudentDialog = true;
    console.log('student slected', this.selectedStudent);
  }

  updateChartData(quizHistory: QuizAttempt[]): void {
    const labels = quizHistory.map((quiz) => quiz.quizName);
    const scores = quizHistory.map((quiz) => quiz.score);

    this.quizChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Quiz Scores',
          data: scores,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };
  }

  loadStudentPerformance(studentId: number) {
    // Dummy data already loaded
  }

  initChartOptions() {
    this.quizScoreOptions = {
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { min: 0, max: 100, title: { display: true, text: 'Score (%)' } },
        x: { title: { display: true, text: 'Quiz' } },
      },
    };

    this.timeSpentOptions = {
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { min: 0, title: { display: true, text: 'Time (minutes)' } },
        x: { title: { display: true, text: 'Quiz' } },
      },
    };

    this.strengthsOptions = {
      plugins: { legend: { position: 'right' } },
      scales: {
        y: { min: 0, max: 100, title: { display: true, text: 'Accuracy (%)' } },
      },
    };
  }

  searchStudents() {}

  sortStudents(field: keyof StudentPerformance) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder * -1;
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }
  }

  exportStudentReport() {}

  resetFilters() {
    this.searchQuery = '';
    this.filterOptions = {
      pointsRange: [0, 10000],
      quizzesRange: [0, 100],
      averageScoreRange: [0, 100],
    };
  }
  closeDialog(): void {
    this.displayStudentDialog = false;
    // this.selectedStudent = null;
  }
}
