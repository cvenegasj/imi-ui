import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ClientService } from '../services/client.service';
import { ProviderService } from '../services/provider.service';

import { forkJoin } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { Client, Provider } from '../models/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  appUser: any;
  userIsProvider: boolean = false;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private providerService: ProviderService,
    public sharedService: SharedService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.sharedService.appUser$
      .subscribe(user => {
        this.appUser = user;
        this.userIsProvider = user.services ? true : false;
      });
  }

}
