import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Home } from './home/home';
import { ExpenseComponent } from './expense/expense';

export const routes: Routes = [
    {path:'', component: Home,
    children: [
    {path:'categories', component: Categories},
    {path:'expenses', component: ExpenseComponent}
     ]
  },
  { path: '**', redirectTo: '' } // fallback

];
