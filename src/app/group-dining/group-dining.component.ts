import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dining } from './dining.class';
import { emailValidator } from '../services/custom-validators';
import { DINING_ERROR, DINING_MESSAGE } from '../sign-up/form-data';
import { PostDataService } from '../services/post-data.service';

@Component({
  selector: 'app-group-dining',
  standalone: true,
  imports: [NgIf, RouterLink, RouterOutlet, ReactiveFormsModule, NgClass],
  providers: [AuthService, PostDataService],
  templateUrl: './group-dining.component.html',
  styleUrl: './group-dining.component.scss'
})
export class GroupDiningComponent {

  minDate: string = '';
  diningForm: FormGroup | any = '';
  private dining: Dining = new Dining('', '', null, '', '', '', null);

  formError = DINING_ERROR
  validationMessage = DINING_MESSAGE;

  email: AbstractControl = new FormControl('');
  fullName: AbstractControl = new FormControl('');
  phone: AbstractControl = new FormControl('');
  date: AbstractControl = new FormControl('');
  startTime: AbstractControl = new FormControl('');
  endTime: AbstractControl = new FormControl('');
  people: AbstractControl = new FormControl('');
  postData = false;

  constructor(public authService: AuthService, private fb: FormBuilder, private postService: PostDataService) {
    const currentDate = new Date();
    this.minDate = this.formatDate(currentDate);
  }
  ngOnInit() {
    this.formBuilder()
  }

  formBuilder() {
    this.diningForm = this.fb.group({
      email: [this.dining.email, [Validators.required], [emailValidator]],
      fullName: [this.dining.fullName, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      phone: [this.dining.phone, [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      date: [this.dining.date, [Validators.required]],
      startTime: [this.dining.startTime, [Validators.required]],
      endTime: [this.dining.endTime, [Validators.required]],
      people: [this.dining.people, [Validators.required, Validators.min(15)]],
      natureEvent: [this.dining.nature_event],
      info: [this.dining.info]
    })
    this.diningForm?.valueChanges?.subscribe(() => this.onValueChanges());
    this.createControls()
  }

  createControls(): void {
    this.email = this.diningForm.controls.email;
    this.fullName = this.diningForm.controls.fullName;
    this.phone = this.diningForm.controls.phone;
    this.date = this.diningForm.controls.date;
    this.startTime = this.diningForm.controls.startTime;
    this.endTime = this.diningForm.controls.endTime;
    this.people = this.diningForm.controls.people
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public onValueChanges(): void {
    const form: any = this.diningForm;
    for (const field in this.formError) {
      this.formError[field] = '';
      const control = form.get(field);
      if (control && (control.dirty || control.touched) && control.invalid) {
        const validMessage = this.validationMessage[field];
        for (const key in control.errors) {
          for (const key in control.errors) {
            this.formError[field] = validMessage[key];
            break;
          }
        }
      }
    }
  };

  onSubmit(form: FormGroup) {
    const formData = form.value;
    this.postService.postDining(formData).subscribe((res) => {
      this.postData = true;
    },
      (error) => console.log('Error', error)
    )
  }
}
