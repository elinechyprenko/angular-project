import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Login } from './login.class';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userForm: FormGroup | any = '';
  loginForm: any = '';
  private login: Login = new Login('', '');

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formLogin();
  }

  public formLogin(): void {
    this.userForm = this.formBuilder.group({
      email: [this.login.email, [Validators.required]],
      password: [this.login.password, [Validators.required]],
    });
  }

  onSubmit(form: any) {
    this.loginForm = form.value;
    this.http.post('http://localhost:3000/login', this.loginForm).subscribe(
      (res: any) => {
        localStorage.setItem('userData', JSON.stringify(res.userData));
        // console.log(res.userData)
        if (localStorage.getItem('userData')) {
          this.authService.isLoggedIn = true;
          console.log(this.authService.isLoggedIn);
        }

        if (this.authService.redirectUrl) {
          this.router.navigate([this.authService.redirectUrl]);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
