import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  register(): void {
    if (!this.name || !this.email || !this.password) {
      alert('Please fill all fields');
      return;
    }
    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.name, email: this.email, password: this.password })
    })
    .then(res => res.json())
    .then(data => {
      alert('Registration successful! Please login.');
      this.router.navigate(['/login']);
    })
    .catch(err => alert('Registration failed'));
  }
}
