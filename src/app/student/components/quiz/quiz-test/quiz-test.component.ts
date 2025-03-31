import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
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
import {
  QuestionResult,
  QuizResult,
  SampleQuiz,
  SampleQuizQuestion,
} from '../../../../shared/models';

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
  currentQuestionIndex: number = 0;
  userAnswers = signal<{ [questionId: string]: string }>({});
  remainingTime: number = 0;
  timerSubscription?: Subscription;
  quizSubmitted: boolean = false;
  stepsModel: any = [];
  quizIDParam!: string;
  quizTitleParam!: string;
  sampleQuiz!: SampleQuiz;
  quizResult!: QuizResult;

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
      this.userAnswers.update((answers) => ({
        ...answers,
        [this.currentQuestion.id]: value,
      }));
    }
  }

  saveAnsEffect = effect(() => {
    console.log('selected questions', this.userAnswers());
  });

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
    this.quizResult = this.gradeQuiz();
    console.log("results of the quiz:",this.quizResult);
    
    this.saveQuizResults(this.quizResult);

    console.log('Quiz submitted', this.userAnswers);
    // this.router.navigate(['/quiz-result']);
  }

  saveQuizResults(result: QuizResult): void {
    this.supabaseClient.saveQuizResult(result).subscribe({
        next: (resp) => {
            console.log("response from obs", resp);
        },
        error: (err) => {
            console.error("Error saving quiz results", err);
        }
    });
}

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  gradeQuiz(): QuizResult {
    const questionResults: QuestionResult[] = [];
    let correctCount = 0;
    let wrongCount = 0;
    console.log("sssss", this.sampleQuiz);
    

    // Process each question
    this.sampleQuiz.questions.forEach((question) => {
      const userAnswer = this.userAnswers()[question.id] || '';
      const isCorrect = userAnswer === question.correct_answer;

      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      questionResults.push({
        question_id: question.id,
        question_text: question.question_text,
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
      });
    });

    const totalQuestions = this.sampleQuiz.questions.length;
    const scorePercentage =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    // Get current user ID - in a real app, you would get this from your auth service
    const userId = 1; // Replace with actual user ID

    return {
      user_id: userId,
      quiz_id: this.sampleQuiz.id,
      quiz_title: this.sampleQuiz.title,
      total_questions: totalQuestions,
      correct_answers: correctCount,
      wrong_answers: wrongCount,
      score_percentage: scorePercentage,
      question_results: questionResults,
      completed_at: new Date().toISOString(),
    };
  }
}
