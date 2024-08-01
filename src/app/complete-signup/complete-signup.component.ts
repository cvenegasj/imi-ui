import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { concatMap, map, startWith } from 'rxjs/operators';

import { Academic, Client, Provider } from '../models/types';
import { AuthService } from '@auth0/auth0-angular';
import { ClientService } from '../services/client.service';
import { ProviderService } from '../services/provider.service';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
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
      eighthCtrl: [''],
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

  addUrl(event: any): void {
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
            const user: Client = new Client(c);

            // imis
            for (let i = 0; i < user.imis.length; i++) {
              let tempMap = new Map();
              for (let [key, value] of Object.entries(user.imis[i].vars)) {
                tempMap.set(+key, value);
              }
              user.imis[i].vars = tempMap;
            }

            this.sharedService.nextAppUser(user);
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
            const user: Provider = new Provider(p);

            // provider's services
            let mapServices: Map<number, string[]> = new Map();
            for (let [key, value] of Object.entries(user.services)) {
              mapServices.set(+key, value);
            }
            user.services = mapServices;
            // imis
            for (let i = 0; i < user.imis.length; i++) {
              let tempMap = new Map();
              for (let [key, value] of Object.entries(user.imis[i].vars)) {
                tempMap.set(+key, value);
              }
              user.imis[i].vars = tempMap;
            }
      
            this.sharedService.nextAppUser(user);
            this.router.navigate(['/dashboard']);
          } else {
            this._snackBar.open('An error occurred. Please, try again.', 'ok', {
              duration: 3000,
            });
          }
        });
    } else { // academic
      console.log('academic user');

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
            const user: Academic = new Academic(a);

            // imis
            for (let i = 0; i < user.imis.length; i++) {
              let tempMap = new Map();
              for (let [key, value] of Object.entries(user.imis[i].vars)) {
                tempMap.set(+key, value);
              }
              user.imis[i].vars = tempMap;
            }
      
            this.sharedService.nextAppUser(user);
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
    const data: any = {};
    data.companyName = this.firstFormGroup.get('firstCtrl')!.value;
    data.description = this.firstFormGroup.get('secondCtrl')!.value;
    data.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    data.website = this.firstFormGroup.get('fourthCtrl')!.value;
    data.extraUrls = this.urls;
    data.countries = this.selectedCountries;
    data.industries = this.selectedIndustries;

    return new Client(data);
  }

  getProviderObject(): Provider {
    const data: any = {};
    data.companyName = this.firstFormGroup.get('firstCtrl')!.value;
    data.description = this.firstFormGroup.get('secondCtrl')!.value;
    data.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    data.website = this.firstFormGroup.get('fourthCtrl')!.value;
    data.extraUrls = this.urls;
    data.countries = this.selectedCountries;
    data.industries = this.selectedIndustries;

    return new Provider(data);
  }

  getAcademicObject(): Academic {
    const data: any = {};
    data.companyName = this.firstFormGroup.get('firstCtrl')!.value;
    data.description = this.firstFormGroup.get('secondCtrl')!.value;
    data.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    data.website = this.firstFormGroup.get('fourthCtrl')!.value;
    data.extraUrls = this.urls;
    data.countries = this.selectedCountries;
    data.type = this.firstFormGroup.get('eighthCtrl')!.value;

    return new Academic(data);
  }

}
