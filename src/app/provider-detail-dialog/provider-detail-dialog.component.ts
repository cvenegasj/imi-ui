import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Provider } from '../models/types';
import { Util } from '../utils/util';

@Component({
  selector: 'app-provider-detail-dialog',
  templateUrl: './provider-detail-dialog.component.html',
  styleUrls: ['./provider-detail-dialog.component.css']
})
export class ProviderDetailDialogComponent implements OnInit {

  provider!: Provider;

  constructor(
    public dialogRef: MatDialogRef<ProviderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.provider = this.data.provider;
  }

  flatServices(): any[] {
    let flattened: any[] = [];
    for (let [key, value] of this.provider.services) {
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

        flattened.push({ name: service, color: colorDim, icon: Util.SERVICE_TO_ICON.get(key) });
      }
    }
    return flattened;
  }

}
