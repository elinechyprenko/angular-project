import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, AfterViewInit, AfterViewChecked, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { AddToCartService } from '../services/add-to-cart.service';
import { CartItem } from '../cart/cart-item';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StripeService } from '../services/stripe.service';
import { PostDataService } from '../services/post-data.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, RouterLink, RouterOutlet, HttpClientModule],
  providers: [AddToCartService, StripeService, PostDataService],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, AfterViewInit, AfterViewChecked {

  cartItem: CartItem[] = [];
  selectedMethod: string = '';
  subtotal: number = 0;
  totalBlock = false;
  selectedPaymentOption: string | null = null;
  total: number = 0;
  deliveryPrice: number = 10;
  packingPrice: number = 2;
  orderFinish = false;
  minDate: string = '';
  maxDate: string = '';

  siteForm: FormGroup | any = '';
  deliveryForm: FormGroup | any = '';
  takeawayForm: FormGroup | any = '';

  constructor(private fb: FormBuilder, public route: ActivatedRoute, private cartService: AddToCartService, private stripeService: StripeService, private postData: PostDataService) {
    const currentDate = new Date();
    this.minDate = this.formatDate(currentDate);
    currentDate.setDate(currentDate.getDate() + 21);
    this.maxDate = this.formatDate(currentDate);
  }

  ngOnInit() {
    this.getMethod();
    this.getData();
    this.formBuild();
  }

  ngAfterViewInit() {
    this.stripeService.initializeStripe();
  }

  ngAfterViewChecked() {
    if ((this.selectedPaymentOption === '50%' || this.selectedPaymentOption === '100%') && this.stripeService.isStripeInitialized() && !this.stripeService.cardElement) {
      this.stripeService.createCardElement();
      this.stripeService.mountCardElement('card-element');
    }
  }
  getMethod() {
    this.route.queryParams.subscribe((params) => {
      this.selectedMethod = params['method'];
    });
  }

  public formBuild(): void {
    this.siteForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
    this.deliveryForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      address: ['', Validators.required],
      postcode: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
    this.takeawayForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  getData() {
    this.cartItem = this.cartService.visibleData();
    const savePrice = localStorage.getItem('subtotal');
    if (savePrice) this.subtotal = +savePrice;
  }

  totalPrice() {
    this.selectedPaymentOption = '100%';
    this.totalBlock = true;
    if (this.selectedMethod === 'on-site-ordering' || this.selectedMethod === 'takeaway') this.total = this.subtotal;
  }

  halfPrice() {
    this.selectedPaymentOption = '50%';
    this.totalBlock = true;
    if (this.selectedMethod === 'on-site-ordering') this.total = this.subtotal / 2;
    if (this.selectedMethod === 'takeaway') this.total = (this.subtotal / 2) + this.packingPrice;
  }

  cash() {
    this.selectedPaymentOption = 'cash'
    if (this.selectedMethod === 'delivery') this.total = this.subtotal + this.deliveryPrice
    if (this.selectedMethod === 'takeaway') this.total = this.subtotal + this.packingPrice;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submitOrder() {
    let formData;
    if (this.selectedMethod === 'on-site-ordering') formData = this.siteForm.value;
    else if (this.selectedMethod === 'delivery') formData = this.deliveryForm.value;
    else if (this.selectedMethod === 'takeaway') formData = this.takeawayForm.value;

    const cartItemsData = this.cartItem.map(item => ({
      product_title: item.product.title,
      price: item.product.price,
      quantityProduct: item.quantityProduct
    }));

    const orderData = {
      order_method: this.selectedMethod,
      ...formData,
      cartItems: cartItemsData,
      selectedPayment: this.selectedPaymentOption,
      total_price: this.total
    };
    if (this.selectedPaymentOption === 'cash') {
      this.postData.postOrder(orderData).subscribe((res) => {
        this.orderFinish = true;
        this.cartService.clearLocalStorage();
      },
        (error) => console.log('Error:', error)
      )
    }
    else this.processStripePayment(orderData);
  }

  async processStripePayment(orderData: any) {
    try {
      const paymentIntentResponse: any = await this.stripeService.createPaymentIntent(orderData.total_price);
      const clientSecret = paymentIntentResponse.clientSecret;
      const result = await this.stripeService.confirmPayment(clientSecret, orderData);
      if (result && result.error) {
        console.error('Payment failed', result.error);
      } else if (result && result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        this.postData.postOrder(orderData).subscribe(
          response => {
            this.orderFinish = true;
            this.cartService.clearLocalStorage();
          },
          error => console.error('Error placing order', error)
        );
      } else {
        console.error('Payment confirmation failed or was incomplete.');
      }
    } catch (error) {
      console.error('Error processing payment', error);
    }
  }
}
