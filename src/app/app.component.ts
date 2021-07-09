import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { DOCUMENT } from '@angular/common';

import { forkJoin } from 'rxjs';
import { ClientService } from './services/client.service';
import { ProviderService } from './services/provider.service';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'IMI';
  //isLoading: boolean = true;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private router: Router,
    public auth: AuthService,
    private clientService: ClientService,
    private providerService: ProviderService,
    public sharedService: SharedService
    ) {
      this.auth.user$
        .subscribe(user => {
          forkJoin({
            client: this.clientService.findClient(user!.email!),
            provider: this.providerService.findProvider(user!.email!),
          })
          .subscribe(({client, provider}) => {
            //this.isLoading = false;
            if (!client && !provider) { 
              this.router.navigate(['complete-signup']); 
              console.log("New user!"); 
            } else { 
              let appUser = client ? client : provider;
              this.sharedService.nextAppUser(appUser);
            }
          });
        });
  }

}