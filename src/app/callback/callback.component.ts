import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '@auth0/auth0-angular';
import { concatMap } from 'rxjs/operators';
import { ClientService } from '../services/client.service';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private clientService: ClientService,
    private providerService: ProviderService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.pipe(
      concatMap(user => this.clientService.findClient(user!.email!) 
                        || this.providerService.findProvider(user!.email!)),
    ).subscribe(found => {
      if (found) { this.router.navigate(['dashboard']); console.log("Returning user!"); }
      else { this.router.navigate(['complete-signup']); console.log("New user!"); }
    });
  }

}
