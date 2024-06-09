import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from './user.class';
import { birthdayValidator, emailValidator, passwordMatchValidator, passwordValidator } from '../services/custom-validators';
import { FORM_ERROR, VALIDATION_MESSAGE } from './form-data';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetDataService } from '../services/get-data.service';
import { PostDataService } from '../services/post-data.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, HttpClientModule, RouterOutlet, RouterLink],
  providers: [GetDataService, PostDataService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  userForm: FormGroup | any = '';
  private user: User = new User('', '', null, null, '');
  formError = FORM_ERROR;
  validationMessage = VALIDATION_MESSAGE;
  userData: any = '';
  email: AbstractControl = new FormControl('');
  fullName: AbstractControl = new FormControl('');
  phone: AbstractControl = new FormControl('');
  birthday: AbstractControl = new FormControl('');
  password: AbstractControl = new FormControl('');
  confirmPassword: AbstractControl = new FormControl('');

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private getData: GetDataService,
    private postData: PostDataService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  };

  public buildForm(): void {
    this.userForm = this.formBuilder.group({
      email: [this.user.email, [Validators.required], [emailValidator]],
      fullName: [this.user.fullname, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      phone: [this.user.phone, [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      birthday: [this.user.birthday, [Validators.required], [birthdayValidator]],
      password: [this.user.password, [Validators.required], [passwordValidator]],
      confirmPassword: ['', [Validators.required], [passwordMatchValidator('password')]]
    })
    this.userForm?.valueChanges?.subscribe(() => this.onValueChanges());
    this.createControls();
  }

  createControls(): void {
    this.email = this.userForm.controls.email;
    this.fullName = this.userForm.controls.fullName;
    this.phone = this.userForm.controls.phone;
    this.birthday = this.userForm.controls.birthday;
    this.password = this.userForm.controls.password;
    this.confirmPassword = this.userForm.controls.confirmPassword;
  };

  public onValueChanges(): void {
    const form: any = this.userForm;
    for (const field in this.formError) {
      this.formError[field] = '';
      const control = form.get(field);
      // console.log(control)
      if (control && (control.dirty || control.touched) && control.invalid) {
        const validMessage = this.validationMessage[field];
        // console.log(validMessage);
        for (const key in control.errors) {
          for (const key in control.errors) {
            this.formError[field] = validMessage[key];
            break;
          }
        }
      }
    }
  };
  onSubmit(form: any): void {
    this.userData = form.value;
    this.getData.checkEmailExists(this.userData.email).subscribe((res) => {
      if (res) {
        console.log('email is already been!')
        this.email.setErrors({ 'emailExist': true })
      }
    });
    this.getData.checkPhoneExists(this.userData.phone).subscribe((res) => {
      if (res) {
        console.log('email is already been!');
        this.phone.setErrors({ 'phoneExist': true });
      }
      else {
        console.log('data post')
        this.saveUserData();
        this.authService.isLoggedIn = true;
        if (this.authService.redirectUrl) {
          this.router.navigate([this.authService.redirectUrl])
        }
        else {
          this.router.navigate(['/home'])
        }
      }
    })
  };

  saveUserData() {
    this.postData.postUser(this.userData)
  }


}
