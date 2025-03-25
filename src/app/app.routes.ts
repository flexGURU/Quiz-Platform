import { Routes } from '@angular/router';
import { DashboardComponent } from './student/components/dashboard/dashboard.component';
import { QuizHomeComponent } from './student/components/quiz/quiz-home/quiz-home.component';
import { QuizTestComponent } from './student/components/quiz/quiz-test/quiz-test.component';
import { QuizResultComponent } from './student/components/quiz/quiz-result/quiz-result.component';
import { LeaderboardComponent } from './student/components/leaderboard/leaderboard.component';
import { AchievementsComponent } from './student/components/achievements/achievements.component';
import { ForumComponent } from './student/components/forum/forum.component';
import { ThreadsComponent } from './student/components/threads/threads.component';
import { ReportComponent } from './student/components/report/report.component';
import { QuestionBankComponent } from './teacher/components/question-bank/question-bank.component';
import { PointRulesComponent } from './teacher/components/point-rules/point-rules.component';
import { StudentPerformanceComponent } from './teacher/components/student-performance/student-performance.component';
import { OperationsComponent } from './admin/components/operations/operations.component';
import { ViolationsComponent } from './admin/components/violations/violations.component';

export const routes: Routes = [
  {
    path: 'students',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'quiz-home', component: QuizHomeComponent },
      { path: 'quiz-test', component: QuizTestComponent },
      { path: 'quiz-result', component: QuizResultComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'achievements', component: AchievementsComponent },
      { path: 'forums', component: ForumComponent },
      { path: 'threads', component: ThreadsComponent },
      { path: 'reports', component: ReportComponent },
    ],
  },

  {
    path: 'teacher',
    children: [
      { path: 'question-bank', component: QuestionBankComponent },
      { path: 'point-rule', component: PointRulesComponent },
      { path: 'student-performance', component: StudentPerformanceComponent },
    ],
  },

  {
    path: 'admin',
    children: [
      { path: 'operations', component: OperationsComponent },
      { path: 'violations', component: ViolationsComponent },

    ],
  },


  { path: '', redirectTo: '/students/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/students/dashboard' },
];
