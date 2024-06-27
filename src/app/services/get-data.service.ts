import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private http: HttpClient) { }

  getProduct(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/products')
  };

  getImage(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/images')
  };

  getAdditions(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/additions');
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:3000/user/email?email=${email}`);
  }
  checkPhoneExists(phone: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:3000/user/phone?phone=${phone}`);
  }
}
