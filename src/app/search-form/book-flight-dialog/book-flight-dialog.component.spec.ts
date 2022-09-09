import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFlightDialogComponent } from './book-flight-dialog.component';

describe('BookFlightDialogComponent', () => {
  let component: BookFlightDialogComponent;
  let fixture: ComponentFixture<BookFlightDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookFlightDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookFlightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
