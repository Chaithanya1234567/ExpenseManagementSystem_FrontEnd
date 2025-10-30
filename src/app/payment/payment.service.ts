import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, ApprovedExpense } from './payment.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  //  Get all payments
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  //  Get all approved expenses ready for payment
  getApprovedExpenses(): Observable<ApprovedExpense[]> {
    return this.http.get<ApprovedExpense[]>(`${environment.apiUrl}/expense/approved`);
  }

  //  Process payment (mark as paid)
  processPayment(payment: Payment): Observable<any> {
    return this.http.post(`${this.apiUrl}/process`, payment);
  }
}
