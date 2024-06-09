import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostDataService {

  constructor(private http: HttpClient) { }

  postUser(data: Object) {
    this.http.post('http://localhost:3000/user', data).subscribe((response) => console.log(response), error => console.log(error))
  }

  postReservation(data: Object): Observable<any> {
    return this.http.post('http://localhost:3000/booking', data);
  }
  postTable(data: Object): Observable<any> {
    return this.http.post('http://localhost:3000/tables', data);
  }
  postOrder(orderData: Object): Observable<any> {
    return this.http.post('http://localhost:3000/order', orderData);
  }
  postDining(data: Object): Observable<any> {
    return this.http.post('http://localhost:3000/dining', data);
  };

}
