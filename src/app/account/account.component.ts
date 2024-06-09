import { Component, NgModule } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { User } from '../sign-up/user.class';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ReservationTables } from './reservation-tables.class';
import { OrderData } from './order-data-class';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, FormsModule, HttpClientModule, NgClass],
  providers: [AuthService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  userData: User = new User('', '', 0, null, '');
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  reservationTables: ReservationTables[] = [];
  orderData: OrderData[] = [];

  constructor(public authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.getData();
    this.getReservation();
    this.getOrder();
  }

  getData() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) this.userData = JSON.parse(userDataString);
    else console.error('Data is not get');
  };


  getReservation() {
    const userEmail = this.userData.email;
    const params = new HttpParams().set('email', userEmail)
    this.http.get('http://localhost:3000/get-reservation-tables', { params }).subscribe((res: any) => {
      this.reservationTables = res;
    },
      (error) => console.log(error))
  }

  getOrder() {
    const userEmail = this.userData.email;
    const params = new HttpParams().set('email', userEmail);
    this.http.get('http://localhost:3000/get-order-data', { params }).subscribe((res: any) => {
      this.orderData = res;
      console.log(this.orderData)
    },
      (error) => console.log(error))
  }
  signOut() {
    this.authService.isLoggedIn = false;
    localStorage.removeItem('userData')
    this.router.navigate(['/home']);
    console.log(this.authService.isLoggedIn)
  }

  checkPasswordsMatch() {
    return this.newPassword === this.confirmPassword
  };
  removePassword() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
  cancel() {
    this.removePassword();
  }

  saveData() {
    const savePassword = {
      email: this.userData.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }
    this.http.post('http://localhost:3000/change-password', savePassword).subscribe((res: any) => {
      if (res.success) {
        alert('Password changed successfully');
        this.removePassword();
      }
      if (res.status === 401) {
        alert('Current password is incorrect')
      }
    },
      error => {
        console.log('Error', error)
        if (error.status === 401) {
          alert('Current password is incorrect')
        }
      })
  }
}
