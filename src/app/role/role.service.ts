import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

export interface Role {
  roleId: number;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/role`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  add(roleName: string): Observable<any> {
    return this.http.post(this.apiUrl, { roleName });
  }

  update(role: Role): Observable<any> {
  return this.http.put(`${this.apiUrl}/${role.roleId}`, role);
}


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
