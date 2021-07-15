import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProviderService } from '../services/provider.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-provider-services',
  templateUrl: './provider-services.component.html',
  styleUrls: ['./provider-services.component.css']
})
export class ProviderServicesComponent implements OnInit {

  appUser: any;

  disabledInputs: boolean = true;

  // all possible services
  services1 = ['Smart Product Development', 'Massive Customized Production'];
  services2 = ['Computer-Aided Design', 'Parametric Design', 'Computer-Aided Engineering', '3D Scanning'];
  services3 = ['Computer-Aided Manufacturing (CAM)', '3D Printing', 'Robotics', 'Automation'];
  services4 = ['Biomaterials', 'Smart Materials', 'Circular-Espiral Economy', 'Regenerative Economy'];
  services5 = ['Clean Energy', 'Smart Grid'];
  services6 = ['Internet of Things', 'Smart Tracking', 'Distributed Fabrication'];
  services7 = ['Sensors', 'Bio-Sensors', 'IoT', 'Networking and Communication'];
  services8 = ['Cloud Computing', 'AI', 'Big Data', 'Machine Learning / Deep Learning', 'Blockchain', 'FinTech', 'Cybersecurity'];
  services9 = ['Web Apps', 'UX', 'AR / VR / MR', 'Data Visualization'];
  services10 = ['Develop of Flexible', 'Exponential and On-Demand', 'Dashboards', 'CRM'];
  services11 = ['Support in Scalability', 'Financing', 'Global Impact'];
  services12 = ['Good Practices', 'Transparency'];
  services13 = ['Open Innovation', 'Agile Methodologies', 'Symbiocreation', 'Design Thinking'];
  services14 = ['Flexible and Distributed Models', 'Blockchain'];
  services15 = ['Training in the Fourth/Fifth Industrial Revolution Skills'];

  selectedServices1: string[] = [];
  selectedServices2: string[] = [];
  selectedServices3: string[] = [];
  selectedServices4: string[] = [];
  selectedServices5: string[] = [];
  selectedServices6: string[] = [];
  selectedServices7: string[] = [];
  selectedServices8: string[] = [];
  selectedServices9: string[] = [];
  selectedServices10: string[] = [];
  selectedServices11: string[] = [];
  selectedServices12: string[] = [];
  selectedServices13: string[] = [];
  selectedServices14: string[] = [];
  selectedServices15: string[] = [];

  constructor(
    public sharedService: SharedService,
    private providerService: ProviderService,
  ) { }

  ngOnInit(): void {
    this.sharedService.appUser$
      .subscribe(user => {
        this.appUser = user;
        
        this.selectedServices1 = this.appUser.services.get(1) || [];
        this.selectedServices2 = this.appUser.services.get(2) || [];
        this.selectedServices3 = this.appUser.services.get(3) || [];
        this.selectedServices4 = this.appUser.services.get(4) || [];
        this.selectedServices5 = this.appUser.services.get(5) || [];
        this.selectedServices6 = this.appUser.services.get(6) || [];
        this.selectedServices7 = this.appUser.services.get(7) || [];
        this.selectedServices8 = this.appUser.services.get(8) || [];
        this.selectedServices9 = this.appUser.services.get(9) || [];
        this.selectedServices10 = this.appUser.services.get(10) || [];
        this.selectedServices11 = this.appUser.services.get(11) || [];
        this.selectedServices12 = this.appUser.services.get(12) || [];
        this.selectedServices13 = this.appUser.services.get(13) || [];
        this.selectedServices14 = this.appUser.services.get(14) || [];
        this.selectedServices15 = this.appUser.services.get(15) || [];
      });
  }

  saveChanges(): void {
    this.disabledInputs = true;

    let userServices: Map<number, string[]> = new Map();
    userServices.set(1, this.selectedServices1);
    userServices.set(2, this.selectedServices2);
    userServices.set(3, this.selectedServices3);
    userServices.set(4, this.selectedServices4);
    userServices.set(5, this.selectedServices5);
    userServices.set(6, this.selectedServices6);
    userServices.set(7, this.selectedServices7);
    userServices.set(8, this.selectedServices8);
    userServices.set(9, this.selectedServices9);
    userServices.set(10, this.selectedServices10);
    userServices.set(11, this.selectedServices11);
    userServices.set(12, this.selectedServices12);
    userServices.set(13, this.selectedServices13);
    userServices.set(14, this.selectedServices14);
    userServices.set(15, this.selectedServices15);

    this.providerService.updateServices(this.appUser.id, userServices)
      .subscribe();
  }

  removeService1(service: string): void {
    const index = this.selectedServices1.indexOf(service);
    if (index >= 0) {
      this.selectedServices1.splice(index, 1);
    }
  }

  selectService1(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices1.push(event.option.viewValue);
  }

  removeService2(service: string): void {
    const index = this.selectedServices2.indexOf(service);
    if (index >= 0) {
      this.selectedServices2.splice(index, 1);
    }
  }

  selectService2(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices2.push(event.option.viewValue);
  }

  removeService3(service: string): void {
    const index = this.selectedServices3.indexOf(service);
    if (index >= 0) {
      this.selectedServices3.splice(index, 1);
    }
  }

  selectService3(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices3.push(event.option.viewValue);
  }

  removeService4(service: string): void {
    const index = this.selectedServices4.indexOf(service);
    if (index >= 0) {
      this.selectedServices4.splice(index, 1);
    }
  }

  selectService4(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices4.push(event.option.viewValue);
  }

  removeService5(service: string): void {
    const index = this.selectedServices5.indexOf(service);
    if (index >= 0) {
      this.selectedServices5.splice(index, 1);
    }
  }

  selectService5(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices5.push(event.option.viewValue);
  }

  removeService6(service: string): void {
    const index = this.selectedServices6.indexOf(service);
    if (index >= 0) {
      this.selectedServices6.splice(index, 1);
    }
  }

  selectService6(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices6.push(event.option.viewValue);
  }

  removeService7(service: string): void {
    const index = this.selectedServices7.indexOf(service);
    if (index >= 0) {
      this.selectedServices7.splice(index, 1);
    }
  }

  selectService7(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices7.push(event.option.viewValue);
  }

  removeService8(service: string): void {
    const index = this.selectedServices8.indexOf(service);
    if (index >= 0) {
      this.selectedServices8.splice(index, 1);
    }
  }

  selectService8(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices8.push(event.option.viewValue);
  }

  removeService9(service: string): void {
    const index = this.selectedServices9.indexOf(service);
    if (index >= 0) {
      this.selectedServices9.splice(index, 1);
    }
  }

  selectService9(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices9.push(event.option.viewValue);
  }

  removeService10(service: string): void {
    const index = this.selectedServices10.indexOf(service);
    if (index >= 0) {
      this.selectedServices10.splice(index, 1);
    }
  }

  selectService10(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices10.push(event.option.viewValue);
  }

  removeService11(service: string): void {
    const index = this.selectedServices11.indexOf(service);
    if (index >= 0) {
      this.selectedServices11.splice(index, 1);
    }
  }

  selectService11(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices11.push(event.option.viewValue);
  }

  removeService12(service: string): void {
    const index = this.selectedServices12.indexOf(service);
    if (index >= 0) {
      this.selectedServices12.splice(index, 1);
    }
  }

  selectService12(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices12.push(event.option.viewValue);
  }

  removeService13(service: string): void {
    const index = this.selectedServices13.indexOf(service);
    if (index >= 0) {
      this.selectedServices13.splice(index, 1);
    }
  }

  selectService13(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices13.push(event.option.viewValue);
  }

  removeService14(service: string): void {
    const index = this.selectedServices14.indexOf(service);
    if (index >= 0) {
      this.selectedServices14.splice(index, 1);
    }
  }

  selectService14(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices14.push(event.option.viewValue);
  }

  removeService15(service: string): void {
    const index = this.selectedServices15.indexOf(service);
    if (index >= 0) {
      this.selectedServices15.splice(index, 1);
    }
  }

  selectService15(event: MatAutocompleteSelectedEvent): void{
    this.selectedServices15.push(event.option.viewValue);
  }

}
