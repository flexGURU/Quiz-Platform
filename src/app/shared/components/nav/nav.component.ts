import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [MenubarModule, CommonModule, ButtonModule, RouterLink],
})
export class NavComponent {
  userName$: Observable<User | null> = this.authService.currentUser$;
  userRole!: string;
  reloaded: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.userRole$.subscribe((response) => {
      if (response || response === 'student') {
        this.userRole = response;
      }

      this.reloaded = true;
    });
  }

  logout = () => {
    this.authService.signOut().subscribe((res) => {
      localStorage.clear();
    });
  };
}
