import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from './expense.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/Expense`; 

  constructor(private http: HttpClient) { }

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  addExpense(formData: FormData): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, formData);
  }

  updateExpense(expense: Expense): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrl, expense);
  }

  deleteExpense(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);    
  }
  
  getRecentExpenses(count: number = 5): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/recent?count=${count}`);
  }
  updateExpenseWithFormData(formData: FormData): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrl, formData);
  }
  
}
