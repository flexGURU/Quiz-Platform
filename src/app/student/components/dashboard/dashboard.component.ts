import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { LeaderboardEntry, QuizDB } from '../../../shared/models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../../shared/services/auth.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ForumService } from '../../services/forum.service';
import { LeaderboardService } from '../../services/leaderboard.service';
import { NotificationService } from '../../../shared/services/notification.service';

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points_threshold: number;
}
const STATIC_BADGES: Badge[] = [
  {
    id: 'explorer',
    name: 'Knowledge Explorer',
    description: 'Mastered 50 points in easy quizzes - Solid fundamentals!',
    image_url: '/badges/explorer.png',
    points_threshold: 300,
  },
  {
    id: 'challenger',
    name: 'Skilled Challenger',
    description:
      'Earned 150 points in medium quizzes - Tackling complex problems!',
    image_url: '/badges/challenger.png',
    points_threshold: 500,
  },
  {
    id: 'mastermind',
    name: 'Expert Mastermind',
    description: 'Achieved 200 points in hard quizzes - Top-tier performance!',
    image_url: '/badges/mastermind.png',
    points_threshold: 1000,
  },
];

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
  private leaderboardService = inject(LeaderboardService);
  private notificaionService = inject(NotificationService);

  quizzList: QuizDB[] = [];
  totalQuizzNumber: number = 0;
  completedQuizNumber!: number;
  userID!: string;
  loading: boolean = true;
  progress!: number;
  recentQuizzes: any[] = [];
  forumCount!: number;
  currentUserRank: LeaderboardEntry | null = null;
  badges: Badge[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getCurrentUserRank();
    this.getQuizzes();
    this.authService.currentUser$.subscribe((response) => {});

    this.forumService.forumCount$.subscribe((response) => {
      if (response) {
        this.forumCount = response;
      }
    });

    this.userID = this.authService.userId;
    this.recentQuizzesCount();

    this.completedQuizzesCount();
    this.recentQuizzesapi();
    if (this.currentUserRank?.total_points) {
      this.getAwardedBadges(this.currentUserRank?.total_points);
    }
  }

  getAwardedBadges(points: number): Badge[] {
    return STATIC_BADGES.filter((badge) => points >= badge.points_threshold);
  }

  getCurrentUserRank(): void {
    const currentUserId = this.authService.userId;
    if (currentUserId) {
      this.leaderboardService.getCurrentUserRank(currentUserId).subscribe({
        next: (data) => {
          this.currentUserRank = data;
          if (this.currentUserRank && this.currentUserRank.total_points) {
            this.badges = this.getAwardedBadges(
              this.currentUserRank.total_points
            );
          }
        },
        error: (error) => {
          this.notificaionService.showError(
            'failed to get Leaderboar stats',
            'failure'
          );
        },
      });
    }
  }
  // Simulated achievements and badges

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
      const quizr = response.map((quiz) => ({
        quizId: quiz.quiz_id,
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
      .subscribe((response) => {});
  };

  completedQuizzesCount = () => {
    this.quizService
      .getCompletedQuizzesCount(this.userID)
      .subscribe((response) => {
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

  showQuizResult(quizId: string) {
    this.router.navigate(['/students/quiz-result'], {
      queryParams: {
        id: quizId,
      },
    });
  }
}
