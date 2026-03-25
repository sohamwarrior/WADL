import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html'
})
export class AppointmentComponent {
  appointment: any = {
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    subject: 'appointment',
    message: '',
    preferredDays: [] as string[]
  };

  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private router: Router) {}

  toggleDay(day: string): void {
    const idx = this.appointment.preferredDays.indexOf(day);
    if (idx > -1) {
      this.appointment.preferredDays.splice(idx, 1);
    } else {
      this.appointment.preferredDays.push(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.appointment.preferredDays.includes(day);
  }

  submitAppointment(): void {
    if (!this.appointment.name || !this.appointment.email || !this.appointment.phone) {
      alert('Please fill Name, Email and Phone.');
      return;
    }
    const raw = localStorage.getItem('appointments');
    const list = raw ? JSON.parse(raw) : [];
    list.push({
      name: this.appointment.name,
      email: this.appointment.email,
      phone: this.appointment.phone,
      gender: this.appointment.gender,
      subject: this.appointment.subject,
      message: this.appointment.message,
      preferredDays: [...this.appointment.preferredDays],
      date: new Date().toLocaleString()
    });
    localStorage.setItem('appointments', JSON.stringify(list));
    alert('Appointment booked successfully!');
    this.router.navigate(['/appointments']);
  }
}
