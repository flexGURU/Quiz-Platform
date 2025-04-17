import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { ToastModule } from 'primeng/toast';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

interface LoginOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-login',
  imports: [
    SelectButtonModule,
    FormsModule,
    CommonModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    ToastModule,
    SpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginMode: string = 'login';
  isLoginMode: boolean = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  authService = inject(AuthService);

  loginOptions: LoginOption[] = [
    { label: 'Login', value: 'login' },
    { label: 'Register', value: 'register' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private notification: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['stud@student.com', [Validators.required, Validators.email]],
      password: ['qwerty', Validators.required],
      rememberMe: [false],
    });

    this.registerForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        agreeTerms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {}

  toggleMode() {
    this.isLoginMode = this.loginMode === 'login';
    this.errorMessage = '';
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onLogin() {
    this.isLoading = true;
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.user) {
          this.notification.showSuccess('Success', 'Logged In ');

          if (this.authService.hasRole('admin')) {
            this.router.navigate(['/admin/operations']);
          } else if (this.authService.hasRole('teacher')) {
            this.router.navigate(['/teacher/question-bank']);
          } else {
            this.router.navigate(['/students/dashboard']);
          }
        } else {
          this.isLoading = false;

          this.notification.showError('Error', `${response.error?.message}`);
        }
      },
      error: (error) => {
        this.isLoading = false;

        console.error('error logging in', error.message);
        this.notification.showError(
          'Error',
          'Failed to add quiz. Please try again.'
        );
      },
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    const { fullName, email, password } = this.registerForm.value;

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Account created successfully!',
    });
    setTimeout(() => {
      this.loginMode = 'login';
      this.isLoginMode = true;
    }, 1000);
  }
}
