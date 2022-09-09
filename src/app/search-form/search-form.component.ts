import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, of } from "rxjs";
import { catchError, debounceTime, finalize, switchMap, tap } from "rxjs/operators";
import { BookingService } from '../_services/booking.service';
import { FlightSearchService } from '../_services/flight.search.service';
import { BookFlightDialogComponent } from './book-flight-dialog/book-flight-dialog.component';

export const arrivalDateRequired: ValidatorFn = (fg: FormGroup) => {
    if (fg.value.return && !fg.value.arrivalDate) {
        return { required: true };
    }
    return null;
};

@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

    public form: FormGroup;
    isLoading = false;
    filteredDepartureAirports: any[] = [];
    filteredArrivalAirports: any[] = [];

    departureFlights = [];
    arrivalFlights = [];

    today = new Date();
    maxDate = new Date();
    departureMessage = "";
    arrivalMessage = "";
    flightMessage = "";
    searching = false;

    departSelection: any;
    returnSelection: any;

    // component that handles searching for aiports and matching flights
    constructor(private fb: FormBuilder,
        private flightSearch: FlightSearchService,
        private bookingService: BookingService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) {
        // flight search api only allows up to 7 days search
        let result = new Date();
        result.setDate(result.getDate() + 6);
        this.maxDate = result;
    }

    ngOnInit(): void {
        // keep track of destination and flight data
        this.form = this.fb.group({
            departureAirport: [
                null,
                {
                    validators: Validators.required,
                },
            ],
            departureAirportData: null,
            departureDate: [
                null,
                {
                    validators: Validators.required,
                },
            ],
            departureFlight: null,
            return: false,
            arrivalAirport: [
                null,
                {
                    validators: Validators.required,
                },
            ],
            arrivalAirportData: null,
            arrivalDate:
                null
            ,
            arrivalFlight: null,
            passengers: [
                1,
                {
                    validators: Validators.required,
                },
            ],
        }, { validators: arrivalDateRequired });

        this.onFormChanges()
    }

    // search for the aiport using text matching and store result
    onFormChanges() {
        this.form
            .get("departureAirport")
            .valueChanges.pipe(
                debounceTime(300),
                tap(() => (this.isLoading = true)),
                switchMap((value) =>
                    this.getAirports(value, "departureAirportData").pipe(
                        catchError(error => {
                            this.departureMessage = error.error.message;
                            return EMPTY;
                        }),
                        finalize(() => (this.isLoading = false))
                    )
                )
            )
            .subscribe((resp) => (this.filteredDepartureAirports = resp["items"]));

        this.form
            .get("arrivalAirport")
            .valueChanges.pipe(
                debounceTime(300),
                tap(() => (this.isLoading = true)),
                switchMap((value) =>
                    this.getAirports(value, "arrivalAirportData").pipe(
                        catchError(error => {
                            this.arrivalMessage = error.error.message;
                            return EMPTY;
                        }),
                        finalize(() => (this.isLoading = false))
                    )
                )
            )
            .subscribe((resp) => (this.filteredArrivalAirports = resp["items"]));
    }

    getAirports(text, key) {
        this.departureMessage = "";
        this.arrivalMessage = "";

        if (!text) {
            return of([]);
        } else if (text.icao) {
            // value set, update
            this.form.controls[key].setValue(text);
            return of([]);
        } else {
            return this.flightSearch.searchAirports(text);
        }
    }

    displayAirportFn(airport?): string | undefined {
        return airport ? airport.shortName : undefined;
    }

    // search for flights matching the parameters
    searchFlights() {
        this.flightMessage = "";
        this.searching = true;
        const form = this.form.value;

        this.departureFlights = [];
        this.arrivalFlights = [];
        const departDateStart = this.formatDate(form.departureDate) + "T08:00";
        const departDateEnd = this.formatDate(form.departureDate) + "T20:00";

        this.flightSearch.searchFlights(form.departureAirportData.icao, departDateStart, departDateEnd, "Departure").subscribe(resp => {
            this.searching = false;
            this.departureFlights = resp["departures"];
        }, err => {
            this.flightMessage = "Error searching for flights";
            this.searching = false;
        });

        // if the user selected a return flight search for flights
        if (form.return) {
            const arriveDateStart = this.formatDate(form.arrivalDate) + "T08:00";
            const arriveDateEnd = this.formatDate(form.arrivalDate) + "T20:00";

            this.flightSearch.searchFlights(form.arrivalAirportData.icao, arriveDateStart, arriveDateEnd, "Departure").subscribe(resp => {
                this.arrivalFlights = resp["departures"];
            })
        }
    }

    // format date to string to match required format
    formatDate(date) {
        return date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
    }

    flightSelectionValid() {
        if (!this.departSelection) {
            return false;
        }
        const form = this.form.value;
        if (form.return) {
            return !!this.returnSelection;
        }
        return true
    }

    // track the flights the user selects in the listing
    toggleDepartFlight(flight) {
        if (this.departSelection && this.departSelection.number === flight.number) {
            this.departSelection = null;
        } else {
            this.departSelection = flight;
        }
    }

    toggleReturnFlight(flight) {
        if (this.returnSelection && this.returnSelection.number === flight.number) {
            this.returnSelection = null;
        } else {
            this.returnSelection = flight;
        }
    }

    // open the dialog to capture the user data to finalise the booking
    bookFlight() {
        const form = this.form.value;
        // save the user selection of their flight
        const dialogRef = this.dialog.open(BookFlightDialogComponent, {
            width: "550px",
            disableClose: true,
            data: {
                departureFlight: this.departSelection,
                returnFlight: this.returnSelection,
                departureAirport: form.departureAirportData,
                arrivalAirport: form.arrivalAirportData,
                passengers: form.passengers,
            },
        });

        // store the booking data and clear the form
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.bookingService.bookFlight(result);
                this.snackBar.open('Successfully booked your flight', "", { duration: 3000, panelClass: ['green-snackbar'] })
                this.form.reset();
                this.departSelection = null;
                this.returnSelection = null;
            }
        });

    }
}
