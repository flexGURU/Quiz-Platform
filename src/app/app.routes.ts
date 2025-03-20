import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuizHomeComponent } from './components/quiz/quiz-home/quiz-home.component';
import { QuizTestComponent } from './components/quiz/quiz-test/quiz-test.component';
import { QuizResultComponent } from './components/quiz/quiz-result/quiz-result.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { ForumComponent } from './components/forum/forum.component';
import { ThreadsComponent } from './components/threads/threads.component';
import { ReportComponent } from './components/report/report.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'quiz-home', component: QuizHomeComponent },
  { path: 'quiz-test', component: QuizTestComponent },
  { path: 'quiz-result', component: QuizResultComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'achievements', component: AchievementsComponent },
  { path: 'forums', component: ForumComponent },
  { path: 'threads', component: ThreadsComponent },
  { path: 'reports', component: ReportComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
