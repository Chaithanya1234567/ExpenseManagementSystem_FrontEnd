import { Component, OnInit, signal } from '@angular/core';
import { Department } from './department.model';
import { DepartmentService } from './department.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './department.html',
  styleUrls: ['./department.css']
})
export class DepartmentComponent implements OnInit {
  departments = signal<Department[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showModalSignal = signal(false);
  current: Department | null = null;

  // Form fields
  departmentName = '';
  description = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.loading.set(true);
    this.departmentService.getAll().subscribe({
      next: (res) => {
        this.departments.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load departments');
        this.loading.set(false);
      }
    });
  }

  openModal(dept?: Department) {
    this.showModalSignal.set(true);
    if (dept) {
      this.current = dept;
      this.departmentName = dept.departmentName;
      this.description = dept.description;
    } else {
      this.current = null;
      this.resetForm();
    }
  }

  closeModal() {
    this.showModalSignal.set(false);
    this.resetForm();
  }

  save() {
    const dept: Department = {
      departmentId: this.current?.departmentId ?? 0,
      departmentName: this.departmentName,
      description: this.description
    };

    if (this.current) {
      this.departmentService.update(dept).subscribe(() => this.fetchDepartments());
    } else {
      this.departmentService.create(dept).subscribe(() => this.fetchDepartments());
    }

    this.closeModal();
  }

  delete(dept: Department) {
    if (confirm(`Delete department ${dept.departmentName}?`)) {
      this.departmentService.delete(dept.departmentId).subscribe(() => this.fetchDepartments());
    }
  }

  resetForm() {
    this.departmentName = '';
    this.description = '';
  }

  showModal() {
    return this.showModalSignal();
  }
}
