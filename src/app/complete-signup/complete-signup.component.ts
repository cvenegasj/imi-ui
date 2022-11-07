import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { concatMap, map, startWith } from 'rxjs/operators';

import { Academic, Client, Provider } from '../models/types';
import { AuthService } from '@auth0/auth0-angular';
import { ClientService } from '../services/client.service';
import { ProviderService } from '../services/provider.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { SharedService } from '../services/shared.service';
import { Util } from '../utils/util';
import { AcademicService } from '../services/academic.service';

@Component({
  selector: 'app-complete-signup',
  templateUrl: './complete-signup.component.html',
  styleUrls: ['./complete-signup.component.css']
})
export class CompleteSignupComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('stepper')
  stepper!: MatStepper;
  @ViewChild('industryInput') 
  industryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('countryInput') 
  countryInput!: ElementRef<HTMLInputElement>;

  firstFormGroup: FormGroup;
  //secondFormGroup: FormGroup;
  userType: string = '';

  countries: string[] = Util.COUNTRY_LIST;
  filteredCountries: Observable<string[]>;
  selectedCountries: string[] = [];

  industries: string[] = Util.INDUSTRY_LIST;
  filteredIndustries: Observable<string[]>;
  selectedIndustries: string[] = [];

  urls: string[] = [];

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private providerService: ProviderService,
    private academicService: AcademicService,
    private sharedService: SharedService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router
    )
    {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      secondCtrl: [''],
      thirdCtrl: [''],
      fourthCtrl: [''],
      fifthCtrl: [''],
      sixthCtrl: [''],
      seventhCtrl: [''],
      eighthCtrl: ['', Validators.required],
    });

    // this.secondFormGroup = this._formBuilder.group({
    //   slider1Ctrl: [3, Validators.required],
    //   slider2Ctrl: [3, Validators.required],
    //   slider3Ctrl: [3, Validators.required],
    //   slider4Ctrl: [3, Validators.required],
    //   slider5Ctrl: [3, Validators.required],
    //   slider6Ctrl: [3, Validators.required],
    //   slider7Ctrl: [3, Validators.required],
    //   slider8Ctrl: [3, Validators.required],
    //   slider9Ctrl: [3, Validators.required],
    //   slider10Ctrl: [3, Validators.required],
    //   slider11Ctrl: [3, Validators.required],
    //   slider12Ctrl: [3, Validators.required],
    //   slider13Ctrl: [3, Validators.required],
    //   slider14Ctrl: [3, Validators.required]
    // });

    // filters for autocomplete controls
    this.filteredCountries = this.firstFormGroup.get('sixthCtrl')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.filteredIndustries = this.firstFormGroup.get('seventhCtrl')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );
  }

  ngOnInit(): void {
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.industries.filter(option => option.toLowerCase().includes(filterValue));
  }

  public setUserType(type: string): void {
    this.userType = type;
    this.stepper.next();
  }

  selectCountry(event: MatAutocompleteSelectedEvent): void {
    this.selectedCountries.push(event.option.viewValue);
    this.countryInput.nativeElement.value = '';
    this.firstFormGroup.get('thirdCtrl')!.setValue('');
  }

  removeCountry(country: string): void {
    const index = this.selectedCountries.indexOf(country);
    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
    }
  }

  selectIndustry(event: MatAutocompleteSelectedEvent): void {
    this.selectedIndustries.push(event.option.viewValue);
    this.industryInput.nativeElement.value = '';
    this.firstFormGroup.get('fourthCtrl')!.setValue('');
  }

  removeIndustry(industry: string): void {
    const index = this.selectedIndustries.indexOf(industry);
    if (index >= 0) {
      this.selectedIndustries.splice(index, 1);
    }
  }

  addUrl(event: MatChipInputEvent): void {
    const input = event.chipInput?.inputElement;
    const value = event.value;
    // Add the new url
    if ((value || '').trim()) {
      this.urls.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeUrl(url: string): void {
    const index = this.urls.indexOf(url);

    if (index >= 0) {
      this.urls.splice(index, 1);
    }
  }

  finishSignUp(): void {
    if (this.userType === 'client') {
      this.auth.user$
        .pipe(
          concatMap(user => {
            let newClient = this.getClientObject();
            newClient.email = user!.email!;
            return this.clientService.create(newClient);
          })
        )
        .subscribe(c => {
          if (c) {
            //console.log(result);
            // imis
            for (let i = 0; i < c.imis.length; i++) {
              let tempMap = new Map();
              for (let [key, value] of Object.entries(c.imis[i].vars)) {
                tempMap.set(+key, value);
              }
              c.imis[i].vars = tempMap;
            }

            this.sharedService.nextAppUser(c as Client);
            this.router.navigate(['/dashboard']);
          } else {
            this._snackBar.open('An error occurred. Please, try again.', 'ok', {
              duration: 3000,
            });
          }
        });
    } else if (this.userType === 'provider') {
      this.auth.user$
        .pipe(
          concatMap(user => {
            let newProvider = this.getProviderObject();
            newProvider.email = user!.email!;
            return this.providerService.create(newProvider);
          })
        )
        .subscribe(p => {
          if (p) {
            //console.log(p);
            // provider's services
            let mapServices: Map<number, string[]> = new Map();
            for (let [key, value] of Object.entries(p.services)) {
              mapServices.set(+key, value);
            }
            p.services = mapServices;
            // imis
            for (let i = 0; i < p.imis.length; i++) {
              let tempMap = new Map();
              for (let [key, value] of Object.entries(p.imis[i].vars)) {
                tempMap.set(+key, value);
              }
              p.imis[i].vars = tempMap;
            }
      
            this.sharedService.nextAppUser(p as Provider);
            this.router.navigate(['/dashboard']);
          } else {
            this._snackBar.open('An error occurred. Please, try again.', 'ok', {
              duration: 3000,
            });
          }
        });
    } else { // academic
      this.auth.user$
        .pipe(
          concatMap(user => {
            let newAcademic = this.getAcademicObject();
            newAcademic.email = user!.email!;
            return this.academicService.create(newAcademic);
          })
        )
        .subscribe(a => {
          if (a) {
            //console.log(p);
            // imis
            for (let i = 0; i < a.imis.length; i++) {
              let tempMap = new Map();
              for (let [key, value] of Object.entries(a.imis[i].vars)) {
                tempMap.set(+key, value);
              }
              a.imis[i].vars = tempMap;
            }
      
            this.sharedService.nextAppUser(a as Academic);
            this.router.navigate(['/dashboard']);
          } else {
            this._snackBar.open('An error occurred. Please, try again.', 'ok', {
              duration: 3000,
            });
          }
        });
    }
  }

  getClientObject(): Client {
    const client = new Client();
    client.companyName = this.firstFormGroup.get('firstCtrl')!.value;
    client.description = this.firstFormGroup.get('secondCtrl')!.value;
    client.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    client.website = this.firstFormGroup.get('fourthCtrl')!.value;
    client.extraUrls = this.urls;
    client.countries = this.selectedCountries;
    client.industries = this.selectedIndustries;

    return client;
  }

  getProviderObject(): Provider {
    const provider = new Provider();
    provider.companyName = this.firstFormGroup.get('firstCtrl')!.value;
    provider.description = this.firstFormGroup.get('secondCtrl')!.value;
    provider.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    provider.website = this.firstFormGroup.get('fourthCtrl')!.value;
    provider.extraUrls = this.urls;
    provider.countries = this.selectedCountries;
    provider.industries = this.selectedIndustries;

    return provider;
  }

  getAcademicObject(): Academic {
    const academic = new Academic();
    academic.companyName = this.firstFormGroup.get('firstCtrl')!.value;
    academic.description = this.firstFormGroup.get('secondCtrl')!.value;
    academic.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    academic.website = this.firstFormGroup.get('fourthCtrl')!.value;
    academic.extraUrls = this.urls;
    academic.countries = this.selectedCountries;
    academic.type = this.firstFormGroup.get('eighthCtrl')!.value;

    return academic;
  }

}
