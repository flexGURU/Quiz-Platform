import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuizHomeComponent } from './components/quiz/quiz-home/quiz-home.component';
import { QuizTestComponent } from './components/quiz/quiz-test/quiz-test.component';
import { QuizResultComponent } from './components/quiz/quiz-result/quiz-result.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'quiz-home', component: QuizHomeComponent },
  { path: 'quiz-test', component: QuizTestComponent },
  { path: 'quiz-result', component: QuizResultComponent },
];
