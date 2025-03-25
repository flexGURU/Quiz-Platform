import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OverlayModule } from 'primeng/overlay';
import { Slider, SliderModule } from 'primeng/slider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonLabel, ButtonModule } from 'primeng/button';

interface Student {
  id: number;
  name: string;
  email: string;
  totalPoints: number;
  badgesEarned: number;
  quizzesCompleted: number;
  averageScore: number;
  lastActive: Date;
}
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
    TableModule, ReactiveFormsModule, ButtonModule

  ],
  providers: [MessageService],
  templateUrl: './student-performance.component.html',
  styleUrl: './student-performance.component.css',
})
export class StudentPerformanceComponent {
  students: Student[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      totalPoints: 8500,
      badgesEarned: 5,
      quizzesCompleted: 45,
      averageScore: 92,
      lastActive: new Date(),
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      totalPoints: 7500,
      badgesEarned: 4,
      quizzesCompleted: 38,
      averageScore: 88,
      lastActive: new Date(),
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@example.com',
      totalPoints: 9200,
      badgesEarned: 6,
      quizzesCompleted: 50,
      averageScore: 95,
      lastActive: new Date(),
    },
  ];

  filteredStudents: Student[] = [...this.students];
  selectedStudent: Student | null = null;
  quizAttempts: QuizAttempt[] = [
    {
      id: 1,
      quizName: 'Math Quiz',
      dateCompleted: new Date(),
      score: 90,
      timeTaken: 30,
      correctAnswers: 27,
      totalQuestions: 30,
    },
    {
      id: 2,
      quizName: 'Science Quiz',
      dateCompleted: new Date(),
      score: 85,
      timeTaken: 28,
      correctAnswers: 25,
      totalQuestions: 30,
    },
    {
      id: 3,
      quizName: 'History Quiz',
      dateCompleted: new Date(),
      score: 92,
      timeTaken: 32,
      correctAnswers: 28,
      totalQuestions: 30,
    },
  ];

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

  ngOnInit() {
    this.initChartOptions();
  }

  viewStudentDetails(student: Student) {
    this.selectedStudent = student;
    this.loadStudentPerformance(student.id);
  }

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

  searchStudents() {
    if (!this.searchQuery.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredStudents = this.students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
  }

  filterStudents() {
    this.filteredStudents = this.students.filter((student) => {
      return (
        student.totalPoints >= this.filterOptions.pointsRange[0] &&
        student.totalPoints <= this.filterOptions.pointsRange[1] &&
        student.quizzesCompleted >= this.filterOptions.quizzesRange[0] &&
        student.quizzesCompleted <= this.filterOptions.quizzesRange[1] &&
        student.averageScore >= this.filterOptions.averageScoreRange[0] &&
        student.averageScore <= this.filterOptions.averageScoreRange[1]
      );
    });
  }

  sortStudents(field: keyof Student) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder * -1;
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }

    this.filteredStudents.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * this.sortOrder;
      } else {
        return (valueA as number) - (valueB as number) * this.sortOrder;
      }
    });
  }

  exportStudentReport() {
    if (!this.selectedStudent) return;

    this.messageService.add({
      severity: 'success',
      summary: 'Export',
      detail: `Exporting report for ${this.selectedStudent.name}`,
    });

    setTimeout(() => {
      const link = document.createElement('a');
      link.setAttribute(
        'download',
        `${this.selectedStudent?.name.replace(' ', '_')}_report.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  }

  resetFilters() {
    this.searchQuery = '';
    this.filterOptions = {
      pointsRange: [0, 10000],
      quizzesRange: [0, 100],
      averageScoreRange: [0, 100],
    };
    this.filteredStudents = [...this.students];
  }
}
