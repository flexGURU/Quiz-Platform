import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../shared/services/auth.service';
import { LeaderboardService } from '../../services/leaderboard.service';
import { LeaderboardEntry } from '../../../shared/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    CardModule,
    TableModule,
    
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css',
})
export class LeaderboardComponent {
  leaderboard: LeaderboardEntry[] = [];
  currentUserRank: LeaderboardEntry | null = null;
  loading: boolean = true;
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(
    private leaderboardService: LeaderboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLeaderboard();
    this.getCurrentUserRank();
  }

  loadLeaderboard(page: number = 0): void {
    this.loading = true;
    this.currentPage = page;

    this.leaderboardService
      .getLeaderboard(this.pageSize, page * this.pageSize)
      .subscribe({
        next: (data) => {
          this.leaderboard = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load leaderboard:', error);
          this.loading = false;
        },
      });
  }

  getCurrentUserRank(): void {
    const currentUserId = this.authService.userId;
    if (currentUserId) {
      this.leaderboardService.getCurrentUserRank(currentUserId).subscribe({
        next: (data) => {
          this.currentUserRank = data;
        },
        error: (error) => {
          console.error('Failed to load user rank:', error);
        },
      });
    }
  }

  nextPage(): void {
    this.loadLeaderboard(this.currentPage + 1);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadLeaderboard(this.currentPage - 1);
    }
  }
}
