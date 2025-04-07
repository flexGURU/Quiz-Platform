import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css',
})
export class MenubarComponent {
  baseUrl = '/teacher/';
  items = [
    {
      label: 'Question Bank',
      routerLink: `${this.baseUrl}` + 'question-bank',
      styleClass: 'menu-link',
    },
    {
      label: 'Student Performance',
      styleClass: 'menu-link',
      routerLink: `${this.baseUrl}` + 'student-performance',
    }, {
      label: 'Manage Quizzes',
      styleClass: 'menu-link',
      routerLink: `${this.baseUrl}` + 'manage-quizzes',
    },
  ];
}
