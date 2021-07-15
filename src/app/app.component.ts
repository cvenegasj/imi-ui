import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { DOCUMENT } from '@angular/common';

import { forkJoin } from 'rxjs';
import { ClientService } from './services/client.service';
import { ProviderService } from './services/provider.service';
import { SharedService } from './services/shared.service';
import { Client, Provider } from './models/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'IMI';

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
          if (user) {
            forkJoin({
              client: this.clientService.find(user!.email!),
              provider: this.providerService.find(user!.email!),
            })
            .subscribe(({client, provider}) => {
              if (!client && !provider) { 
                this.router.navigate(['complete-signup']); 
                console.log("New user!"); 
              } else { 
                let appUser: any = client ? client as Client : provider as Provider;
                //console.log(appUser);
                
                // provider's services
                if (provider) { // manual mapping from JSON to Map object
                  let mapServices: Map<number, string[]> = new Map();
                  for (let [key, value] of Object.entries(provider.services)) {
                    mapServices.set(+key, value);
                  }
                  appUser.services = mapServices;
                }
                // imis
                for (let i = 0; i < appUser.imis.length; i++) {
                  let tempMap = new Map();
                  for (let [key, value] of Object.entries(appUser.imis[i].vars)) {
                    tempMap.set(+key, value);
                  }
                  appUser.imis[i].vars = tempMap;
                }
                this.sharedService.nextAppUser(appUser);
              }
            });
          } else {
            this.auth.loginWithRedirect();
          }
        });
  }

  

}