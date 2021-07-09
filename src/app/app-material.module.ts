import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

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
      
    ],
  })
  export class AppMaterialModule { }