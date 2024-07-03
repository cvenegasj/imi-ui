import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
// import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
    imports: [
      BrowserAnimationsModule,
      FlexLayoutModule,
      MatIconModule,
      MatListModule,
      MatToolbarModule,
      MatMenuModule,
      MatButtonModule,
      MatStepperModule,
      MatAutocompleteModule,
      MatFormFieldModule,
      MatInputModule,
      MatChipsModule,
      MatSliderModule,
      MatSnackBarModule,
      MatCardModule,
      MatExpansionModule,
      MatTooltipModule,
      MatDialogModule,
      MatButtonToggleModule,
      MatCheckboxModule,
      MatSelectModule,

    ],
    exports: [
      BrowserAnimationsModule,
      FlexLayoutModule,
      MatIconModule,
      MatListModule,
      MatToolbarModule,
      MatMenuModule,
      MatButtonModule,
      MatStepperModule,
      MatAutocompleteModule,
      MatFormFieldModule,
      MatInputModule,
      MatChipsModule,
      MatSliderModule,
      MatSnackBarModule,
      MatCardModule,
      MatExpansionModule,
      MatTooltipModule,
      MatDialogModule,
      MatButtonToggleModule,
      MatCheckboxModule,
      MatSelectModule,
      
    ],
  })
  export class AppMaterialModule { }