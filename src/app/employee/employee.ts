import { Component, OnInit, signal } from '@angular/core';
import { Employee } from './employee.model';
import { EmployeeService } from './employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeeComponent implements OnInit {
  employees = signal<Employee[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  current: Employee | null = null;

  form = signal<Employee>({
    employeeId: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dob: new Date(),
    doj: new Date(),
    salary: 0,
    address: '',
    gender: 'Male',
    employeeType: 'FullTime',
    status: 'Active',
    departmentId: 0,
    roleId: 0
  });

  genders = ['Male', 'Female', 'Other'];
  employeeTypes = ['FullTime', 'PartTime', 'Contract'];
  statuses = ['Active', 'Inactive'];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.loading.set(true);
    this.employeeService.getAll().subscribe({
      next: (res) => {
        this.employees.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load employees');
        this.loading.set(false);
      }
    });
  }

  openModal(emp?: Employee) {
    if (emp) {
      this.current = emp;
      this.form.set({ ...emp });
    } else {
      this.current = null;
      this.resetForm();
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.current = null;
    this.resetForm();
  }

  save() {
    const emp: Employee = this.form();

    if (this.current && this.current.employeeId) {
      this.employeeService.update(this.current.employeeId, emp).subscribe(() => this.fetchEmployees());
    } else {
      this.employeeService.add(emp).subscribe(() => this.fetchEmployees());
    }

    this.closeModal();
  }

  delete(emp: Employee) {
    if (emp.employeeId && confirm(`Delete employee ${emp.firstName} ${emp.lastName}?`)) {
      this.employeeService.delete(emp.employeeId).subscribe(() => this.fetchEmployees());
    }
  }

  resetForm() {
    this.form.set({
      employeeId: 0,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      dob: new Date(),
      doj: new Date(),
      salary: 0,
      address: '',
      gender: 'Male',
      employeeType: 'FullTime',
      status: 'Active',
      departmentId: 0,
      roleId: 0
    });
  }
}
