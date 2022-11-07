import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Academic } from '../models/types';

@Injectable({
    providedIn: 'root',
})
export class AcademicService {

    apiUrl: string = environment.resApiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient
    ) { }

    // create
    create(data: Academic): Observable<Academic> {
        let API_URL = `${this.apiUrl}/academics`;
        return this.http.post<Academic>(API_URL, data)
            .pipe(
                catchError(this.error)
            );
    }

    // find
    find(email: string): Observable<Academic> {
        let API_URL = `${this.apiUrl}/academics/${email}`;
        return this.http.get<Academic>(API_URL);
    }

    // update academic
    update(p: Academic): Observable<Academic> {
        let API_URL = `${this.apiUrl}/academics/${p.id}`;
        return this.http.put<Academic>(API_URL, p, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // update academic's services
    updateServices(idAcademic: string, services: Map<number, string[]>): Observable<Academic> {
        let API_URL = `${this.apiUrl}/academics/${idAcademic}/update-services`;
        return this.http.put<Academic>(API_URL, Object.fromEntries(services), {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // update academic's imi
    updateImi(idAcademic: string, vars: Map<number, number>): Observable<Academic> {
        let API_URL = `${this.apiUrl}/academics/${idAcademic}/update-imi`;
        return this.http.put<Academic>(API_URL, Object.fromEntries(vars), {headers: this.headers})
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