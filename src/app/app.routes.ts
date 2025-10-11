import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Home } from './home/home';
import { ExpenseComponent } from './expense/expense';
import { Navbar } from './navbar/navbar';

export const routes: Routes = [
    {path:'', component: Navbar,
    children: [
    {path:'', component: Home},
    {path:'categories', component: Categories},
    {path:'expenses', component: ExpenseComponent},
    {path:'home', component: Home},
     ]
  },
  { path: '**', redirectTo: '' } // fallback

];
