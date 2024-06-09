import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Person } from './person.class';
import { emailValidator } from '../services/custom-validators';
import { RESERVATION_ERROR, RESERVATION_MESSAGE } from '../sign-up/form-data';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { PostDataService } from '../services/post-data.service';
import { ReservationStateService } from '../services/reservation-state.service';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, NgFor],
  providers: [PostDataService, ReservationStateService],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss'
})
export class ReservationDetailsComponent {

  @Input() table_id: number = 0;
  @Input() date: string = ''
  @Input() time: string = '';
  @Input() people: number = 0;
  @Output() bookingDetails = new EventEmitter<{ table_id: number, email: string, fullName: string, phone: string, date: string, time: string, people: number }>()

  userForm: FormGroup | any = '';
  person: Person = new Person('', '', null, '', '');
  formError = RESERVATION_ERROR;
  validationMessage = RESERVATION_MESSAGE;
  formData: any;

  email: AbstractControl = new FormControl('');
  fullName: AbstractControl = new FormControl('');
  phone: AbstractControl = new FormControl('');
  occasion: AbstractControl = new FormControl('');
  request: AbstractControl = new FormControl('')

  constructor(private formBuilder: FormBuilder, public postData: PostDataService, public reservationState: ReservationStateService) { }

  ngOnInit() {
    this.buildForm();
  }

  public buildForm(): void {
    this.userForm = this.formBuilder.group({
      fullName: [this.person.fullName, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      email: [this.person.email, [Validators.required], [emailValidator]],
      phone: [this.person.phone, [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      occasion: [this.person.occasion],
      request: [this.person.request]
    })
    this.userForm?.valueChanges?.subscribe(() => this.onValueChanges());
    this.createControls();
  }

  createControls(): void {
    this.email = this.userForm.controls.email;
    this.fullName = this.userForm.controls.fullName;
    this.phone = this.userForm.controls.phone;
  };

  public onValueChanges(): void {
    const form: any = this.userForm;
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
  onSubmit() {
    this.formData = {
      ...this.userForm.value,
      table_id: this.table_id,
      date: this.date,
      time: this.time,
      people: this.people,
    }
    this.booking();
    this.bookingDetails.emit({ table_id: this.table_id, email: this.userForm.value.email, fullName: this.userForm.value.fullName, phone: this.userForm.value.phone, date: this.date, time: this.time, people: this.people });
    this.reservationState.confirmReservation(this.formData);

  }

  booking() {
    this.postData.postReservation(this.formData).subscribe((res) => {
      if (res.status === 'available' || res.status === 'created') {
        this.formData.table_id = res.table_id;
      }
    },
      error => console.log(error));
  }
}
