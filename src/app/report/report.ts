import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../expense/expense.service';
import { Expense } from '../expense/expense.model';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class ReportComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  startDate: string = '';
  endDate: string = '';
  statusFilter: string = '';

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
  this.expenseService.getAllExpenses().subscribe({
    next: (data: Expense[]) => {
      // Map employee and expense type names
      this.expenses = data.map(exp => ({
        ...exp,
        employeeName: exp.employeeName || 'N/A',
        expenseTypeName: exp.expenseTypeName || 'N/A'
      }));
      this.filteredExpenses = this.expenses;
    },
    error: (err) => console.error('Error fetching expenses', err)
  });
}

  filterExpenses(): void {
    this.filteredExpenses = this.expenses.filter(exp => {
      const expDate = new Date(exp.expenseDate);
      const afterStart = this.startDate ? expDate >= new Date(this.startDate) : true;
      const beforeEnd = this.endDate ? expDate <= new Date(this.endDate) : true;
      const statusMatch = this.statusFilter ? exp.status === this.statusFilter : true;
      return afterStart && beforeEnd && statusMatch;
    });
  }

  getTotalAmount(): number {
    return this.filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

   exportReport() {
    const doc = new jsPDF();
    doc.text('Expense Report', 14, 16);

    // Table headers
    const headers = [['Employee', 'Expense Type', 'Amount', 'Date', 'Status']];

    // Table data
    const data = this.filteredExpenses.map(exp => [
      exp.employeeName,
      exp.expenseTypeName,
      exp.amount.toFixed(2),
      new Date(exp.expenseDate).toLocaleDateString(),
      exp.status
    ]);

    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: 'grid'
    });

    // Save PDF
    doc.save('expense-report.pdf');
  }
}
