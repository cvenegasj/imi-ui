import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Util } from '../utils/util';
import { Provider, Client, Academic } from '../models/types';
import { AcademicService } from '../services/academic.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  appUser: any; // can be Client or Provider or Academic
  //userIsProvider: boolean = false;

  isUpdateFormVisible = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('industryInput') 
  industryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('countryInput') 
  countryInput!: ElementRef<HTMLInputElement>;

  formGroup!: FormGroup;

  countries: string[] = Util.COUNTRY_LIST;
  filteredCountries: Observable<string[]>;
  selectedCountries: string[] = [];

  industries: string[] = Util.INDUSTRY_LIST;
  filteredIndustries: Observable<string[]>;
  selectedIndustries: string[] = [];

  urls: string[] = [];

  constructor(
    public auth: AuthService,
    private clientService: ClientService,
    private providerService: ProviderService,
    private academicService: AcademicService,
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
        eighthCtrl: [''] // type for Academic
      });

      this.sharedService.appUser$
        .subscribe(appUser => {
          this.appUser = appUser;
          // this.userIsProvider = appUser instanceof Provider;

          this.formGroup.get('firstCtrl')!.setValue(this.appUser.companyName);
          this.formGroup.get('secondCtrl')!.setValue(this.appUser.description);
          this.formGroup.get('thirdCtrl')!.setValue(this.appUser.phone);
          this.formGroup.get('fourthCtrl')!.setValue(this.appUser.website);
          
          this.urls = this.appUser.extraUrls;
          this.selectedCountries = this.appUser.countries;

          if (this.appUser instanceof Academic) {
            this.formGroup.get('eighthCtrl')!.setValue(this.appUser.type);
          } else {
            this.selectedIndustries = this.appUser.industries;
          }
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

  ngOnInit(): void { }

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
    
    if (this.appUser instanceof Provider) { // is provider
      this.appUser.countries = this.selectedCountries;
      this.appUser.industries = this.selectedIndustries;

      this.providerService.update(this.appUser)
        .subscribe(res => {
          this._snackBar.open('Se guardaron los datos correctamente.', 'ok', {
            duration: 2000,
          });
          this.isUpdateFormVisible = false;
        });
    } else if (this.appUser instanceof Client) { // is client
      this.appUser.countries = this.selectedCountries;
      this.appUser.industries = this.selectedIndustries;

      this.clientService.update(this.appUser)
        .subscribe(res => {
          this._snackBar.open('Se guardaron los datos correctamente.', 'ok', {
            duration: 2000,
          });
          this.isUpdateFormVisible = false;
        });
    } else { // is academic
      this.appUser.type = this.formGroup.get('eighthCtrl')!.value;

      this.academicService.update(this.appUser)
        .subscribe(res => {
          this._snackBar.open('Se guardaron los datos correctamente.', 'ok', {
            duration: 2000,
          });
          this.isUpdateFormVisible = false;
        });
    }
  }

  userIsClient(): boolean {
    return this.appUser instanceof Client;
  }

  userIsProvider(): boolean {
    return this.appUser instanceof Provider;
  }

  userIsAcademic(): boolean {
    return this.appUser instanceof Academic;
  }
}
