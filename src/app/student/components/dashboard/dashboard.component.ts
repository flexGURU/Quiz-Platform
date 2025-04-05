import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { QuizDB } from '../../../shared/models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CardModule,
    ListboxModule,
    CommonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private quizService = inject(QuizService);
  private authService = inject(AuthService);
  quizzList: QuizDB[] = [];
  quizzNumber: number = 0;
  userID!: string;

  ngOnInit(): void {
    this.getQuizzes();
    this.authService.currentUser$.subscribe((response) => {
      console.log('current user', response);
    });
    this.userID = this.authService.userId;
    this.recentQuizzesCount()
    this.completedQuizzesCount()
  }
  recentQuizzes = [
    { name: 'Math Quiz 1', score: 85, date: 'March 12, 2025' },
    { name: 'Science Quiz 2', score: 92, date: 'March 10, 2025' },
    { name: 'History Quiz 3', score: 78, date: 'March 8, 2025' },
  ];

  // Simulated achievements and badges
  badges = [
    {
      name: 'Quiz Master',
      description: 'Scored 90+ on 3 quizzes',
      icon: 'pi pi-sign-out',
      category: 'me',
      date: 'today',
      earned: 'success',
    },
    {
      name: 'Speedster',
      description: 'Completed a quiz in under 2 minutes',
      icon: 'pi pi-sign-out',
      category: 'me',
      date: 'today',
      earned: 'success',
    },
    {
      name: 'Consistency King',
      description: 'Completed 5 quizzes in a row',
      icon: 'pi pi-sign-out',
      category: 'me',
      date: 'today',
      earned: 'success',
    },
  ];

  getQuizzes = () => {
    this.quizService.getQuizzes().subscribe((response) => {
      this.quizzList = response;
      this.quizzNumber = this.quizzList.length;
    });
  };

  upcomingQuizzes = () => {
    this.quizService.getUpcomingQuizzes(this.userID).subscribe((response) => {
      console.log('upcomi quizzes', response);
    });
  };

  recentQuizzesapi = () => {
    this.quizService.getRecentQuizzes(this.userID).subscribe((response) => {
      console.log('rcent quizzes', response);
    });
  };

  recentQuizzesCount = () => {
    this.quizService.getUpcomingQuizzesCount(this.userID).subscribe((response) => {
      console.log('rcent quizzes', response);
    });
  };

  completedQuizzesCount = () => {
    this.quizService.getCompletedQuizzesCount(this.userID).subscribe((response) => {
      console.log('comploted quizzes', response);
    });
  };
}
