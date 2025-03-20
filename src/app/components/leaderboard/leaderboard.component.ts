import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

interface LeaderboardEntry {
  rank: number;
  studentName: string;
  avatarUrl: string;
  totalPoints: number;
  quizzesCompleted: number;
  badges: string[];
  isCurrentUser: boolean;
}

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
  leaderboardEntries: LeaderboardEntry[] = [];
  filteredEntries: LeaderboardEntry[] = [];

  timeFilters: string[] = ['Daily', 'Weekly', 'Monthly', 'All-time'];
  selectedTimeFilter: string = 'All-time';

  subjectFilters: string[] = [
    'All Subjects',
    'Math',
    'Science',
    'History',
    'Literature',
    'Geography',
  ];
  selectedSubjectFilter: string = 'All Subjects';

  currentUserRank: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Mock data - in a real app, this would come from a service
    this.leaderboardEntries = [
      {
        rank: 1,
        studentName: 'Emma Johnson',
        avatarUrl: 'assets/avatars/avatar1.png',
        totalPoints: 5280,
        quizzesCompleted: 42,
        badges: ['Math Master', 'Science Pro', 'History Buff'],
        isCurrentUser: false,
      },
      {
        rank: 2,
        studentName: 'Noah Williams',
        avatarUrl: 'assets/avatars/avatar2.png',
        totalPoints: 4970,
        quizzesCompleted: 38,
        badges: ['Quiz Champion', 'Perfect Score'],
        isCurrentUser: false,
      },
      {
        rank: 3,
        studentName: 'Olivia Smith',
        avatarUrl: 'assets/avatars/avatar3.png',
        totalPoints: 4750,
        quizzesCompleted: 36,
        badges: ['Quick Solver', 'Knowledge Seeker'],
        isCurrentUser: true,
      },
      {
        rank: 4,
        studentName: 'Liam Brown',
        avatarUrl: 'assets/avatars/avatar4.png',
        totalPoints: 4320,
        quizzesCompleted: 35,
        badges: ['Consistent Learner'],
        isCurrentUser: false,
      },
      {
        rank: 5,
        studentName: 'Ava Jones',
        avatarUrl: 'assets/avatars/avatar5.png',
        totalPoints: 4150,
        quizzesCompleted: 33,
        badges: ['Rising Star'],
        isCurrentUser: false,
      },
      {
        rank: 6,
        studentName: 'Ethan Davis',
        avatarUrl: 'assets/avatars/avatar6.png',
        totalPoints: 3980,
        quizzesCompleted: 31,
        badges: ['Dedicated Student'],
        isCurrentUser: false,
      },
      {
        rank: 7,
        studentName: 'Sophia Miller',
        avatarUrl: 'assets/avatars/avatar7.png',
        totalPoints: 3850,
        quizzesCompleted: 30,
        badges: ['Fast Learner'],
        isCurrentUser: false,
      },
      {
        rank: 8,
        studentName: 'Mason Wilson',
        avatarUrl: 'assets/avatars/avatar8.png',
        totalPoints: 3720,
        quizzesCompleted: 29,
        badges: ['Trivia Expert'],
        isCurrentUser: false,
      },
      {
        rank: 9,
        studentName: 'Isabella Moore',
        avatarUrl: 'assets/avatars/avatar9.png',
        totalPoints: 3590,
        quizzesCompleted: 28,
        badges: ['Quiz Enthusiast'],
        isCurrentUser: false,
      },
      {
        rank: 10,
        studentName: 'Lucas Taylor',
        avatarUrl: 'assets/avatars/avatar10.png',
        totalPoints: 3480,
        quizzesCompleted: 27,
        badges: ['Knowledge Explorer'],
        isCurrentUser: false,
      },
    ];

    // Find current user's rank
    const currentUser = this.leaderboardEntries.find(
      (entry) => entry.isCurrentUser
    );
    if (currentUser) {
      this.currentUserRank = currentUser.rank;
    }

    this.filterLeaderboard();
  }

  filterLeaderboard(): void {
    // In a real app, this would call a service with the selected filters
    // For this example, we'll just use the mock data
    this.filteredEntries = [...this.leaderboardEntries];
  }

  getBadgeClass(rank: number): string {
    if (rank === 1) return 'bg-yellow-500'; // Gold
    if (rank === 2) return 'bg-gray-400'; // Silver
    if (rank === 3) return 'bg-amber-700'; // Bronze
    return 'bg-blue-500'; // Default
  }

  challengeFriend(studentName: string): void {
    console.log(`Challenging ${studentName} to a quiz duel!`);
    // In a real app, this would open a dialog to select a quiz and send a challenge
  }
}
