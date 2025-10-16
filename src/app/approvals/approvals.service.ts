import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Approval {
  expenseId: number;
  approverId: number;
  approvalStatus?: 'Approved' | 'Rejected';
  actionDate?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {
  private baseUrl = 'http://localhost:5244/api/approval'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getAllApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(this.baseUrl);
  }

  getApprovalsByExpense(expenseId: number): Observable<Approval[]> {
    return this.http.get<Approval[]>(`${this.baseUrl}/${expenseId}`);
  }

  approveExpense(approval: Approval): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve`, approval);
  }

  rejectExpense(approval: Approval): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject`, approval);
  }
}
