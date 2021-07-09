import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Client } from '../models/types';

@Injectable({
    providedIn: 'root',
})
export class ClientService {

    apiUrl: string = environment.resApiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient
    ) { }

    // create
    createClient(data: Client): Observable<Client> {
        let API_URL = `${this.apiUrl}/clients`;
        return this.http.post<Client>(API_URL, data)
            .pipe(
                catchError(this.error)
            );
    }

    // find
    findClient(email: string): Observable<Client> {
        let API_URL = `${this.apiUrl}/clients/${email}`;
        return this.http.get<Client>(API_URL);
    }

    // Handle Errors 
    error(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}