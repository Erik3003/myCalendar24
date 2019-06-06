import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatDialogModule, MAT_DATE_FORMATS } from "@angular/material";
import {MAT_DATE_LOCALE} from '@angular/material';

import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAppointmentComponent } from './components/create-appointment/create-appointment.component';
import { SelfcalendarComponent } from './components/selfcalendar/selfcalendar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DisplayAppointmentComponent } from './components/display-appointment/display-appointment.component';
import { EditAppointmentDialogComponent } from './components/edit-appointment-dialog/edit-appointment-dialog.component';
import { DayCalendarComponent } from './components/day-calendar/day-calendar.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    CreateAppointmentComponent,
    SelfcalendarComponent,
    SidebarComponent,
    DisplayAppointmentComponent,
    EditAppointmentDialogComponent,
    DayCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'de-DE'}],
  bootstrap: [AppComponent],
  entryComponents:[DisplayAppointmentComponent, EditAppointmentDialogComponent]
})
export class AppModule { }
