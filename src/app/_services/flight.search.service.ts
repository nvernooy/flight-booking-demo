import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const headerData = {
    'X-RapidAPI-Key': '1f115353afmshb02ecd3d3feb3b6p1fc9f2jsnfc2bfbc3c704',
    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
}

@Injectable({
    providedIn: "root",
})
export class FlightSearchService {
    constructor(private http: HttpClient) {}

    searchAirports(text: string) {
        const params = {q: text};
        const headers = new HttpHeaders(headerData);

        return this.http.get<any>('https://aerodatabox.p.rapidapi.com/airports/search/term', {headers, params});
    }

    searchFlights(icao: string, fromLocal: string, toLocal: string, direction: string) {
        const params = { direction };
        const headers = new HttpHeaders(headerData);

        return this.http.get<any[]>(`https://aerodatabox.p.rapidapi.com/flights/airports/icao/${icao}/${fromLocal}/${toLocal}`, {headers, params});
    }
}
