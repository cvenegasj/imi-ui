import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ClientService } from '../services/client.service';
import { ProviderService } from '../services/provider.service';

import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private providerService: ProviderService,
    public auth: AuthService
  ) { }

  ngOnInit(): void { }

}
