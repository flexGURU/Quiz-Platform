import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { GradingService } from '../../../services/grading.service';
import { QuestionResult, QuizResult } from '../../../../shared/models';
import { response } from 'express';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-quiz-result',
  imports: [
    CardModule,
    RouterLink,
    CommonModule,
    ButtonModule,
    AccordionModule,
    SpinnerComponent,
  ],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css',
})
export class QuizResultComponent {
  chartData: any;
  chartOptions: any;
  showScoreAnimation = false;
  quizId!: string;
  quizResult: QuizResult | null = null;
  questionResults: QuestionResult[] = [];
  showPerformanceQuestions: Boolean = false;
  userID!: string;

  loadSpinner = false;

  constructor(private route: ActivatedRoute) {}
  private supabaseClient = inject(GradingService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((response) => {
      this.quizId = response['id'];
    });

    this.userID = this.authService.userId;

    this.supabaseClient
      .getGradedQuiz(this.quizId, this.userID)
      .subscribe((response) => {
        this.quizResult = response;
      });
    // this.prepareChartData();

    setTimeout(() => {
      this.showScoreAnimation = true;
    }, 500);
  }

  showPerformance = () => {
    this.loadSpinner = true;
    if (this.quizId && this.quizResult) {
      this.supabaseClient.getQuestionResults(this.quizResult.id).subscribe({
        next: (response) => {
          this.loadSpinner = false;
          this.showPerformanceQuestions = true;
          this.questionResults = response;
        },
        error: (err) => {
          console.error('error', err);
        },
      });
    }
  };

  // prepareChartData(): void {
  //   if (!this.quizResult) return;

  //   // Prepare data for performance breakdown chart
  //   this.chartData = {
  //     labels: ['Correct', 'Wrong'],
  //     datasets: [
  //       {
  //         data: [this.quizResult.correctCount, this.quizResult.wrongCount],
  //         backgroundColor: ['#4CAF50', '#F44336'],
  //         hoverBackgroundColor: ['#45a049', '#e53935'],
  //       },
  //     ],
  //   };

  //   this.chartOptions = {
  //     plugins: {
  //       legend: {
  //         position: 'right',
  //       },
  //     },
  //   };
  // }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
}
