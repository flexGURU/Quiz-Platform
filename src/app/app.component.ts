import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet, ToastModule, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lms';
  loadSpinner = false;

  constructor(private router: Router) {}

  isLoginPage = (): boolean => {
    return this.router.url === '/login';
  };
}
