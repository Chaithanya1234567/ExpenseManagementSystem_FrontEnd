import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Approval } from './approval.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiUrl = 'https://localhost:7000/api/Approval';

  constructor(private http: HttpClient) {}

  approve(expenseId: number, approverId: number): Observable<any> {
    const payload: Approval = { expenseId, approverId };
    return this.http.post(`${this.apiUrl}/approve`, payload);
  }

  reject(expenseId: number, approverId: number): Observable<any> {
    const payload: Approval = { expenseId, approverId };
    return this.http.post(`${this.apiUrl}/reject`, payload);
  }

  getAllApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(this.apiUrl);
  }

  getApprovalsByExpense(expenseId: number): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.apiUrl}/${expenseId}`);
  }
}
