import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingsListingComponent } from './bookings-listing/bookings-listing.component';
import { BaseComponent } from './layouts/base/base.component';
import { HomeComponent } from './layouts/home/home.component';
import { SearchFormComponent } from './search-form/search-form.component';

const routes: Routes = [
    {
        path: "",
        component: BaseComponent,
        children: [
            {
                path: "",
                component: HomeComponent,
            },
            {
                path: "flights",
                component: SearchFormComponent,
            },
            {
                path: "bookings",
                component: BookingsListingComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
