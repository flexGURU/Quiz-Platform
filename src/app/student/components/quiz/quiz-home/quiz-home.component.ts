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
import { Quiz } from '../../../../shared/models';


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
  #router = inject(Router)
  viewMode: 'listbox' | 'cards' = 'listbox'; // Default to cards view

  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];

  categories: string[] = [
    'All',
    'Math',
    'Science',
    'History',
    'Literature',
    'Geography',
  ];
  selectedCategory: string = 'All';

  difficulties: string[] = ['All', 'Easy', 'Medium', 'Hard'];
  selectedDifficulty: string = 'All';

  showTimeLimitOnly: boolean = false;

  stats = {
    quizzesCompleted: 32,
    averageScore: 78.4,
    ranking: 'Gold Tier (Top 15%)',
  };


  ngOnInit(): void {
    // Mock data - in real application this would come from a service
    this.quizzes = quiz

    this.filterQuizzes();
  }

  filterQuizzes(): void {
    this.filteredQuizzes = this.quizzes.filter((quiz) => {
      // Filter by category
      if (
        this.selectedCategory !== 'All' &&
        quiz.category !== this.selectedCategory
      ) {
        return false;
      }

      // Filter by difficulty
      if (
        this.selectedDifficulty !== 'All' &&
        quiz.difficulty !== this.selectedDifficulty
      ) {
        return false;
      }

      // Filter by time limit
      if (this.showTimeLimitOnly && !quiz.hasTimeLimit) {
        return false;
      }

      return true;
    });
  }

  getRecommendedQuizzes(): Quiz[] {
    console.log(
      'Recommended Quizzes:',
      this.filteredQuizzes.filter((quiz) => quiz.recommended)
    );
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

  startQuiz(quizId: number): void {
    console.log(`Starting quiz with ID: ${quizId}`);
    // In a real application, navigate to the quiz page with the selected quiz ID
    this.#router.navigate(['/students/quiz-test'], { queryParams: { id: quizId } });
  }
}
