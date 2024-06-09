import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { ReservationComponent } from './reservation/reservation.component';
import { GroupDiningComponent } from './group-dining/group-dining.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { AccountComponent } from './account/account.component';
import { OrderComponent } from './order/order.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'menu', component: MenuComponent},
    {path: 'reservation', component: ReservationComponent},
    {path: 'group_dining', component: GroupDiningComponent},
    {path: 'cart', component: CartComponent},
    {path: 'contact_us', component: ContactUsComponent},
    {path: 'sign_up', component: SignUpComponent},
    {path: 'login', component: LoginComponent},
    {path: 'account', component: AccountComponent},
    {path: 'order', component: OrderComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];
