import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const raw = localStorage.getItem('loggedInUser');
    if (!raw) return;
    const user = JSON.parse(raw);
    fetch('http://localhost:3000/api/appointments/' + encodeURIComponent(user.email))
      .then(res => res.json())
      .then(data => this.appointments = data)
      .catch(err => console.log('Error loading appointments'));
  }

  deleteAppointment(id: string): void {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    fetch('http://localhost:3000/api/appointments/' + id, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        this.appointments = this.appointments.filter(a => a._id !== id);
      })
      .catch(err => alert('Failed to delete appointment'));
  }
}
