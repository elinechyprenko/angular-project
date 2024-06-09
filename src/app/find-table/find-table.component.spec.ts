import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTableComponent } from './find-table.component';

describe('FindTableComponent', () => {
  let component: FindTableComponent;
  let fixture: ComponentFixture<FindTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
