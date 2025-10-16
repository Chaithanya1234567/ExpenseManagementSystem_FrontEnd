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
  imports: [CommonModule, FormsModule]
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

  editMode: boolean = false; 
  editingExpenseId: number | null = null;

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

  submitExpense() {
  const formData = new FormData();
  formData.append('EmployeeId', this.newExpense.employeeId.toString());
  formData.append('ExpensetypeId', this.newExpense.expensetypeId.toString());
  formData.append('Amount', this.newExpense.amount.toString());
  formData.append('Description', this.newExpense.description);
  
  if (this.selectedFile) {
    formData.append('Receipt', this.selectedFile);
  }

  if (this.editMode && this.editingExpenseId !== null) {
    formData.append('ExpenseId', this.editingExpenseId.toString());

    this.expenseService.updateExpenseWithFormData(formData).subscribe(
      () => {
        alert('Expense updated successfully!');
        this.resetForm();
        this.loadExpenses();
      },
      err => {
        console.error(err);
        alert('Failed to update expense.');
      }
    );
  } else {
    this.expenseService.addExpense(formData).subscribe(
      () => {
        alert('Expense added successfully!');
        this.resetForm();
        this.loadExpenses();
      },
      err => console.error(err)
    );
  }
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

  // 
  editExpense(expense: Expense): void {
  this.editMode = true;
  this.editingExpenseId = expense.expenseId;

  this.newExpense = {
    employeeId: expense.employeeId,
    expensetypeId: expense.expensetypeId,
    amount: expense.amount,
    description: expense.description
  };

  this.selectedFile = null; 
}
resetForm(): void {
  this.newExpense = { employeeId: 0, expensetypeId: 0, amount: 0, description: '' };
  this.selectedFile = null;
  this.editMode = false;
  this.editingExpenseId = null;
}
}
