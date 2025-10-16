import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface DashboardStats {
  totalBudget: number;
  usedAmount: number;
  remainingAmount: number;
  approvedThisWeekCount: number;
  approvedThisWeekAmount: number;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:5244/api/Dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/Stats`);
  }
}
