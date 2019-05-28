import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAppointmentComponent } from './components/create-appointment/create-appointment.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SelfcalendarComponent } from './components/selfcalendar/selfcalendar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

const routes: Routes = [
  {path:'', component: SelfcalendarComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'createAppointment', component: CreateAppointmentComponent},
  {path:'calender', component: CalendarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
