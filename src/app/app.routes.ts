import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Home } from './home/home';
import { ExpenseComponent } from './expense/expense';
import { Navbar } from './navbar/navbar';
import { ReportComponent } from './report/report';
import { ApprovalsComponent } from './approvals/approvals';
import { EmployeeComponent } from './employee/employee';
import { DepartmentComponent } from './department/department';
import { LoginComponent } from './login/login';
import { AuthGuard } from './login/auth.guard'; 

export const routes: Routes = [
  // 👇 Default redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login page route
  { path: 'login', component: LoginComponent },

  // Protected routes
  {
    path: '',
    component: Navbar,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'categories', component: Categories },
      { path: 'expenses', component: ExpenseComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'employees', component: EmployeeComponent },
      { path: 'departments', component: DepartmentComponent },
      { path: 'approvals', component: ApprovalsComponent }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
