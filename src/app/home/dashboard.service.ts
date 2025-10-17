import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

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
  private baseUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/Stats`);
  }
}
