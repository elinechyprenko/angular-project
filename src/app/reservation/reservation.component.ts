import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FindTableComponent } from "../find-table/find-table.component";
import { ReservationDetailsComponent } from "../reservation-details/reservation-details.component";
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BookingComponent } from "../booking/booking.component";
import { ReservationStateService } from '../services/reservation-state.service';
import { AddToCartService } from '../services/add-to-cart.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
  imports: [NgFor, NgIf, FindTableComponent, ReservationDetailsComponent, NgClass, RouterLink, RouterOutlet, BookingComponent],
  providers: [AuthService, ReservationStateService, AuthService, AddToCartService]
})
export class ReservationComponent {
  currentStep: 'find-table' | 'your-details' | 'booking' | null = 'find-table';
  selectedTable: { table_id: number, date: string, time: string, people: number } | null = null;
  booking: { table_id: number, email: string, fullName: string, phone: string, date: string, time: string, people: number } | null = null;

  constructor(public authService: AuthService, public reservationState: ReservationStateService) { }

  ngOnInit() {
    this.checkReservationState()
  }

  checkReservationState() {
    const reservationData = this.reservationState.getReservation();
    if (this.reservationState.reservation === true) {
      this.currentStep = 'booking';
      this.booking = reservationData;
    } else {
      this.currentStep = 'find-table';
    }
  }

  selectTab(step: 'find-table' | 'your-details') {
    this.currentStep = step;
  }
  onFoundTable(event: { table_id: number, date: string, time: string, people: number }) {
    this.selectedTable = event;
    this.currentStep = 'your-details'
  }
  reservationConfirmation(event: { table_id: number, email: string, fullName: string, phone: string, date: string, time: string, people: number }) {
    this.booking = event;
    this.currentStep = 'booking';
    this.reservationState.confirmReservation(this.booking);
  }

  onReservationCancelled() {
    this.checkReservationState();
  }
}
