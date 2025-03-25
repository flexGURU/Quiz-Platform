import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  requiredPoints?: number;
}

@Component({
  selector: 'app-achievements',
  imports: [
    CardModule,
    ProgressBarModule,
    CommonModule,
    DropdownModule,
    CheckboxModule,FormsModule,
  ],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.css',
})
export class AchievementsComponent {
  badges: Badge[] = [];
  filteredBadges: Badge[] = [];
  totalEarnedBadges: number = 0;

  categories: string[] = [
    'All',
    'Subject Mastery',
    'Milestones',
    'Special Achievements',
  ];
  selectedCategory: string = 'All';

  showEarnedOnly: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Mock data - in a real app, this would come from a service
    this.badges = [
      {
        id: 'math-novice',
        name: 'Math Novice',
        description: 'Complete 5 math quizzes',
        iconUrl: 'assets/badges/math-novice.png',
        category: 'Subject Mastery',
        earned: true,
        earnedDate: new Date(2024, 2, 15),
      },
      {
        id: 'math-expert',
        name: 'Math Expert',
        description: 'Complete 20 math quizzes with at least 80% score',
        iconUrl: 'assets/badges/math-expert.png',
        category: 'Subject Mastery',
        earned: false,
        progress: 15,
        requiredPoints: 20,
      },
      {
        id: 'science-enthusiast',
        name: 'Science Enthusiast',
        description: 'Complete 10 science quizzes',
        iconUrl: 'assets/badges/science-enthusiast.png',
        category: 'Subject Mastery',
        earned: true,
        earnedDate: new Date(2024, 1, 20),
      },
      {
        id: 'history-buff',
        name: 'History Buff',
        description: 'Score 90% or higher on 5 history quizzes',
        iconUrl: 'assets/badges/history-buff.png',
        category: 'Subject Mastery',
        earned: false,
        progress: 3,
        requiredPoints: 5,
      },
      {
        id: 'quiz-champion',
        name: 'Quiz Champion',
        description: 'Earn the top score on any quiz',
        iconUrl: 'assets/badges/quiz-champion.png',
        category: 'Special Achievements',
        earned: true,
        earnedDate: new Date(2024, 0, 10),
      },
      {
        id: 'perfect-score',
        name: 'Perfect Score',
        description: 'Score 100% on any quiz',
        iconUrl: 'assets/badges/perfect-score.png',
        category: 'Special Achievements',
        earned: true,
        earnedDate: new Date(2024, 2, 5),
      },
      {
        id: 'milestone-10',
        name: 'First Milestone',
        description: 'Complete 10 quizzes',
        iconUrl: 'assets/badges/milestone-10.png',
        category: 'Milestones',
        earned: true,
        earnedDate: new Date(2024, 0, 25),
      },
      {
        id: 'milestone-50',
        name: 'Half Century',
        description: 'Complete 50 quizzes',
        iconUrl: 'assets/badges/milestone-50.png',
        category: 'Milestones',
        earned: false,
        progress: 32,
        requiredPoints: 50,
      },
      {
        id: 'streak-7',
        name: 'Weekly Streak',
        description:
          'Complete at least one quiz every day for 7 consecutive days',
        iconUrl: 'assets/badges/streak-7.png',
        category: 'Special Achievements',
        earned: false,
        progress: 4,
        requiredPoints: 7,
      },
      {
        id: 'quick-solver',
        name: 'Quick Solver',
        description: 'Complete a timed quiz in half the allotted time',
        iconUrl: 'assets/badges/quick-solver.png',
        category: 'Special Achievements',
        earned: true,
        earnedDate: new Date(2024, 1, 8),
      },
    ];

    this.totalEarnedBadges = this.badges.filter((badge) => badge.earned).length;
    this.filterBadges();
  }

  filterBadges(): void {
    this.filteredBadges = this.badges.filter((badge) => {
      // Filter by category
      if (
        this.selectedCategory !== 'All' &&
        badge.category !== this.selectedCategory
      ) {
        return false;
      }

      // Filter by earned status
      if (this.showEarnedOnly && !badge.earned) {
        return false;
      }

      return true;
    });
  }

  getProgressPercentage(badge: Badge): number {
    if (badge.earned) return 100;
    if (badge.progress && badge.requiredPoints) {
      return (badge.progress / badge.requiredPoints) * 100;
    }
    return 0;
  }

  getNextBadgeToEarn(): Badge | null {
    const inProgressBadges = this.badges
      .filter(
        (badge) => !badge.earned && badge.progress && badge.requiredPoints
      )
      .sort((a, b) => {
        const progressA = a.progress! / a.requiredPoints!;
        const progressB = b.progress! / b.requiredPoints!;
        return progressB - progressA;
      });

    return inProgressBadges.length > 0 ? inProgressBadges[0] : null;
  }
}
