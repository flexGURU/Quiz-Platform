import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { QuizService } from '../../../services/quiz.service';
import { SampleQuiz, SampleQuizQuestion } from '../../../../shared/models';

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
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    RadioButtonModule,
    FormsModule,
    CardModule,
    StepsModule,
    DialogModule,
    ProgressBarModule,
  ],
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
  stepsModel: any = [];
  quizIDParam!: string;
  quizTitleParam!: string;
  sampleQuiz!: SampleQuiz;

  constructor(private route: ActivatedRoute, private router: Router) {}
  private supabaseClient = inject(QuizService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.quizIDParam = value['quiz_id'];
    });
    this.route.queryParams.subscribe((value) => {
      this.quizTitleParam = value['quiz_title'];
    });
    this.loadSampleQuiz(this.quizIDParam);
  }

  loadSampleQuiz = (quizID: string): void => {
    this.supabaseClient.getQuizQuestions(quizID).subscribe((response) => {
      console.log('questions', response);
      this.sampleQuiz = {
        id: this.quizIDParam,
        title: this.quizTitleParam,
        questions: response,
        timeLimit: 20044,
      };
      this.generateStepsModel();
      if (this.sampleQuiz.timeLimit > 0) {
        this.remainingTime = this.sampleQuiz.timeLimit;
        this.startTimer();
      }
    });
  };

  // loadQuiz(quizId: number): void {
  //   // Mock data - in a real app, this would come from a service
  //   this.quiz = {
  //     id: quizId,
  //     title: 'Basic Algebra Quiz',
  //     questions: [
  //       {
  //         id: 1,
  //         text: 'What is the value of x in the equation 3x + 5 = 14?',
  //         options: [
  //           { id: 'a', text: '2' },
  //           { id: 'b', text: '3' },
  //           { id: 'c', text: '4' },
  //           { id: 'd', text: '5' },
  //         ],
  //         correctAnswer: 'b',
  //         type: 'mcq',
  //       },
  //       {
  //         id: 2,
  //         text: 'Solve for y: 2y - 8 = 10',
  //         options: [
  //           { id: 'a', text: '9' },
  //           { id: 'b', text: '5' },
  //           { id: 'c', text: '11' },
  //           { id: 'd', text: '8' },
  //         ],
  //         correctAnswer: 'a',
  //         type: 'mcq',
  //       },
  //       {
  //         id: 3,
  //         text: 'If a rectangle has a length of 12 units and a width of 5 units, what is its area?',
  //         options: [],
  //         correctAnswer: '60',
  //         type: 'fill-in-blank',
  //       },
  //     ],
  //     timeLimit: 10777777, // 5 minutes
  //   };

  //   // Generate the steps model for p-steps
  // }

  generateStepsModel(): void {
    if (this.sampleQuiz) {
      this.stepsModel = this.sampleQuiz.questions.map((q, i) => ({
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

  get currentQuestion(): SampleQuizQuestion {
    return (
      this.sampleQuiz && this.sampleQuiz.questions[this.currentQuestionIndex]
    );
  }

  get progress(): number {
    return this.sampleQuiz
      ? ((this.currentQuestionIndex + 1) / this.sampleQuiz.questions.length) *
          100
      : 0;
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
    if (
      this.sampleQuiz &&
      this.currentQuestionIndex < this.sampleQuiz.questions.length - 1
    ) {
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
