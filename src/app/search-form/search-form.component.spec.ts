import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
    let component: SearchFormComponent;
    let fixture: ComponentFixture<SearchFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchFormComponent],
            imports: [FormsModule,
                ReactiveFormsModule,
                MaterialModule,
                BrowserAnimationsModule,
                HttpClientTestingModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
