import { Routes } from '@angular/router';
import { Categories } from './categories/categories';
import { Home } from './home/home';

export const routes: Routes = [
    {path:'', component: Home},
    {path:'categories', component: Categories}

];
