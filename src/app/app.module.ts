/*
 * Importing used components and Angular Materials for designing.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatDialogModule, MatOptionModule, MatSelectModule, MatMenuModule } from "@angular/material";
import { MAT_DATE_LOCALE } from '@angular/material';

import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAppointmentComponent } from './components/create-appointment/create-appointment.component';
import { SelfcalendarComponent } from './components/selfcalendar/selfcalendar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DisplayAppointmentComponent } from './components/display-appointment-dialog/display-appointment.component';
import { EditAppointmentDialogComponent } from './components/edit-appointment-dialog/edit-appointment-dialog.component';
import { CreateCategoryComponent } from './components/create-category-dialog/create-category.component';
import { InvitesDialogComponent } from './components/invites-dialog/invites-dialog.component';
import { InviteFormDialogComponent } from './components/invite-form-dialog/invite-form-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CustomizeCategoriesComponent } from './components/customize-categories/customize-categories.component';
import { PublicAppointmentsComponent } from './components/public-appointments/public-appointments.component';

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
    CreateCategoryComponent,
    InvitesDialogComponent,
    InviteFormDialogComponent,
    DeleteDialogComponent,
    CustomizeCategoriesComponent,
    PublicAppointmentsComponent,
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
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'de-DE' }],
  bootstrap: [AppComponent],
  entryComponents: [
    DisplayAppointmentComponent,
    EditAppointmentDialogComponent,
    CreateCategoryComponent,
    InvitesDialogComponent,
    InviteFormDialogComponent,
    DeleteDialogComponent,
    CustomizeCategoriesComponent
  ]
})
export class AppModule { }
