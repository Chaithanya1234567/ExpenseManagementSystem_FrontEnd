import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Expense } from '../expense/expense.model';

export interface PendingRequest {
  expenseId: number;
  approverId: number;
  employeeName: string;
  expenseType: string;
  date: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'https://localhost:7000/api/expense'; 

  constructor(private http: HttpClient) {}

  getThisMonthExpenses(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/this-month-expenses`);
  }

  getPendingRequests(): Observable<PendingRequest[]> {
    return this.http.get<PendingRequest[]>(`${this.apiUrl}/pending-requests`);
  }  
    getRecentExpenses(count: number = 5): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/recent?count=${count}`);
  }

  
  }

