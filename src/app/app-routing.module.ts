import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAppointmentComponent } from './components/create-appointment/create-appointment.component';
import { SelfcalendarComponent } from './components/selfcalendar/selfcalendar.component';
import { DayCalendarComponent } from './components/day-calendar/day-calendar.component';

const routes: Routes = [
  {path:'', component: SelfcalendarComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'createAppointment', component: CreateAppointmentComponent},
  {path:'calender', component: SelfcalendarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
