import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'https://localhost:7000/api/expense'; 

  constructor(private http: HttpClient) {}

  getThisMonthExpenses(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/this-month-expenses`);
  }

  getPendingRequests(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pending-requests`);
  }  
  }

