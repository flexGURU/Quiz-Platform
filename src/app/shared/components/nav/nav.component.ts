import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [MenubarModule, CommonModule, ButtonModule],
})
export class NavComponent {
  authService = inject(AuthService);
  userName$: Observable<User | null> = this.authService.currentUser$;

  logout = () => {
    this.authService.signOut().subscribe((res) => {
      localStorage.clear();
    });
  };
}
