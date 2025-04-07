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
  items = [
    {
      label: 'Question Bank',
      routerLink: '/teacher/question-bank'   
    },
    {
      label: 'Student Performance',
      routerLink: '/teacher/student-performance'  
    },
  ];
}
