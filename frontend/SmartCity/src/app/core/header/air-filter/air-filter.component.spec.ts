import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirFilterComponent } from './air-filter.component';

describe('AirFilterComponent', () => {
  let component: AirFilterComponent;
  let fixture: ComponentFixture<AirFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
