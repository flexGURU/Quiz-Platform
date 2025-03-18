import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, ListboxModule, CommonModule, TableModule, IconFieldModule, InputIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
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
    },
    {
      name: 'Speedster',
      description: 'Completed a quiz in under 2 minutes',
      icon: 'pi pi-sign-out',
    },
    {
      name: 'Consistency King',
      description: 'Completed 5 quizzes in a row',
      icon: 'pi pi-sign-out',
    },
  ];

  // Simulated recommended quizzes
  recommendedQuizzes = [
    { name: 'Algebra Challenge', subject: 'Mathematics', difficulty: 'Medium' },
    { name: 'Physics Fundamentals', subject: 'Science', difficulty: 'Hard' },
    { name: 'World History Quiz', subject: 'History', difficulty: 'Easy' },
  ];
}
