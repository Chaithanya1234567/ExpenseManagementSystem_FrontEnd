import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from './Category'; 
import { CategoryService } from './category-service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories {
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  current: Category | null = null;
  name = '';
  description='';

  constructor(private svc: CategoryService) {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (res) => {
        this.categories.set(res);
        console.log(this.categories.name);
        console.log(this.categories);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load categories');
        this.loading.set(false);
      }
    });
  }

  startAdd() {
    this.current = null;
    this.name = '';
    this.description='';
  }

  startEdit(cat: Category) {
    this.current = { ...cat };
    this.name = this.current.expenseTypeName;
    this.description=this.current.description;
  }

save() {
  const payload: Category = this.current
    ? { ...this.current, expenseTypeName: this.name, description: this.description }
    : { expenseTypeId: 0, expenseTypeName: this.name, description: this.description };

  const request = this.current
    ? this.svc.update(payload)
    : this.svc.create(payload);

  request.subscribe({
    next: () => {
      this.load();
      this.cancel();
    },
    error: () => this.error.set('Save failed')
  });
}

  cancel() {
    this.current = null;
    this.name = '';
    this.description='';
  }

  delete(cat: Category) {
    if (!confirm(`Delete category "${cat.expenseTypeName}"?`)) return;
    this.svc.delete(cat.expenseTypeId).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Delete failed')
    });
  }
}
