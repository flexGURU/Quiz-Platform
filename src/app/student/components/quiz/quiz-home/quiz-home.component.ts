import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { quiz } from '../../../services/quiz';
import { Quiz, QuizDB } from '../../../../shared/models';
import { QuizService } from '../../../services/quiz.service';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-quiz-home',
  imports: [
    DropdownModule,
    CommonModule,
    DataViewModule,
    ButtonModule,
    CardModule,
    FormsModule,
    CheckboxModule,
    ListboxModule,
    SkeletonModule,
  ],
  templateUrl: './quiz-home.component.html',
  styleUrl: './quiz-home.component.css',
})
export class QuizHomeComponent {
  private router = inject(Router);
  private quizService = inject(QuizService);
  private authService = inject(AuthService);

  viewMode: 'listbox' | 'cards' = 'listbox'; // Default to cards view
  subjectList: QuizDB[] = [];
  selectedCategory = [];
  filteredQuizzes: Quiz[] = [];

  userID!: string;

  difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  selectedDifficulty: string = 'All';

  showTimeLimitOnly: boolean = false;
  loading: boolean = true;

  stats = {
    quizzesCompleted: 32,
    averageScore: 78.4,
    ranking: 'Gold Tier (Top 15%)',
  };

  ngOnInit(): void {
    this.userID = this.authService.userId;

    this.filterQuizzes();
    this.loadQuizzes();
    this.upcomingQuizzes();
  }

  loadQuizzes = () => {
    this.loading = true;
    this.quizService.getQuizzes().subscribe((reponse) => {
      console.log('quizzes', reponse);

      this.loading = false;
    });
  };

  filterQuizzes(): void {}

  getRecommendedQuizzes(): Quiz[] {
    return this.filteredQuizzes.filter((quiz) => quiz.recommended);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  startQuiz(quizId: string | undefined, quizTitle: string): void {
    console.log(`Starting quiz with ID: ${quizId}`);
    // In a real application, navigate to the quiz page with the selected quiz ID
    this.router.navigate(['/students/quiz-test'], {
      queryParams: {
        quiz_id: quizId,
        quiz_title: quizTitle,
      },
    });
  }

  upcomingQuizzes = () => {
    this.quizService.getUpcomingQuizzes(this.userID).subscribe((response) => {
      console.log('upcomi quizzes', response);
      this.subjectList = response;
    });
  };
}
