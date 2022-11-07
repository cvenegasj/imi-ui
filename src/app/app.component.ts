import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { DOCUMENT } from '@angular/common';

import { forkJoin } from 'rxjs';
import { ClientService } from './services/client.service';
import { ProviderService } from './services/provider.service';
import { SharedService } from './services/shared.service';
import { Academic, Client, Provider } from './models/types';
import { AcademicService } from './services/academic.service';

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
    private academicService: AcademicService,
    public sharedService: SharedService
    ) {
      this.auth.user$
        .subscribe(user => {
          if (user) {
            forkJoin({
              client: this.clientService.find(user!.email!),
              provider: this.providerService.find(user!.email!),
              academic: this.academicService.find(user!.email!),
            })
            .subscribe(({client, provider, academic}) => {
              if (!client && !provider && !academic) { 
                this.router.navigate(['complete-signup']); 
                console.log("New user!"); 
              } else { 
                let appUser: any = client ? new Client(client) : 
                  (provider ? new Provider(provider) : new Academic(academic));
                
                // provider's services
                if (appUser instanceof Provider) { // manual mapping from JSON to Map object
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