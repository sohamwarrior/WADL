import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];

  ngOnInit(): void {
    const raw = localStorage.getItem('appointments');
    this.appointments = raw ? JSON.parse(raw) : [];
  }
}
