import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Home } from './home/home';
import { ExpenseComponent } from './expense/expense';
import { Navbar } from './navbar/navbar';
import { ReportComponent } from './report/report';  

export const routes: Routes = [
    {path:'', component: Navbar,
    children: [
    {path:'', component: Home},
    {path:'categories', component: Categories},
    {path:'expenses', component: ExpenseComponent},
    {path:'reports', component: ReportComponent},
    {path:'home', component: Home},
     ]
  },
  { path: '**', redirectTo: '' } // fallback

];
