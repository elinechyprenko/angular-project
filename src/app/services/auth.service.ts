import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  redirectUrl = '';

  constructor(private router: Router) {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      this.isLoggedIn = true;
    }
    // console.log(userDataString);
  }
}
