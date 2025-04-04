import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './student/components/nav/nav.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lms';
  constructor(private router: Router) {}

  isLoginPage = (): boolean => {
    return this.router.url === '/login';
  };
}
