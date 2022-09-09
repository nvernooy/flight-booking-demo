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

    departureFlights = [
        {
            "movement": {
                "airport": {
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 09:00+02:00",
                "scheduledTimeUtc": "2022-09-12 07:00Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "5Z 811",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Bombardier CRJ900"
            },
            "airline": {
                "name": "CemAir"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAHS",
                    "iata": "HDS",
                    "name": "Hoedspruit"
                },
                "scheduledTimeLocal": "2022-09-12 09:30+02:00",
                "scheduledTimeUtc": "2022-09-12 07:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "5Z 1812",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Bombardier CRJ"
            },
            "airline": {
                "name": "CemAir"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAHS",
                    "iata": "HDS",
                    "name": "Hoedspruit"
                },
                "scheduledTimeLocal": "2022-09-12 10:40+02:00",
                "scheduledTimeUtc": "2022-09-12 08:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 657",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAKM",
                    "iata": "KIM",
                    "name": "Kimberley"
                },
                "scheduledTimeLocal": "2022-09-12 15:25+02:00",
                "scheduledTimeUtc": "2022-09-12 13:25Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 617",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer Pheom 300"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "EGLL",
                    "iata": "LHR",
                    "name": "London"
                },
                "scheduledTimeLocal": "2022-09-12 19:05+02:00",
                "scheduledTimeUtc": "2022-09-12 17:05Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "BA 58",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 777"
            },
            "airline": {
                "name": "British Airways"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALA",
                    "iata": "HLA",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 11:40+02:00",
                "scheduledTimeUtc": "2022-09-12 09:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 306",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALA",
                    "iata": "HLA",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 17:30+02:00",
                "scheduledTimeUtc": "2022-09-12 15:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 316",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "EDDF",
                    "iata": "FRA",
                    "name": "Frankfurt-am-Main"
                },
                "scheduledTimeLocal": "2022-09-12 17:45+02:00",
                "scheduledTimeUtc": "2022-09-12 15:45Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "LH 577",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A340-300"
            },
            "airline": {
                "name": "Lufthansa"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALE",
                    "iata": "DUR",
                    "name": "Durban"
                },
                "scheduledTimeLocal": "2022-09-12 10:15+02:00",
                "scheduledTimeUtc": "2022-09-12 08:15Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 463",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-400"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALE",
                    "iata": "DUR",
                    "name": "Durban"
                },
                "scheduledTimeLocal": "2022-09-12 11:10+02:00",
                "scheduledTimeUtc": "2022-09-12 09:10Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 162",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-400"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALE",
                    "iata": "DUR",
                    "name": "Durban"
                },
                "scheduledTimeLocal": "2022-09-12 12:25+02:00",
                "scheduledTimeUtc": "2022-09-12 10:25Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "5Z 992",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Bombardier CRJ"
            },
            "airline": {
                "name": "CemAir"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALE",
                    "iata": "DUR",
                    "name": "Durban"
                },
                "scheduledTimeLocal": "2022-09-12 13:50+02:00",
                "scheduledTimeUtc": "2022-09-12 11:50Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 170",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALE",
                    "iata": "DUR",
                    "name": "Durban"
                },
                "scheduledTimeLocal": "2022-09-12 16:45+02:00",
                "scheduledTimeUtc": "2022-09-12 14:45Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 461",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALE",
                    "iata": "DUR",
                    "name": "Durban"
                },
                "scheduledTimeLocal": "2022-09-12 17:50+02:00",
                "scheduledTimeUtc": "2022-09-12 15:50Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "5Z 994",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Bombardier CRJ900"
            },
            "airline": {
                "name": "CemAir"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAKN",
                    "iata": "MQP",
                    "name": "Mpumalanga"
                },
                "scheduledTimeLocal": "2022-09-12 10:25+02:00",
                "scheduledTimeUtc": "2022-09-12 08:25Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 663",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 08:10+02:00",
                "scheduledTimeUtc": "2022-09-12 06:10Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "5Z 821",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Bombardier Dash 8 Q400 / DHC-8-400"
            },
            "airline": {
                "name": "CemAir"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 08:55+02:00",
                "scheduledTimeUtc": "2022-09-12 06:55Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "SA 316",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A319"
            },
            "airline": {
                "name": "South African Airways"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 08:50+02:00",
                "scheduledTimeUtc": "2022-09-12 06:50Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 201",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 09:50+02:00",
                "scheduledTimeUtc": "2022-09-12 07:50Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "W2 2002",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A320"
            },
            "airline": {
                "name": "FlexFlight"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 10:10+02:00",
                "scheduledTimeUtc": "2022-09-12 08:10Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 299",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 10:55+02:00",
                "scheduledTimeUtc": "2022-09-12 08:55Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "SA 332",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A320"
            },
            "airline": {
                "name": "South African Airways"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 10:40+02:00",
                "scheduledTimeUtc": "2022-09-12 08:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "SQ 479",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A350-900"
            },
            "airline": {
                "name": "Singapore"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 11:30+02:00",
                "scheduledTimeUtc": "2022-09-12 09:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 112",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 09:20+02:00",
                "scheduledTimeUtc": "2022-09-12 07:20Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 902",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FALE",
                    "iata": "DUR",
                    "name": "Durban"
                },
                "scheduledTimeLocal": "2022-09-12 19:40+02:00",
                "scheduledTimeUtc": "2022-09-12 17:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 465",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-400"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 13:30+02:00",
                "scheduledTimeUtc": "2022-09-12 11:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "W2 2012",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A320"
            },
            "airline": {
                "name": "FlexFlight"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 14:45+02:00",
                "scheduledTimeUtc": "2022-09-12 12:45Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 203",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 15:15+02:00",
                "scheduledTimeUtc": "2022-09-12 13:15Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 920",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 15:45+02:00",
                "scheduledTimeUtc": "2022-09-12 13:45Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "5Z 807",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Bombardier CRJ"
            },
            "airline": {
                "name": "CemAir"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 15:30+02:00",
                "scheduledTimeUtc": "2022-09-12 13:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "SA 346",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A340-300"
            },
            "airline": {
                "name": "South African Airways"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 16:25+02:00",
                "scheduledTimeUtc": "2022-09-12 14:25Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 114",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 16:40+02:00",
                "scheduledTimeUtc": "2022-09-12 14:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 120",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 13:40+02:00",
                "scheduledTimeUtc": "2022-09-12 11:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 295",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 17:45+02:00",
                "scheduledTimeUtc": "2022-09-12 15:45Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 102",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-400"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 17:00+02:00",
                "scheduledTimeUtc": "2022-09-12 15:00Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "SA 354",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A320"
            },
            "airline": {
                "name": "South African Airways"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 17:55+02:00",
                "scheduledTimeUtc": "2022-09-12 15:55Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 898",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 16:30+02:00",
                "scheduledTimeUtc": "2022-09-12 14:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "W2 2004",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A320"
            },
            "airline": {
                "name": "FlexFlight"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 14:00+02:00",
                "scheduledTimeUtc": "2022-09-12 12:00Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 896",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 14:15+02:00",
                "scheduledTimeUtc": "2022-09-12 12:15Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "5Z 813",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Bombardier CRJ"
            },
            "airline": {
                "name": "CemAir"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAPE",
                    "iata": "PLZ",
                    "name": "Port Elizabeth"
                },
                "scheduledTimeLocal": "2022-09-12 12:10+02:00",
                "scheduledTimeUtc": "2022-09-12 10:10Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 130",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAPE",
                    "iata": "PLZ",
                    "name": "Port Elizabeth"
                },
                "scheduledTimeLocal": "2022-09-12 17:25+02:00",
                "scheduledTimeUtc": "2022-09-12 15:25Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 675",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAPE",
                    "iata": "PLZ",
                    "name": "Port Elizabeth"
                },
                "scheduledTimeLocal": "2022-09-12 16:55+02:00",
                "scheduledTimeUtc": "2022-09-12 14:55Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 132",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-400"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FASZ",
                    "iata": "SZK",
                    "name": "Skukuza"
                },
                "scheduledTimeLocal": "2022-09-12 10:35+02:00",
                "scheduledTimeUtc": "2022-09-12 08:35Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 651",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer Pheom 300"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FBMN",
                    "iata": "MUB",
                    "name": "Maun"
                },
                "scheduledTimeLocal": "2022-09-12 10:35+02:00",
                "scheduledTimeUtc": "2022-09-12 08:35Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 314",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer RJ140"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FVFA",
                    "iata": "VFA",
                    "name": "Victoria Falls"
                },
                "scheduledTimeLocal": "2022-09-12 09:45+02:00",
                "scheduledTimeUtc": "2022-09-12 07:45Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 390",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer Pheom 300"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FVFA",
                    "iata": "VFA",
                    "name": "Victoria Falls"
                },
                "scheduledTimeLocal": "2022-09-12 14:30+02:00",
                "scheduledTimeUtc": "2022-09-12 12:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "KQ 793",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "Kenya Airways"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FVHA",
                    "iata": "HRE",
                    "name": "Harare"
                },
                "scheduledTimeLocal": "2022-09-12 10:30+02:00",
                "scheduledTimeUtc": "2022-09-12 08:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 382",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FYWB",
                    "iata": "WVB",
                    "name": "Walvis Bay"
                },
                "scheduledTimeLocal": "2022-09-12 14:00+02:00",
                "scheduledTimeUtc": "2022-09-12 12:00Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 348",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer Pheom 300"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FYWH",
                    "iata": "WDH",
                    "name": "Windhoek"
                },
                "scheduledTimeLocal": "2022-09-12 10:45+02:00",
                "scheduledTimeUtc": "2022-09-12 08:45Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "4Z 326",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer 190"
            },
            "airline": {
                "name": "South African Airlink"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FYWH",
                    "iata": "WDH",
                    "name": "Windhoek"
                },
                "scheduledTimeLocal": "2022-09-12 11:30+02:00",
                "scheduledTimeUtc": "2022-09-12 09:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "WV 913",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Embraer RJ145"
            },
            "airline": {
                "name": "Aero VIP (SevenAir)"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 18:55+02:00",
                "scheduledTimeUtc": "2022-09-12 16:55Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 217",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-800"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 19:40+02:00",
                "scheduledTimeUtc": "2022-09-12 17:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "FA 215",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 737-400"
            },
            "airline": {
                "name": "Safair"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "FAOR",
                    "iata": "JNB",
                    "name": "Jo'anna"
                },
                "scheduledTimeLocal": "2022-09-12 19:30+02:00",
                "scheduledTimeUtc": "2022-09-12 17:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "SA 372",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Airbus A320"
            },
            "airline": {
                "name": "South African Airways"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "KEWR",
                    "iata": "EWR",
                    "name": "Newark"
                },
                "scheduledTimeLocal": "2022-09-12 19:40+02:00",
                "scheduledTimeUtc": "2022-09-12 17:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "UA 1123",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 787-9"
            },
            "airline": {
                "name": "United"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "LTFM",
                    "iata": "IST",
                    "name": "Istanbul"
                },
                "scheduledTimeLocal": "2022-09-12 17:30+02:00",
                "scheduledTimeUtc": "2022-09-12 15:30Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "TK 45",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 787-9"
            },
            "airline": {
                "name": "Turkish"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "OMDB",
                    "iata": "DXB",
                    "name": "Dubai City"
                },
                "scheduledTimeLocal": "2022-09-12 18:20+02:00",
                "scheduledTimeUtc": "2022-09-12 16:20Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "EK 771",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 777-300ER"
            },
            "airline": {
                "name": "Emirates"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "HAAB",
                    "iata": "ADD",
                    "name": "Addis Ababa"
                },
                "scheduledTimeLocal": "2022-09-12 14:35+02:00",
                "scheduledTimeUtc": "2022-09-12 12:35Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "ET 846",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 777-200LR"
            },
            "airline": {
                "name": "Ethiopian"
            }
        },
        {
            "movement": {
                "airport": {
                    "icao": "OTHH",
                    "iata": "DOH",
                    "name": "Doha"
                },
                "scheduledTimeLocal": "2022-09-12 19:40+02:00",
                "scheduledTimeUtc": "2022-09-12 17:40Z",
                "quality": [
                    "Basic"
                ]
            },
            "number": "QR 1370",
            "status": "Unknown",
            "codeshareStatus": "Unknown",
            "isCargo": false,
            "aircraft": {
                "model": "Boeing 777-300ER"
            },
            "airline": {
                "name": "Qatar Airways"
            }
        }
    ];
    arrivalFlights = [{
        "movement": {
            "airport": {
                "icao": "FAOR",
                "iata": "JNB",
                "name": "Jo'anna"
            },
            "scheduledTimeLocal": "2022-09-12 19:40+02:00",
            "scheduledTimeUtc": "2022-09-12 17:40Z",
            "quality": [
                "Basic"
            ]
        },
        "number": "FA 215",
        "status": "Unknown",
        "codeshareStatus": "Unknown",
        "isCargo": false,
        "aircraft": {
            "model": "Boeing 737-400"
        },
        "airline": {
            "name": "Safair"
        }
    },
    {
        "movement": {
            "airport": {
                "icao": "FAOR",
                "iata": "JNB",
                "name": "Jo'anna"
            },
            "scheduledTimeLocal": "2022-09-12 19:30+02:00",
            "scheduledTimeUtc": "2022-09-12 17:30Z",
            "quality": [
                "Basic"
            ]
        },
        "number": "SA 372",
        "status": "Unknown",
        "codeshareStatus": "Unknown",
        "isCargo": false,
        "aircraft": {
            "model": "Airbus A320"
        },
        "airline": {
            "name": "South African Airways"
        }
    },
    {
        "movement": {
            "airport": {
                "icao": "KEWR",
                "iata": "EWR",
                "name": "Newark"
            },
            "scheduledTimeLocal": "2022-09-12 19:40+02:00",
            "scheduledTimeUtc": "2022-09-12 17:40Z",
            "quality": [
                "Basic"
            ]
        },
        "number": "UA 1123",
        "status": "Unknown",
        "codeshareStatus": "Unknown",
        "isCargo": false,
        "aircraft": {
            "model": "Boeing 787-9"
        },
        "airline": {
            "name": "United"
        }
    },
    {
        "movement": {
            "airport": {
                "icao": "LTFM",
                "iata": "IST",
                "name": "Istanbul"
            },
            "scheduledTimeLocal": "2022-09-12 17:30+02:00",
            "scheduledTimeUtc": "2022-09-12 15:30Z",
            "quality": [
                "Basic"
            ]
        },
        "number": "TK 45",
        "status": "Unknown",
        "codeshareStatus": "Unknown",
        "isCargo": false,
        "aircraft": {
            "model": "Boeing 787-9"
        },
        "airline": {
            "name": "Turkish"
        }
    },
    {
        "movement": {
            "airport": {
                "icao": "OMDB",
                "iata": "DXB",
                "name": "Dubai City"
            },
            "scheduledTimeLocal": "2022-09-12 18:20+02:00",
            "scheduledTimeUtc": "2022-09-12 16:20Z",
            "quality": [
                "Basic"
            ]
        },
        "number": "EK 771",
        "status": "Unknown",
        "codeshareStatus": "Unknown",
        "isCargo": false,
        "aircraft": {
            "model": "Boeing 777-300ER"
        },
        "airline": {
            "name": "Emirates"
        }
    },
    {
        "movement": {
            "airport": {
                "icao": "HAAB",
                "iata": "ADD",
                "name": "Addis Ababa"
            },
            "scheduledTimeLocal": "2022-09-12 14:35+02:00",
            "scheduledTimeUtc": "2022-09-12 12:35Z",
            "quality": [
                "Basic"
            ]
        },
        "number": "ET 846",
        "status": "Unknown",
        "codeshareStatus": "Unknown",
        "isCargo": false,
        "aircraft": {
            "model": "Boeing 777-200LR"
        },
        "airline": {
            "name": "Ethiopian"
        }
    },
    {
        "movement": {
            "airport": {
                "icao": "OTHH",
                "iata": "DOH",
                "name": "Doha"
            },
            "scheduledTimeLocal": "2022-09-12 19:40+02:00",
            "scheduledTimeUtc": "2022-09-12 17:40Z",
            "quality": [
                "Basic"
            ]
        },
        "number": "QR 1370",
        "status": "Unknown",
        "codeshareStatus": "Unknown",
        "isCargo": false,
        "aircraft": {
            "model": "Boeing 777-300ER"
        },
        "airline": {
            "name": "Qatar Airways"
        }
    }
    ];

    today = new Date();
    departureMessage = "";
    arrivalMessage = "";
    flightMessage = "";
    searching = false;

    departSelection: any;
    returnSelection: any;

    constructor(private fb: FormBuilder,
        private flightSearch: FlightSearchService,
        private bookingService: BookingService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {

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
            console.log(resp["departures"])
            this.departureFlights = resp["departures"];
        }, err => {
            this.flightMessage = "Error searching for flights";
            this.searching = false;
        });

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
            }
        });

    }
}
