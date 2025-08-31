import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';
import { LinkyModule } from 'ngx-linky';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavlistComponent } from './navlist/navlist.component';
import { ImiHistoryComponent } from './imi-history/imi-history.component';
import { ProfileComponent } from './profile/profile.component';
import { CompleteSignupComponent } from './complete-signup/complete-signup.component';
import { ImiVarsComponent } from './imi-vars/imi-vars.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { ProviderDetailDialogComponent } from './provider-detail-dialog/provider-detail-dialog.component';
import { ProviderServicesComponent } from './provider-services/provider-services.component';
import { ImiMapPlotComponent } from './imi-map-plot/imi-map-plot.component';
import { OrdenarCategoriasPipe } from './imi-vars/pipe/ordenar-categorias.pipe';
import { ImiDialogGroupComponent } from './imi-dialog-group/imi-dialog-group.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProfileComponent,
    NavlistComponent,
    ImiHistoryComponent,
    CompleteSignupComponent,
    ImiVarsComponent,
    SuggestionsComponent,
    ProviderDetailDialogComponent,
    ProviderServicesComponent,
    ImiMapPlotComponent,
    OrdenarCategoriasPipe,
    ImiDialogGroupComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule.forRoot({
      // domain: 'symbiocreation.auth0.com',
      // clientId: 'biZYk7qdeMeay5gDWODOg0A707P2JEnR',
      domain: 'dev-8eijwzo853nvei2s.us.auth0.com',
      clientId: '9GBmsRDCamscnjmDQwK62wb9aCXpoWZZ',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    LinkyModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
