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
    create(data: Client): Observable<Client> {
        let API_URL = `${this.apiUrl}/clients`;
        return this.http.post<Client>(API_URL, data)
            .pipe(
                catchError(this.error)
            );
    }

    // find
    find(email: string): Observable<Client> {
        let API_URL = `${this.apiUrl}/clients/${email}`;
        return this.http.get<Client>(API_URL);
    }

    // update client
    update(p: Client): Observable<Client> {
        let API_URL = `${this.apiUrl}/clients/${p.id}`;
        return this.http.put<Client>(API_URL, p, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // update client's imi
    updateImi(idClient: string, vars: Map<number, number>): Observable<Client> {
        let API_URL = `${this.apiUrl}/clients/${idClient}/update-imi`;
        return this.http.put<Client>(API_URL, Object.fromEntries(vars), {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
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