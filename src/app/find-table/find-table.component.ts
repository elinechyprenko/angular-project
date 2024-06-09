import { NgFor, NgIf, Time } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationStateService } from '../services/reservation-state.service';
import { PostDataService } from '../services/post-data.service';

@Component({
  selector: 'app-find-table',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [ReservationStateService, PostDataService],
  templateUrl: './find-table.component.html',
  styleUrl: './find-table.component.scss'
})
export class FindTableComponent {

  peopleOptions: { value: number, label: string }[] = []
  minDate: string = '';
  maxDate: string = '';
  hours: string[] = [];
  selectedPeople: number = 0;
  selectedDate: string = ''
  selectedTime: string = '';
  @Output() tableFound = new EventEmitter<{ table_id: number, date: string, time: string, people: number }>()

  constructor(public reservationState: ReservationStateService, private postService: PostDataService) {
    const currentDate = new Date();
    this.minDate = this.formatDate(currentDate);
    currentDate.setDate(currentDate.getDate() + 21);
    this.maxDate = this.formatDate(currentDate);
  }

  ngOnInit(): void {
    this.initializePeopleOptions();
    this.time();
  };

  initializePeopleOptions() {
    for (let i = 1; i <= 20; i++) {
      this.peopleOptions.push({ value: i, label: `${i} ${i > 1 ? 'people' : 'person'}` })
    }
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  time() {
    for (let hour = 19; hour <= 22; hour++) {
      for (let minute of ['00', '30']) {
        this.hours.push(`${hour}:${minute}`)
      }
    }
  };

  isFormValid(): boolean {
    return this.selectedPeople > 0 && this.selectedDate !== '' && this.selectedTime !== '';
  };

  findTable() {
    const dataToSend = {
      people: this.selectedPeople,
      time: this.selectedTime,
      date: this.selectedDate
    }
    this.postService.postTable(dataToSend).subscribe((res: any) => {
      if (res.status === 'available' || res.status === 'created') {
        this.tableFound.emit({ table_id: res.table_id, date: this.selectedDate, time: this.selectedTime, people: this.selectedPeople });
      }
      else if (res.status === 'busy') alert('The table is busy at the selected date and time. Please choose another time or date.')
      else console.log('Unexpected status:', res.status);
    }, error => console.log(error))
  };

}
