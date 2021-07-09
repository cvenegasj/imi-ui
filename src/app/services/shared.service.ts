import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private isLoadingSubject$ = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoadingSubject$.asObservable();

    private appUserSubject$ = new BehaviorSubject<any>(undefined);
    appUser$ = this.appUserSubject$.asObservable();

    constructor() {}

    nextIsLoading(isLoading: boolean) {
        this.isLoadingSubject$.next(isLoading);
    }

    nextAppUser(user: any) {
        this.appUserSubject$.next(user);
    }

}