import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth0/auth0-angular';
import { CallbackComponent } from './callback/callback.component';
import { CompleteSignupComponent } from './complete-signup/complete-signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImiHistoryComponent } from './imi-history/imi-history.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'history', component: ImiHistoryComponent, canActivate: [AuthGuard] },
  { path: 'complete-signup', component: CompleteSignupComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
