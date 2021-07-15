import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { SharedService } from '../services/shared.service';
import { Imi } from '../models/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  appUser: any;
  userIsProvider: boolean = false;
  imiScore: number = 0;

  constructor(
    public sharedService: SharedService,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.sharedService.appUser$
      .subscribe(user => {
        this.appUser = user;
        this.userIsProvider = user.services ? true : false;

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
