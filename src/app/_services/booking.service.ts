import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class BookingService {
    constructor() {}

    // store the booking in localstorage
    bookFlight(booking) {
        const bookings = this.listBookings()
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));
    }

    // return all bookings stored in localstorage
    listBookings(): any[] {
        if (localStorage.getItem("bookings")) {
            return JSON.parse(localStorage.getItem("bookings"));
        }
        return [];
    }
}
