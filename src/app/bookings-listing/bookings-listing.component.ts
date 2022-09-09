import { Component, OnInit } from '@angular/core';
import { BookingService } from '../_services/booking.service';

@Component({
    selector: 'app-bookings-listing',
    templateUrl: './bookings-listing.component.html',
    styleUrls: ['./bookings-listing.component.css']
})
export class BookingsListingComponent implements OnInit {

    bookings = [];

    constructor(private bookingService: BookingService) { }

    ngOnInit(): void {
        this.bookings = this.bookingService.listBookings();
    }

}
