import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenFilterDialogComponent } from './green-filter-dialog.component';

describe('GreenFilterDialogComponent', () => {
  let component: GreenFilterDialogComponent;
  let fixture: ComponentFixture<GreenFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenFilterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
