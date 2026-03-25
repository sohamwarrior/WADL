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
    const user = { name: this.name, email: this.email, password: this.password };
    localStorage.setItem('user', JSON.stringify(user));
    alert('Registration successful! Please login.');
    this.router.navigate(['/login']);
  }
}
