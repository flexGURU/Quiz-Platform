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
import { UUID } from 'crypto';

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
  ],
  templateUrl: './quiz-home.component.html',
  styleUrl: './quiz-home.component.css',
})
export class QuizHomeComponent {
  private router = inject(Router);
  private supabaseService = inject(QuizService);

  viewMode: 'listbox' | 'cards' = 'listbox'; // Default to cards view
  subjectList: QuizDB[] = [];
  selectedCategory = [];
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];

  difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  selectedDifficulty: string = 'All';

  showTimeLimitOnly: boolean = false;

  stats = {
    quizzesCompleted: 32,
    averageScore: 78.4,
    ranking: 'Gold Tier (Top 15%)',
  };

  ngOnInit(): void {
    // Mock data - in real application this would come from a service
    this.quizzes = quiz;

    this.filterQuizzes();
    this.loadQuizzes();
  }

  loadQuizzes = () => {
    this.supabaseService.getQuizzes().subscribe((reponse) => {
      console.log('quizzes', reponse);

      this.subjectList = reponse;
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
}
