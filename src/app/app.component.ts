import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './shared/services/auth.service';
import { User } from '@supabase/supabase-js';
import { MenubarComponent } from './teacher/components/menubar/menubar.component';
import { AdminMenubarComponent } from './admin/components/admin-menubar/admin-menubar.component';

@Component({
  selector: 'app-root',
  imports: [
    NavComponent,
    RouterOutlet,
    ToastModule,
    MenubarComponent,
    AdminMenubarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lms';
  loadSpinner = false;
  userRole: boolean = false;
  reloaded: boolean = false;
  adminRole!: string;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.userRole$.subscribe((response) => {
      if (response && response === 'teacher') {
        this.userRole = true;
      }
      this.reloaded = true;
      if (response === 'admin') {
        this.adminRole = response;
      }
    });
  }

  isLoginPage = (): boolean => {
    return this.router.url === '/login';
  };
}
