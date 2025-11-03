import { Component, OnInit } from '@angular/core';
import { Role, RoleService } from './role.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
  templateUrl: './role.html',
  styleUrls: ['./role.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  newRole = '';
  editRoleId: number | null = null;
  editRoleName = '';

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
  this.roleService.getAll().subscribe({
    next: data => this.roles = data,
    error: err => console.error('Error fetching roles:', err)
  });
}


  addRole() {
    if (!this.newRole.trim()) return;
    this.roleService.add(this.newRole).subscribe(() => {
      this.newRole = '';
      this.loadRoles();
    });
  }

  startEdit(role: Role) {
    this.editRoleId = role.roleId;
    this.editRoleName = role.roleName;
  }

  updateRole() {
    if (this.editRoleId == null) return;
    this.roleService.update({ roleId: this.editRoleId, roleName: this.editRoleName })
      .subscribe(() => {
        this.editRoleId = null;
        this.loadRoles();
      });
  }

  deleteRole(id: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.delete(id).subscribe(() => this.loadRoles());
    }
  }
}
