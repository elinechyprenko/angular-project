import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { KeyValuePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { GetDataService } from '../services/get-data.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AddToCartService } from '../services/add-to-cart.service';
import { Addition, CategoryWithProduct, Product } from '../cart/cart-item';
import { FooterService } from '../services/footer.service';
import { DEFAULT_FIXED_SIDE_BAR_BOTTOM, FIXED_SIDE_BAR_BOTTOM } from "../shared/values.constants";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf, KeyValuePipe, RouterOutlet, RouterLink, NgStyle],
  providers: [GetDataService, FooterService],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  data: CategoryWithProduct[] = [];
  additions: Addition[] = []
  imageUrl: string[] | null = null;
  isClicked = false;
  selectedProduct: any;
  quantity: number = 1;
  modalProductPrice: number = 0;
  allPrice: number = 0;
  additionTitle: string = '';
  quantityAddition: number = 0;
  additionsPrice = 0;
  selectedAdditions: Addition[] = [];
  postData = false;

  public fixedSideBarBottom: string = DEFAULT_FIXED_SIDE_BAR_BOTTOM;

  @ViewChild('category', { static: false }) category: ElementRef | undefined;
  @ViewChild('fixedSideBar') fixedSideBar: ElementRef<HTMLElement> | undefined;


  constructor(public http: HttpClient, public getData: GetDataService, public authService: AuthService, private router: Router,
    public cartService: AddToCartService, public footerService: FooterService) { }

  ngOnInit(): void {
    this.getData.getProduct().subscribe(res => this.data = res, error => console.log(error));
    this.getData.getImage().subscribe(res => this.imageUrl = res, error => console.log('Error', error));
    this.getData.getAdditions().subscribe(res => {
      this.additions = res.map(addition => { return { ...addition, quantityAddition: 0 }; });
    }, error => console.log(error));
    this.footerService.footerTop$.subscribe(footerTop => {
      const sideBarBottom = this.fixedSideBar?.nativeElement.getBoundingClientRect().bottom;
      if (!footerTop || !sideBarBottom) {
        this.fixedSideBarBottom = DEFAULT_FIXED_SIDE_BAR_BOTTOM;
        return;
      }
      if (footerTop < sideBarBottom + 25) {
        this.fixedSideBarBottom = FIXED_SIDE_BAR_BOTTOM;
        return;
      }
      if (footerTop > sideBarBottom + 250) {
        this.fixedSideBarBottom = DEFAULT_FIXED_SIDE_BAR_BOTTOM;
      }
    });
  };

  scrollToCategory(categoryTitle: string, index: number) {
    const categoryElement = document.getElementById(`category_${index}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  open(product: Product): void {
    this.isClicked = !this.isClicked;
    this.selectedProduct = product;
    this.quantity = 1;
    this.modalProductPrice = product.price
    this.allPrice = this.modalProductPrice
    this.quantityAddition = 0;

  }
  close() {
    this.isClicked = !this.isClicked;
    this.selectedProduct = null;
    this.quantity = 1;
  }

  selectAdditions(selectedProduct: Product): any {
    const foundAdditions = this.additions.filter(addition => {
      return addition.products.some(product => product.title === selectedProduct.title);
    });
    this.selectedAdditions = foundAdditions;
    return this.selectedAdditions;
  }

  addProduct(selectedProduct: Product) {
    if (this.quantity === undefined) this.quantity = 1;
    else this.quantity++;
    this.totalPrice(selectedProduct, null);
  };

  removeProduct(selectedProduct: Product): any {
    if (this.quantity > 1) this.quantity--;
    this.totalPrice(selectedProduct, null);
    return this.quantity;
  };


  addAddition(selectAdditions: Addition) {
    if (selectAdditions.addition_id && selectAdditions.addition_price !== null) {
      this.quantityAddition = ++selectAdditions.quantityAddition;
      this.totalPrice(this.selectedProduct, selectAdditions);
    }
  }

  removeAdditions(selectAdditions: Addition) {
    if (selectAdditions.quantityAddition > 0) {
      selectAdditions.quantityAddition--;
      this.totalPrice(this.selectedProduct, selectAdditions);
    }
  }

  totalPrice(product: Product, addition: Addition | null) {
    let productPrice = this.modalProductPrice;
    if (this.quantity >= 1) productPrice = parseFloat((product.price * this.quantity).toFixed(2));
    // перебираем! 
    if (addition && addition.addition_price) {
      this.additionsPrice = this.additions.reduce((total, addition) => {
        return total + (addition.addition_price * addition.quantityAddition);
      }, 0);
    }
    this.allPrice = this.additionsPrice + productPrice;
  };

  addToCart(product: Product) {
    if (this.authService.isLoggedIn) {
      const cartData = {
        product: product,
        price: this.allPrice,
        quantityProduct: this.quantity,
        addition: this.selectedAdditions,
      };
      this.cartService.addToCart(cartData);
      this.isClicked = false;
      this.postData = true;
      console.log(this.postData)
    }
    else {
      this.authService.redirectUrl = this.router.url;
      this.router.navigate(['sign_up']);
    }
  }

  backToMenu() {
    this.postData = false;
    this.isClicked = false;
  }
}
