import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';

import { BaseComponent } from './base.component';

describe('BaseComponent', () => {
    let component: BaseComponent;
    let fixture: ComponentFixture<BaseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BaseComponent],
            imports: [MaterialModule, BrowserAnimationsModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
