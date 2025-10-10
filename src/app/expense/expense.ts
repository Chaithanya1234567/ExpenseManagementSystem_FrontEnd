import { Component, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.html',
  styleUrls: ['./expense.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class ExpenseComponent implements OnInit {
  expenses: Expense[] = [];
  selectedFile: File | null = null;
  newExpense = {
    employeeId: 0,
    expensetypeId: 0,
    amount: 0,
    description: ''
  };

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getAllExpenses().subscribe(
      data => this.expenses = data,
      err => console.error(err)
    );
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  addExpense() {
    const formData = new FormData();
    formData.append('EmployeeId', this.newExpense.employeeId.toString());
    formData.append('ExpensetypeId', this.newExpense.expensetypeId.toString());
    formData.append('Amount', this.newExpense.amount.toString());
    formData.append('Description', this.newExpense.description);
    if (this.selectedFile) {
      formData.append('Receipt', this.selectedFile);
    }

    this.expenseService.addExpense(formData).subscribe(
      res => {
        alert('Expense added successfully!');
        this.loadExpenses();
        this.newExpense = { employeeId: 0, expensetypeId: 0, amount: 0, description: '' };
        this.selectedFile = null;
      },
      err => console.error(err)
    );
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe(
        res => {
          alert('Expense deleted!');
          this.loadExpenses();
        },
        err => console.error(err)
      );
    }
  }
}
