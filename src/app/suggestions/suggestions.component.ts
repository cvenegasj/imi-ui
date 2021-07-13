import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProviderDetailDialogComponent } from '../provider-detail-dialog/provider-detail-dialog.component';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void { }

  openProviderDetailDialog(idProvider: string): void {
    const dialogRef = this.dialog.open(ProviderDetailDialogComponent, {
      width: '600px',
      data: {
        idProvider: idProvider
      }
    });

    dialogRef.afterClosed().subscribe();
  }



}
