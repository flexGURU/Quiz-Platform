import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';


interface Question {
  id: number;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  type: 'mcq' | 'fill-in-blank';
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  timeLimit: number; // in seconds, 0 means no time limit
}

@Component({
  selector: 'app-quiz-test',
  imports: [CommonModule, RouterLink, ButtonModule, RadioButtonModule, FormsModule, CardModule, StepsModule, DialogModule, ProgressBarModule],
  templateUrl: './quiz-test.component.html',
  styleUrl: './quiz-test.component.css',
})
export class QuizTestComponent {
  quiz: Quiz | null = null;
  currentQuestionIndex: number = 0;
  userAnswers: { [questionId: number]: string } = {};
  remainingTime: number = 0;
  timerSubscription?: Subscription;
  quizSubmitted: boolean = false;
  stepsModel: any = []; // Add this property for p-steps

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const quizId = +this.route.snapshot.params['id']; // Convert to number
    this.loadQuiz(quizId);
  }

  loadQuiz(quizId: number): void {
    // Mock data - in a real app, this would come from a service
    this.quiz = {
      id: quizId,
      title: 'Basic Algebra Quiz',
      questions: [
        {
          id: 1,
          text: 'What is the value of x in the equation 3x + 5 = 14?',
          options: [
            { id: 'a', text: '2' },
            { id: 'b', text: '3' },
            { id: 'c', text: '4' },
            { id: 'd', text: '5' },
          ],
          correctAnswer: 'b',
          type: 'mcq',
        },
        {
          id: 2,
          text: 'Solve for y: 2y - 8 = 10',
          options: [
            { id: 'a', text: '9' },
            { id: 'b', text: '5' },
            { id: 'c', text: '11' },
            { id: 'd', text: '8' },
          ],
          correctAnswer: 'a',
          type: 'mcq',
        },
        {
          id: 3,
          text: 'If a rectangle has a length of 12 units and a width of 5 units, what is its area?',
          options: [],
          correctAnswer: '60',
          type: 'fill-in-blank',
        },
      ],
      timeLimit: 10, // 5 minutes
    };

    // Generate the steps model for p-steps
    this.generateStepsModel();

    if (this.quiz.timeLimit > 0) {
      this.remainingTime = this.quiz.timeLimit;
      this.startTimer();
    }
  }

  generateStepsModel(): void {
    if (this.quiz) {
      this.stepsModel = this.quiz.questions.map((q, i) => ({
        label: 'Q' + (i + 1),
      }));
    }
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.submitQuiz();
      }
    });
  }

  get currentQuestion(): Question | null {
    return this.quiz && this.quiz.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    return this.quiz ? ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100 : 0;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  saveAnswer(value: string): void {
    if (this.currentQuestion) {
      this.userAnswers[this.currentQuestion.id] = value;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.quiz && this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  submitQuiz(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.quizSubmitted = true;

    // In a real app, send answers to the backend and navigate to results page
    console.log('Quiz submitted', this.userAnswers);
    // this.router.navigate(['/quiz-result']);
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
