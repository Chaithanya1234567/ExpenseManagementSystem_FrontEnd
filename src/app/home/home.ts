import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
 menuItems = [
    { icon: 'fa-solid fa-house', label: 'Dashboard', route: '/dashboard' },
    { icon: 'fa-solid fa-wallet', label: 'Expenses', route: '/expenses' },
    { icon: 'fa-solid fa-tags', label: 'Categories', route: '/categories' },
    { icon: 'fa-solid fa-chart-line', label: 'Reports', route: '/reports' },
    { icon: 'fa-solid fa-gear', label: 'Settings', route: '/settings' }
  ];

  username = 'Chaithanya';
}
