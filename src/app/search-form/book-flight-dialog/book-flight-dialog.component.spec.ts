import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';

import { BookFlightDialogComponent } from './book-flight-dialog.component';

describe('BookFlightDialogComponent', () => {
    let component: BookFlightDialogComponent;
    let fixture: ComponentFixture<BookFlightDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BookFlightDialogComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                MaterialModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                RouterTestingModule],
            providers: [
                    { provide: MatDialogRef, useValue: {} },
                    { provide: MAT_DIALOG_DATA, useValue: { } },
                ],

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
