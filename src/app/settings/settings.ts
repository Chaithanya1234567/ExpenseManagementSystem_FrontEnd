import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  theme = 'light';
  notificationsEnabled = true;

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  saveSettings() {
    alert('Settings saved successfully ✅');
  }
}
