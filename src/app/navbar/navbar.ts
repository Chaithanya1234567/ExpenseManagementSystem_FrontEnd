import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet,Route,RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../login/login.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterOutlet,RouterLink],
  templateUrl: './navbar.html',
  styleUrls:['./navbar.css']
})
export class Navbar {
  role: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.role = parsedUser.role;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}