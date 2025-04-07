import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OverlayModule } from 'primeng/overlay';
import { Slider, SliderModule } from 'primeng/slider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonLabel, ButtonModule } from 'primeng/button';
import { StudentPerformance } from '../../../shared/models';
import { PerformanceService } from '../../services/performance.service';

interface QuizAttempt {
  id: number;
  quizName: string;
  dateCompleted: Date;
  score: number;
  timeTaken: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface PerformanceData {
  quizScores: any[];
  strengthsWeaknesses: any[];
  timeData: any[];
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
  ],
  providers: [MessageService],
  templateUrl: './student-performance.component.html',
  styleUrl: './student-performance.component.css',
})
export class StudentPerformanceComponent {
  students: StudentPerformance[] = [];

  quizAttempts: QuizAttempt[] = [];

  performanceData: PerformanceData | null = {
    quizScores: [],
    strengthsWeaknesses: [],
    timeData: [],
  };

  // Charts
  quizScoreOptions: any;
  timeSpentOptions: any;
  strengthsOptions: any;

  // Filters
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
      console.log("student performance", response);
      
      this.students = response;
    });
  }

  viewStudentDetails() {}

  loadStudentPerformance(studentId: number) {
    // Dummy data already loaded
    this.updateCharts();
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

  updateCharts() {
    if (!this.performanceData) return;
    // Update chart data here
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
}
