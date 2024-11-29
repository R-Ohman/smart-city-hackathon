import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkFilterComponent } from './park-filter.component';

describe('ParkFilterComponent', () => {
  let component: ParkFilterComponent;
  let fixture: ComponentFixture<ParkFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
