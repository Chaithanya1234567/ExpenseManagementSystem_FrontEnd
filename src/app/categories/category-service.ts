import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from './Category'; 
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/Expensetype`; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  update(category: Category): Observable<Category> {
    return this.http.put<Category>(this.baseUrl, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
