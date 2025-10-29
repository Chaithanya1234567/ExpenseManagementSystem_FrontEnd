import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environment/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => {
        if (res) {
          localStorage.setItem('user', JSON.stringify(res));
        }
      })
    );
  }

//   logout(): void {
//     localStorage.removeItem('user');
//   }

  getCurrentUser(): LoginResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUser(): LoginResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
  return !!localStorage.getItem('user');
}

logout(): void {
  localStorage.removeItem('user');
}
}