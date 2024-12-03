import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      // phone: ['', Validators.pattern('^[0-9]*$')],
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { user, password } = this.loginForm.value;
      console.log('Submitting login form:', user + '/' + password);
      this.loginService.login(user, password).subscribe({
        next: (response) => {
          if (response.error) {
            console.error('Login error:', response.mensaje);
            this.errorMessage = response.mensaje;
          } else {
            console.log('Login successful:', response);
            this.errorMessage = null;
            this.sessionService.setUserData(response);
            this.router.navigate(['/principal']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage =
            'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.';
        },
      });
    }
  }
}
