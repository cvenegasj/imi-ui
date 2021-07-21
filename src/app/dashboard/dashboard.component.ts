import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { SharedService } from '../services/shared.service';
import { Imi } from '../models/types';
import { Util } from '../utils/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  appUser: any;
  userIsProvider: boolean = false;
  providerServices: any[] = []; // array to hold services given by a provider, for easy rendering
  imiScore: number = 0;

  constructor(
    public sharedService: SharedService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.sharedService.appUser$
      .subscribe(user => {
        this.appUser = user;
        //console.log(this.appUser);
        this.userIsProvider = user.services ? true : false;

        if (this.userIsProvider) {
          for (let [key, value] of this.appUser.services) {
            for (let service of value) {
              let colorDim = "";

              if (key >= 1 && key <= 3) {
                colorDim = Util.DIMENSION_TO_COLOR.get(1)!;
              } else if (key >= 4 && key <= 6) {
                colorDim = Util.DIMENSION_TO_COLOR.get(2)!;
              } else if (key >= 7 && key <= 9) {
                colorDim = Util.DIMENSION_TO_COLOR.get(3)!;
              } else if (key >= 10 && key <= 12) {
                colorDim = Util.DIMENSION_TO_COLOR.get(4)!;
              } else if (key >= 13 && key <= 15) {
                colorDim = Util.DIMENSION_TO_COLOR.get(5)!;
              }

              this.providerServices.push(
                { name: service, color: colorDim, icon: Util.SERVICE_TO_ICON.get(key) }
              );
            }
          }
        }

        //console.log(this.providerServices);

        if (this.appUser.imis.length > 0) {
          const lastImi = this.appUser.imis[this.appUser.imis.length - 1];
          this.imiScore = this.calculateImiScore(lastImi);
        }
      });
  }

  calculateImiScore(imi: Imi): number {
    let sum = 0;
    const n = imi.vars.size;

    for (let value of imi.vars.values()) {
      sum += value;
    }
    return sum / n;
  }

  setImiScore(score: number): void {
    this.imiScore = score;
  }

}
