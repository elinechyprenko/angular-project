import { Injectable } from '@angular/core';
import { Addition, CartItem, Product } from '../cart/cart-item';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  cartItems: CartItem[] = [];
  productData: string | null = localStorage.getItem('dataProduct');

  constructor() {
    if (this.productData) {
      this.cartItems = JSON.parse(this.productData);
    }
  }

  addToCart(data: CartItem) {
    const existingDataString = localStorage.getItem('dataProduct');
    const existingData = existingDataString ? JSON.parse(existingDataString) : []
    existingData.push(data);
    localStorage.setItem('dataProduct', JSON.stringify(existingData));
    console.log(existingData)
  }

  removeProduct(cartItem: Product) {
    const index = this.cartItems.findIndex(item => item.product.title === cartItem.title);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      localStorage.setItem('dataProduct', JSON.stringify(this.cartItems));
    }
  };
  updateData(product: Product, quantity: number) {
    const index = this.cartItems.findIndex(item => item.product.title === product.title);
    if (index !== -1) {
      this.cartItems[index].quantityProduct = quantity;
      localStorage.setItem('dataProduct', JSON.stringify(this.cartItems));
    }
  }

  updateAddition(addition: Addition, quantity: number) {
    const cartItemIndex = this.cartItems.findIndex(item => item.addition.some(a => a.addition_id === addition.addition_id));
    if (cartItemIndex !== -1) {
      const additionIndex = this.cartItems[cartItemIndex].addition.findIndex(a => a.addition_id === addition.addition_id);
      if (additionIndex !== -1) {
        this.cartItems[cartItemIndex].addition[additionIndex].quantityAddition = quantity;
        localStorage.setItem('dataProduct', JSON.stringify(this.cartItems));
      }
    }
  }

  updatePrice(title: string, productPrice: number, additionPrice: number) {
    const index = this.cartItems.findIndex(item => item.product.title === title);
    if (index !== -1) {
      this.cartItems[index].price = productPrice + additionPrice;
      localStorage.setItem('dataProduct', JSON.stringify(this.cartItems));
    }
  }

  saveSubtotal(subtotal: number) {
    localStorage.setItem('subtotal', subtotal.toString())
  }

  visibleData() {
    return this.cartItems;
  }

  clearLocalStorage() {
    localStorage.removeItem('dataProduct')
  }

}

