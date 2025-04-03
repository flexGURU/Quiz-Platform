import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  loginOptions: LoginOption[] = [
    { label: 'Login', value: 'login' },
    { label: 'Register', value: 'register' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService // Add your auth service here // private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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

  ngOnInit() {
    // Check if user is already logged in
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

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
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;

    // Here you would normally call your auth service to log in
    // For demo purposes, we'll simulate a successful login
    // this.authService.login(email, password, rememberMe).subscribe({
    //   next: (response) => {
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (error) => {
    //     this.errorMessage = 'Invalid email or password';
    //   }
    // });

    // Mock implementation
    if (email === 'admin@example.com' && password === 'password') {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Logged in successfully!',
      });
      setTimeout(() => {
        this.router.navigate(['/admin/users']);
      }, 1000);
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }

  onRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    const { fullName, email, password } = this.registerForm.value;

    // Here you would normally call your auth service to register
    // this.authService.register(fullName, email, password).subscribe({
    //   next: (response) => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Account created successfully!'
    //     });
    //     this.loginMode = 'login';
    //     this.isLoginMode = true;
    //   },
    //   error: (error) => {
    //     this.errorMessage = error.message || 'Registration failed';
    //   }
    // });

    // Mock implementation
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
