import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog } from './auditlog.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = 'https://localhost:7000/api/AuditLog'; 

  constructor(private http: HttpClient) {}

  getAllLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(this.apiUrl);
  }

  getLogById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.apiUrl}/${id}`);
  }

  getLogsByExpenseId(expenseId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/by-expense/${expenseId}`);
  }

  createLog(log: AuditLog): Observable<AuditLog> {
    return this.http.post<AuditLog>(this.apiUrl, log);
  }
}
