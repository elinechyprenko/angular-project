import { Component } from '@angular/core';
import { AddToCartService } from '../services/add-to-cart.service';
import { NgFor, NgIf } from '@angular/common';
import { GetDataService } from '../services/get-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Addition, CartItem, Product } from './cart-item';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule, RouterLink],
  providers: [AddToCartService, GetDataService, AuthService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItem: CartItem[] = [];
  imageUrl: string[] | null = null;
  quantity: number = 0;
  allPrice: number = 0;
  productPrice: number = 0;
  quantityAdditions: number = 0;
  additionPrice: number = 0;
  selectedOrderMethod: string = 'takeaway';
  reservationMade: boolean = false;

  constructor(public cartService: AddToCartService, public getData: GetDataService, public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.cartItem = this.cartService.visibleData();
    const savedAllPrice = localStorage.getItem('allPrice');
    if (savedAllPrice) this.allPrice = +savedAllPrice
    this.cart()
    this.totalPrice();
    this.updateQuantity();
  }

  cart() {
    this.getData.getImage().subscribe((res) => this.imageUrl = res, (error) => console.log(error))
    this.quantity = this.cartItem.reduce((total, currentItem) => total + currentItem.quantityProduct, 0);
    this.allPrice = this.cartItem.reduce((total, currentPrice) => total + currentPrice.price, 0);
    this.quantityAdditions = this.cartItem.reduce((total, quan) => total + quan.addition.reduce((innerTotal, addition) => innerTotal + addition.quantityAddition, 0), 0);
  }

  updateQuantity() {
    this.quantity = this.cartItem.reduce((total, currentItem) => total + currentItem.quantityProduct, 0);
    this.quantityAdditions = this.cartItem.reduce((total, quan) => total + quan.addition.reduce((innerTotal, addition) => innerTotal + addition.quantityAddition, 0), 0);
  };

  addProduct(product: Product) {
    const index = this.cartItem.findIndex(item => item.product.title === product.title);
    if (index !== -1) {
      this.cartItem[index].quantityProduct++;
      this.cartService.updateData(product, this.cartItem[index].quantityProduct);
      this.cartItem = this.cartService.visibleData();
    }
    this.updateQuantity()
    this.totalPrice();
  };

  removeProduct(selectedProduct: Product): any {
    const index = this.cartItem.findIndex(item => item.product.title === selectedProduct.title);
    if (index !== -1) {
      if (this.cartItem[index].quantityProduct > 1) {
        this.cartItem[index].quantityProduct--;
        this.cartService.updateData(selectedProduct, this.cartItem[index].quantityProduct);
        this.cartItem = this.cartService.visibleData();
      }
      else {
        this.cartService.removeProduct(selectedProduct)
        this.cartItem = this.cartService.visibleData();
      }
    }
    this.updateQuantity();
    this.totalPrice()
  };

  addAddition(selectedAddition: Addition) {
    const index = this.cartItem.findIndex(item => item.addition.some(addition => addition.addition_id === selectedAddition.addition_id));
    if (index !== -1) {
      this.cartItem[index].addition.forEach(addition => {
        if (addition.addition_id === selectedAddition.addition_id) {
          ++selectedAddition.quantityAddition;
          this.cartService.updateAddition(selectedAddition, selectedAddition.quantityAddition);
        }
      });
    }
    this.totalPrice();
  }

  removeAdditions(selectedAddition: Addition) {
    const index = this.cartItem.findIndex(item => item.addition.some(addition => addition.addition_id === selectedAddition.addition_id));
    if (index !== -1) {
      this.cartItem[index].addition.forEach(addition => {
        if (addition.addition_id === selectedAddition.addition_id) {
          selectedAddition.quantityAddition--;
          this.cartService.updateAddition(selectedAddition, selectedAddition.quantityAddition);
        }
      });
    }
    this.totalPrice();
  };

  totalPrice() {
    let dishPrice = 0;
    this.cartItem.forEach(item => {
      const productPrice = item.product.price * item.quantityProduct;
      let additionsPrice = 0;
      if (item.addition.length > 0) {
        additionsPrice = item.addition.reduce((total, addition) => {
          return total + (addition.addition_price * addition.quantityAddition);
        }, 0);
      }
      const totalProductPrice = productPrice + additionsPrice;
      dishPrice += totalProductPrice;
      this.cartService.updatePrice(item.product.title, productPrice, additionsPrice);
    });
    this.allPrice = dishPrice;
    this.cartService.saveSubtotal(this.allPrice);
  }

  close(selectedProduct: Product) {
    this.cartService.removeProduct(selectedProduct);
    this.cartItem = this.cartService.visibleData();
    this.totalPrice();
    if (this.cartItem.length === 0) this.quantity = 0;
  }

  onOrderMethodChange(event: any) {
    this.selectedOrderMethod = event.target.value;
  }

  proceedToCheckout() {
    if (this.selectedOrderMethod === 'on-site-ordering') this.checkReservation()
    else this.router.navigate(['/order'], { queryParams: { method: this.selectedOrderMethod } });
  }

  checkReservation() {
    const userInfo = localStorage.getItem('userData');
    if (userInfo) {
      const email = JSON.parse(userInfo).email
      this.http.post('http://localhost:3000/checkReservation', { email }).subscribe((response: any) => {
        if (response.reservationExists) this.router.navigate(['/order'], { queryParams: { method: 'on-site-ordering' } })
        else this.router.navigate(['/reservation'], { queryParams: { fromCart: true, method: 'on-site-ordering' } });
      },
        error => console.log(error)
      );
      return;
    }
    this.router.navigate(['/order'], { queryParams: { method: 'on-site-ordering' } });
  }

}