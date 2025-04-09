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
import { SkeletonModule } from 'primeng/skeleton';
import { ForumService } from '../../services/forum.service';
import { response } from 'express';

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
    SkeletonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private quizService = inject(QuizService);
  private authService = inject(AuthService);
  private forumService = inject(ForumService);
  quizzList: QuizDB[] = [];
  totalQuizzNumber: number = 0;
  completedQuizNumber!: number;
  userID!: string;
  loading: boolean = true;
  progress!: number;
  recentQuizzes: any[] = [];
  forumCount!: number;

  ngOnInit(): void {
    this.getQuizzes();
    this.authService.currentUser$.subscribe((response) => {
      console.log('current user', response);
    });

    this.forumService.forumCount$.subscribe((response) => {
      console.log("hhh",response);
      
      if (response) {
        this.forumCount = response;
      }
    });

    this.userID = this.authService.userId;
    this.recentQuizzesCount();

    this.completedQuizzesCount();
    this.recentQuizzesapi();
  }

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
    this.loading = true;

    this.quizService.getQuizzes().subscribe((response) => {
      this.quizzList = response;
      this.totalQuizzNumber = this.quizzList.length;
      this.loading = false;
      this.updateProgress();
    });
  };

  recentQuizzesapi = () => {
    this.quizService.getRecentQuizzes(this.userID).subscribe((response) => {
      console.log('which quizzes', response);

      const quizr = response.map((quiz) => ({
        name: quiz.name,
        score: quiz.score,
        date: quiz.date,
      }));

      this.recentQuizzes = quizr;
    });
  };

  recentQuizzesCount = () => {
    this.quizService
      .getUpcomingQuizzesCount(this.userID)
      .subscribe((response) => {
        console.log('rcent quizzes', response);
      });
  };

  completedQuizzesCount = () => {
    this.quizService
      .getCompletedQuizzesCount(this.userID)
      .subscribe((response) => {
        console.log('comploted quizzes', response);
        this.completedQuizNumber = response;
        this.updateProgress();
      });
  };

  updateProgress() {
    if (this.totalQuizzNumber && this.completedQuizNumber !== undefined) {
      const percentage =
        (this.completedQuizNumber * 100) / this.totalQuizzNumber;
      this.progress = Math.round(percentage);
    }
  }
}
