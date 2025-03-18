import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';


interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  correctAnswerText: string;
  explanation: string;
  userAnswer: string;
  userAnswerText: string;
  isCorrect: boolean;
}

interface QuizResult {
  quizId: number;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  questions: Question[];
  completionTime: number; // in seconds
}

@Component({
  selector: 'app-quiz-result',
  imports: [CardModule, CommonModule, ButtonModule],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css'
})
export class QuizResultComponent {
  quizResult: QuizResult | null = null;
  chartData: any;
  chartOptions: any;
  showScoreAnimation = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const quizId = this.route.snapshot.params['id'];
    // In a real app, fetch quiz results from a service
    this.loadQuizResult(quizId);
    this.prepareChartData();
    
    // Animate score reveal
    setTimeout(() => {
      this.showScoreAnimation = true;
    }, 500);
  }

  loadQuizResult(quizId: number): void {
    // Mock data - in a real app, this would come from a service
    this.quizResult = {
      quizId: quizId,
      quizTitle: 'Basic Algebra Quiz',
      score: 75,
      maxScore: 100,
      percentage: 75,
      correctCount: 2,
      wrongCount: 1,
      completionTime: 240, // 4 minutes
      questions: [
        {
          id: 1,
          text: 'What is the value of x in the equation 3x + 5 = 14?',
          correctAnswer: 'b',
          correctAnswerText: '3',
          explanation: 'To solve this equation, subtract 5 from both sides to get 3x = 9, then divide by 3 to get x = 3.',
          userAnswer: 'b',
          userAnswerText: '3',
          isCorrect: true
        },
        {
          id: 2,
          text: 'Solve for y: 2y - 8 = 10',
          correctAnswer: 'a',
          correctAnswerText: '9',
          explanation: 'To solve this equation, add 8 to both sides to get 2y = 18, then divide by 2 to get y = 9.',
          userAnswer: 'a',
          userAnswerText: '9',
          isCorrect: true
        },
        {
          id: 3,
          text: 'If a rectangle has a length of 12 units and a width of 5 units, what is its area?',
          correctAnswer: '60',
          correctAnswerText: '60',
          explanation: 'The area of a rectangle is calculated by multiplying length by width: 12 × 5 = 60 square units.',
          userAnswer: '57',
          userAnswerText: '57',
          isCorrect: false
        }
      ]
    };
  }

  prepareChartData(): void {
    if (!this.quizResult) return;

    // Prepare data for performance breakdown chart
    this.chartData = {
      labels: ['Correct', 'Wrong'],
      datasets: [
        {
          data: [this.quizResult.correctCount, this.quizResult.wrongCount],
          backgroundColor: ['#4CAF50', '#F44336'],
          hoverBackgroundColor: ['#45a049', '#e53935']
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'right'
        }
      }
    };
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  retryQuiz(): void {
    // In a real app, navigate to quiz attempt page
    console.log('Retrying quiz', this.quizResult?.quizId);
  }

  viewLeaderboard(): void {
    // In a real app, navigate to leaderboard page
    console.log('Viewing leaderboard');
  }

  viewSimilarQuizzes(): void {
    // In a real app, navigate to home page with filters
    console.log('Viewing similar quizzes');
  }

}
