import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Imi, Provider } from '../models/types';

@Injectable({
    providedIn: 'root',
})
export class ProviderService {

    apiUrl: string = environment.resApiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient
    ) { }

    // create
    create(data: Provider): Observable<Provider> {
        let API_URL = `${this.apiUrl}/providers`;
        return this.http.post<Provider>(API_URL, data)
            .pipe(
                catchError(this.error)
            );
    }

    // find
    find(email: string): Observable<Provider> {
        let API_URL = `${this.apiUrl}/providers/${email}`;
        return this.http.get<Provider>(API_URL);
    }

    // update provider
    update(p: Provider): Observable<Provider> {
        let API_URL = `${this.apiUrl}/providers/${p.id}`;
        return this.http.put<Provider>(API_URL, p, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // update provider's services
    updateServices(idProvider: string, services: Map<number, string[]>): Observable<Provider> {
        let API_URL = `${this.apiUrl}/providers/${idProvider}/update-services`;
        return this.http.put<Provider>(API_URL, Object.fromEntries(services), {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // update provider's imi
    updateImi(idProvider: string, vars: Map<number, number>): Observable<Provider> {
        let API_URL = `${this.apiUrl}/providers/${idProvider}/update-imi`;
        return this.http.put<Provider>(API_URL, Object.fromEntries(vars), {headers: this.headers})
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