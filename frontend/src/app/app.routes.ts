import { Routes } from '@angular/router';
import { PublicRsvpComponent } from './pages/public-rsvp/public-rsvp.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', component: PublicRsvpComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: 'admin/panel', component: AdminPanelComponent },
  { path: '**', redirectTo: '' }
];
