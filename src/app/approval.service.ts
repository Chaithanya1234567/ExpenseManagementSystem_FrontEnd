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

  getAllApprovals(): Observable<Approval[]> {
    return this.http.get<Approval[]>(this.apiUrl);
  }

  approveExpense(approval: Approval): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve`, approval);
  }

  rejectExpense(approval: Approval): Observable<any> {
    return this.http.post(`${this.apiUrl}/reject`, approval);
  }
}
