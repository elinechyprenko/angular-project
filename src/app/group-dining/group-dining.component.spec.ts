import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDiningComponent } from './group-dining.component';

describe('GroupDiningComponent', () => {
  let component: GroupDiningComponent;
  let fixture: ComponentFixture<GroupDiningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDiningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupDiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
