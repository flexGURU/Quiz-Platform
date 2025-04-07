import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './shared/services/auth.service';
import { User } from '@supabase/supabase-js';
import { MenubarComponent } from './teacher/components/menubar/menubar.component';

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet, ToastModule, MenubarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lms';
  loadSpinner = false;
  userRole: boolean = false;
  reloaded: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.userRole$.subscribe((response) => {
      console.log('role', response);
      if (response && response === 'teacher') {
        this.userRole = true;
      }
      this.reloaded = true;
    });
  }

  isLoginPage = (): boolean => {
    return this.router.url === '/login';
  };
}
