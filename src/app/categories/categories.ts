import { Component, signal } from '@angular/core';
import { Category } from './Category';
import { CategoryService } from './category-service';
import { Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
    imports: [CommonModule, FormsModule],

  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // form model for add / edit
  current: Category | null = null;
  nameModel = '';

  constructor(private svc: CategoryService) {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.svc.getAll().subscribe({
      next: (res) => { this.categories.set(res || []); this.loading.set(false); },
      error: (err) => { this.error.set('Failed to load categories'); this.loading.set(false); console.error(err); }
    });
  }

  startAdd() {
    this.current = null;
    this.nameModel = '';
  }

  startEdit(cat: Category) {
    this.current = { ...cat };
    this.nameModel = this.current.name ?? '';
  }

  save() {
    const payload: Category = this.current ? { ...this.current, name: this.nameModel } : { id: 0, name: this.nameModel };

    if (this.current && (this.current.id ?? 0) > 0) {
      this.svc.update(payload).subscribe({
        next: () => { this.load(); this.current = null; this.nameModel = ''; },
        error: (e) => { console.error(e); this.error.set('Update failed'); }
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => { this.load(); this.nameModel = ''; },
        error: (e) => { console.error(e); this.error.set('Create failed'); }
      });
    }
  }

  cancel() {
    this.current = null;
    this.nameModel = '';
  }

  delete(cat: Category) {
    if (!confirm(`Delete category "${cat.name}" ?`)) return;
    this.svc.delete(cat.id!).subscribe({
      next: () => this.load(),
      error: (e) => { console.error(e); this.error.set('Delete failed'); }
    });
  }
}
