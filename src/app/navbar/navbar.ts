import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet,Route,RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterOutlet,RouterLink],
  templateUrl: './navbar.html',
  styleUrls:['./navbar.css']
})
export class Navbar {

}
