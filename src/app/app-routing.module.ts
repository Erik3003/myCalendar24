import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAppointmentComponent } from './components/create-appointment/create-appointment.component';
import { SelfcalendarComponent } from './components/selfcalendar/selfcalendar.component';
import { PublicAppointmentsComponent } from './components/public-appointments/public-appointments.component';
import { DailyViewComponent } from './components/daily-view/daily-view.component';

//routes for navigating throu the components
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'createAppointment', component: CreateAppointmentComponent },
  { path: 'calendar', component: SelfcalendarComponent },
  { path: 'public', component: PublicAppointmentsComponent },
  { path: 'day', component: DailyViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
