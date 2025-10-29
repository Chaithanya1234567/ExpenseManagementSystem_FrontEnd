import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ FIXED imports
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  selectedRole: 'Employee' | 'Manager' = 'Employee';

  constructor(private authService: AuthService, private router: Router) {}

  setRole(role: 'Employee' | 'Manager') {
    this.selectedRole = role;
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.isLoading = false;

        const backendRole = (res && res.role) ? res.role : null;

        if (backendRole === 'Manager' || this.selectedRole === 'Manager') {
          this.router.navigate(['/approvals'] );
        } else {
          this.router.navigate(['/expenses']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error || 'Invalid credentials. Please try again.';
        console.error('Login error:', err);
      }
    });
  }
}
