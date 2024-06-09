import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReservationStateService } from '../services/reservation-state.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AddToCartService } from '../services/add-to-cart.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [NgIf, NgFor, RouterOutlet, RouterLink, ReactiveFormsModule],
  providers: [ReservationStateService, AddToCartService, AuthService],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {

  @Input() table_id: number = 0;
  @Input() email: string = '';
  @Input() fullName: string = '';
  @Input() phone: string = '';
  @Input() date: string = ''
  @Input() time: string = '';
  @Input() people: number = 0;
  @Output() onCancel = new EventEmitter<void>();
  backtoCart = false;

  constructor(public reservationService: ReservationStateService, public authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkMethod();
  }

  cancelReservation() {
    this.reservationService.deleteReservation(this.table_id).subscribe((res) => {
      console.log('Reservation cancelled successfully:', res);
      this.onCancel.emit();
    },
      error => console.error('Error cancelling reservation:', error))
  }

  checkMethod() {
    this.route.queryParams.subscribe(params => {
      if (params['fromCart'] && params['method'] === 'on-site-ordering') {
        this.backtoCart = true;
      }
    });
  }
}