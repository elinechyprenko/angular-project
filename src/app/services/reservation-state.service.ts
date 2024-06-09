import { Injectable } from '@angular/core';
import { reservationItem } from '../reservation-details/reservation.item';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationStateService {
  reservation = false;
  reservationData: string | null = localStorage.getItem('dataReservation');
  reservationItem: reservationItem[] = [];

  constructor(private http: HttpClient) {
    if (this.reservationData) {
      this.reservationItem = JSON.parse(this.reservationData)
    }
  }

  confirmReservation(data: reservationItem) {
    const dataCopy = JSON.parse(JSON.stringify(data));
    localStorage.setItem('dataReservation', JSON.stringify(dataCopy));
    this.reservation = true;
  }

  getReservation(): reservationItem | null {
    const reservationStringData = localStorage.getItem('dataReservation');
    if (reservationStringData) {
      this.reservation = true;
      return JSON.parse(reservationStringData);
    }
    else {
      this.reservation = false;
      return null;
    }
  }

  deleteReservation(table_id: number): Observable<any> {
    localStorage.removeItem('dataReservation');
    this.reservation = false;
    return this.http.delete(`http://localhost:3000/booking/${table_id}`)
  }

}
