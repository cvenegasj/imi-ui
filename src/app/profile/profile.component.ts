import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AuthService } from '@auth0/auth0-angular';
import { ClientService } from '../services/client.service';
import { ProviderService } from '../services/provider.service';
import { SharedService } from '../services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  appUser: any; // can be Client or Provider

  isUpdateFormVisible = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('industryInput') 
  industryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('countryInput') 
  countryInput!: ElementRef<HTMLInputElement>;

  formGroup!: FormGroup;

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
    public auth: AuthService,
    private clientService: ClientService,
    private providerService: ProviderService,
    public sharedService: SharedService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    ) {
      this.formGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
        secondCtrl: [''],
        thirdCtrl: [''],
        fourthCtrl: [''],
        fifthCtrl: [''], // urls
        sixthCtrl: [''], // countries
        seventhCtrl: [''], // industries
      });

      this.sharedService.appUser$
        .subscribe(appUser => {
          this.appUser = appUser;

          this.formGroup.get('firstCtrl')!.setValue(this.appUser.companyName);
          this.formGroup.get('secondCtrl')!.setValue(this.appUser.description);
          this.formGroup.get('thirdCtrl')!.setValue(this.appUser.phone);
          this.formGroup.get('fourthCtrl')!.setValue(this.appUser.website);
          
          this.urls = this.appUser.extraUrls;
          this.selectedCountries = this.appUser.countries;
          this.selectedIndustries = this.appUser.industries; 
        });

      // filters for autocomplete controls
      this.filteredCountries = this.formGroup.get('sixthCtrl')!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );

      this.filteredIndustries = this.formGroup.get('seventhCtrl')!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter2(value))
        );
    }

  ngOnInit(): void {}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.industries.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectCountry(event: MatAutocompleteSelectedEvent): void {
    this.selectedCountries.push(event.option.viewValue);
    this.countryInput.nativeElement.value = '';
    this.formGroup.get('thirdCtrl')!.setValue('');
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
    this.formGroup.get('fourthCtrl')!.setValue('');
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

  onSaveData(): void {
    this.appUser.companyName = this.formGroup.get('firstCtrl')!.value;
    this.appUser.description = this.formGroup.get('secondCtrl')!.value;
    this.appUser.phone = this.formGroup.get('thirdCtrl')!.value;
    this.appUser.website = this.formGroup.get('fourthCtrl')!.value;
    this.appUser.extraUrls = this.urls;
    this.appUser.countries = this.selectedCountries;
    this.appUser.industries = this.selectedIndustries;

    if (this.appUser.services) { // is provider
      this.providerService.update(this.appUser)
        .subscribe(res => {
          this._snackBar.open('Se guardaron los datos correctamente.', 'ok', {
            duration: 2000,
          });
          this.isUpdateFormVisible = false;
        });

    } else { // is client
      this.clientService.update(this.appUser)
        .subscribe(res => {
          this._snackBar.open('Se guardaron los datos correctamente.', 'ok', {
            duration: 2000,
          });
          this.isUpdateFormVisible = false;
        });
    }
  }

}
