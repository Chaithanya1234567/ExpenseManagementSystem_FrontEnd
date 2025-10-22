import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PendingRequest } from '../pendingrequest.model';
import { Approval } from './approval.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})


export class ApprovalService {
  private aprrovalurl = `${environment.apiUrl}/approval`;
    private expenseurl = `${environment.apiUrl}/Expense`;


  constructor(private http: HttpClient) {}

  getPendingRequests(): Observable<PendingRequest[]> {
    return this.http.get<PendingRequest[]>(`${this.expenseurl}/pending-requests`);
  }

  getApprovedRequests(): Observable<PendingRequest[]> {
  return this.http.get<PendingRequest[]>(`${this.aprrovalurl}/approve`);
}


  approve(approval: Approval): Observable<any> {
    return this.http.post(`${this.aprrovalurl}/approve`, approval);
  }

  reject(approval: Approval): Observable<any> {
    return this.http.post(`${this.aprrovalurl}/reject`, approval);
  }
  getEmployeeNameById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${environment.apiUrl}/Employee/${employeeId}`);
  }
}
export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dob: string;
  doj: string;
  salary: number;
  address: string;
  gender: number;
  employeeType: number;
  status: number;
  departmentId: number;
}