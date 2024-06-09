import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  public stripe: Stripe | null = null;
  public elements: StripeElements | null = null;
  public cardElement: any = null;

  constructor(private http: HttpClient) { }

  async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51PMATzRuVY5NUwIvTRIXphazpl4VBu7HXvl9tHq6A6hXas10Tf4FsQ6pmypZTLs4psMoJ6w6EWa1RTM8uAJcN5lz007n8wWbHq');
    if (this.stripe) this.elements = this.stripe.elements();
    else console.error('Stripe is not initialized');
  }

  createCardElement() {
    if (this.elements) {
      this.cardElement = this.elements.create('card');
      return this.cardElement;
    }
    return null;
  }

  mountCardElement(cardElementDivId: string) {
    const cardElementDiv = document.getElementById(cardElementDivId);
    if (cardElementDiv && !cardElementDiv.hasChildNodes()) {
      this.cardElement.mount(`#${cardElementDivId}`);
    }
  }

  async createPaymentIntent(totalPrice: number) {
    return this.http.post('http://localhost:3000/create-payment-intent', { total_price: totalPrice }).toPromise();
  }

  async confirmPayment(clientSecret: string, orderData: any) {
    if (this.stripe && this.cardElement) {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: orderData.fullName,
            email: orderData.email,
          },
        },
      });
      return result;
    } else {
      console.error('Stripe or elements are not initialized');
      return null;
    }
  }

  isStripeInitialized() {
    return this.stripe !== null && this.elements !== null;
  }
}
