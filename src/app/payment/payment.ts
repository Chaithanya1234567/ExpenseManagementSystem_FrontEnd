import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from './payment.service';
import { ApprovedExpense, Payment } from './payment.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit {
  approvedExpenses: ApprovedExpense[] = [];
  loading = false;
  message = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadApprovedExpenses();
  }

  loadApprovedExpenses(): void {
    this.loading = true;
    this.paymentService.getApprovedExpenses().subscribe({
      next: (data) => {
        this.approvedExpenses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading approved expenses', err);
        this.loading = false;
      }
    });
  }

  markAsPaid(expense: ApprovedExpense): void {
    if (!confirm(`Mark expense #${expense.expenseId} as paid?`)) return;

    const payment: Payment = {
      expenseId: expense.expenseId,
      amount: expense.amount,
      status: 'Paid',
      paymentDate: new Date()
    };

    this.paymentService.processPayment(payment).subscribe({
      next: () => {
        this.message = `Expense #${expense.expenseId} marked as Paid ✅`;
        expense.paymentStatus = 'Paid';
      },
      error: (err) => {
        console.error('Payment failed', err);
        alert('Failed to mark as paid');
      }
    });
  }
}
