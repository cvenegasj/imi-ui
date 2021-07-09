import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { concatMap, map, startWith } from 'rxjs/operators';

import { Client, Provider } from '../models/types';
import { AuthService } from '@auth0/auth0-angular';
import { ClientService } from '../services/client.service';
import { ProviderService } from '../services/provider.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { SharedService } from '../services/shared.service';

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
  secondFormGroup: FormGroup;
  userType: string = '';

  countries: string[] = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 
    'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 
    'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 
    'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 
    'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 
    'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 
    'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 
    'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 
    'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 
    'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 
    'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 
    'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 
    '{Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 
    'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 
    'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 
    'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 
    'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 
    'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 
    'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 
    'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
    'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 
    'Zambia', 'Zimbabwe'];
  filteredCountries: Observable<string[]>;
  selectedCountries: string[] = [];

  // List source: https://corporatefinanceinstitute.com/resources/knowledge/finance/the-sp-sectors/
  industries: string[] = ['Information Technology', 'Health Care', 'Financials', 'Consumer Discretionary', 
    'Communication Services', 'Industrials', 'Consumer Staples', 'Energy', 'Utilities', 'Real Estate', 'Materials', 'Others'];
  filteredIndustries: Observable<string[]>;
  selectedIndustries: string[] = [];

  urls: string[] = [];

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private providerService: ProviderService,
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
    });

    this.secondFormGroup = this._formBuilder.group({
      slider1Ctrl: [3, Validators.required],
      slider2Ctrl: [3, Validators.required],
      slider3Ctrl: [3, Validators.required],
      slider4Ctrl: [3, Validators.required],
      slider5Ctrl: [3, Validators.required],
      slider6Ctrl: [3, Validators.required],
      slider7Ctrl: [3, Validators.required],
      slider8Ctrl: [3, Validators.required],
      slider9Ctrl: [3, Validators.required],
      slider10Ctrl: [3, Validators.required],
      slider11Ctrl: [3, Validators.required],
      slider12Ctrl: [3, Validators.required],
      slider13Ctrl: [3, Validators.required],
      slider14Ctrl: [3, Validators.required]
    });

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
            return this.clientService.createClient(newClient);
          })
        )
        .subscribe(result => {
          if (result) {
            this.sharedService.nextAppUser(result);
            this.router.navigate(['/dashboard']);
          } else {
            this._snackBar.open('Ocurrió un error durante el proceso. Intente nuevamente.', 'ok', {
              duration: 3000,
            });
          }
        });
    } else {
      this.auth.user$
        .pipe(
          concatMap(user => {
            let newProvider = this.getProviderObject();
            newProvider.email = user!.email!;
            return this.providerService.createProvider(newProvider);
          })
        )
        .subscribe(result => {
          if (result) {
            this.sharedService.nextAppUser(result);
            this.router.navigate(['/dashboard']);
          } else {
            this._snackBar.open('Ocurrió un error durante el proceso. Intente nuevamente.', 'ok', {
              duration: 3000,
            });
          }
        });
    }
  }

  getClientObject(): Client {
    let client = new Client();
    client.name = this.firstFormGroup.get('firstCtrl')!.value;
    client.description = this.firstFormGroup.get('secondCtrl')!.value;
    client.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    client.website = this.firstFormGroup.get('fourthCtrl')!.value;
    client.extraUrls = this.urls;
    client.countries = this.selectedCountries;
    client.industries = this.selectedIndustries;
    return client;
  }

  getProviderObject(): Provider {
    let provider = new Provider();
    provider.name = this.firstFormGroup.get('firstCtrl')!.value;
    provider.description = this.firstFormGroup.get('secondCtrl')!.value;
    provider.phone = this.firstFormGroup.get('thirdCtrl')!.value;
    provider.website = this.firstFormGroup.get('fourthCtrl')!.value;
    provider.extraUrls = this.urls;
    provider.countries = this.selectedCountries;
    provider.industries = this.selectedIndustries;
    return provider;
  }

}
