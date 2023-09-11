import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { concatMap } from 'rxjs/operators';
import { Provider } from '../models/types';
import { ProviderDetailDialogComponent } from '../provider-detail-dialog/provider-detail-dialog.component';
import { ClientService } from '../services/client.service';
import { SharedService } from '../services/shared.service';
import { Util } from '../utils/util';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {

  suggestions: Provider[] = [];

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.sharedService.appUser$
      .pipe(
        concatMap(appUser => this.clientService.getSuggestions(appUser.id))
      )
      .subscribe(suggestions => {
        for (let i = 0; i < suggestions.length; i++) {
          let mapServices: Map<number, string[]> = new Map();
          for (let [key, value] of Object.entries(suggestions[i].services)) {
            mapServices.set(+key, value);
          }
          suggestions[i].services = mapServices;
        }
        this.suggestions = suggestions;
      });
  }

  openProviderDetailDialog(provider: Provider): void {
    const dialogRef = this.dialog.open(ProviderDetailDialogComponent, {
      width: '600px',
      data: {
        provider: provider
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  getServiceIcon(n: number): string {
    return Util.SERVICE_TO_ICON.get(n)!;
  }

  getFirst6Services(services: Map<number, string[]>): any[] {
    let first6: any[] = [];
    for (let [key, value] of services) {
      for (let service of value) {
        if (first6.length == 6) return first6;
        first6.push({ name: service, icon: Util.SERVICE_TO_ICON.get(key) });
      }
    }
    return first6;
  }

}
