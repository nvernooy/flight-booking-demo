import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { BaseComponent } from './layouts/base/base.component';
import { HomeComponent } from './layouts/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { BookFlightDialogComponent } from './search-form/book-flight-dialog/book-flight-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        BaseComponent,
        SearchFormComponent,
        HomeComponent,
        BookFlightDialogComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        FlexLayoutModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    entryComponents: [
        BookFlightDialogComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
