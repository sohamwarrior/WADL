import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login(): void {
    const raw = localStorage.getItem('user');
    if (!raw) {
      alert('No registered user found. Please register first.');
      return;
    }
    const user = JSON.parse(raw);
    if (user.email === this.email && user.password === this.password) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      this.router.navigate(['/profile']);
    } else {
      alert('Invalid email or password');
    }
  }
}
