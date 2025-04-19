import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './shared/services/auth.service';
import { User } from '@supabase/supabase-js';
import { MenubarComponent } from './teacher/components/menubar/menubar.component';
import { AdminMenubarComponent } from './admin/components/admin-menubar/admin-menubar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    NavComponent,
    RouterOutlet,
    ToastModule,
    MenubarComponent,
    AdminMenubarComponent, CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lms';
  loadSpinner = false;
  teacherRole!: string;
  reloaded: boolean = false;
  adminRole!: string;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.userRole$.subscribe((role) => {
      this.reloaded = true;
    
      // Reset both roles first
      this.teacherRole = '';
      this.adminRole = '';
    
      // Then re-assign if a valid role is received
      if (role === 'teacher') {
        this.teacherRole = 'teacher';
      } else if (role === 'admin') {
        this.adminRole = 'admin';
      }
    });
    
  }

  isLoginPage = (): boolean => {
    return this.router.url === '/login';
  };
}
