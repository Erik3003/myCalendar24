/*
 * This component displays the details of an appointment in a dialog after clicking on it.
 * It offers the opportunity to edit and delete appointments or to invite other users.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EditAppointmentDialogComponent } from '../edit-appointment-dialog/edit-appointment-dialog.component';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { InviteFormDialogComponent } from '../invite-form-dialog/invite-form-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { AppointmentModel } from 'src/models/appointment.model';
import { CustumDateModel } from 'src/models/costumDate.model';


@Component({
  selector: 'app-display-appointment',
  templateUrl: './display-appointment.component.html',
  styleUrls: ['./display-appointment.component.css']
})
export class DisplayAppointmentComponent implements OnInit {

  //variable to display the date in a customized format
  appointmentDate: CustumDateModel;

  /*variable for all categories of the user to get its color with
    the foreign key id stored in the appointment.*/
  categories: CategoryModel[] = [];
  category: CategoryModel = new CategoryModel();

  //displayed appointment
  appointment: AppointmentModel;

  constructor(
    private authService: AuthService,
    private catService: CategoryService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DisplayAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //getting displayed appointment from calling selfcalendar component
    this.appointment = data.event;

    //getting the date components out of the appointment data
    this.appointmentDate = new CustumDateModel();
    this.appointmentDate.endyear = this.appointment.enddate.substr(0, 4);
    this.appointmentDate.endmonth = this.appointment.enddate.substr(5, 2);
    this.appointmentDate.endday = this.appointment.enddate.substr(8, 2);
    this.appointmentDate.endhours = this.appointment.enddate.substr(11, 2);
    this.appointmentDate.endminutes = this.appointment.enddate.substr(14, 2);
    this.appointmentDate.startyear = this.appointment.date.substr(0, 4);
    this.appointmentDate.startmonth = this.appointment.date.substr(5, 2);
    this.appointmentDate.startday = this.appointment.date.substr(8, 2);
    this.appointmentDate.starthours = this.appointment.date.substr(11, 2);
    this.appointmentDate.startminutes = this.appointment.date.substr(14, 2);

    //get category of appointment to display its color
    this.loadCategories();
  }

  ngOnInit() {

  }

  /*call category service for fetching all categories of the user to display
    its color*/
  async loadCategories() {

    //fetching all category
    const data = await this.catService.fetchCategories().toPromise();
    this.categories = data;

    //get category of given appointment
    let found = false;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i]._id == this.appointment.category) {
        this.category = this.categories[i];
        found = true;
      }

      //displaying category for group appointments
      if (!found) {
        this.category.color = this.categories[0].color;
        this.category.title = this.categories[0].title;
      }
    }
  }

  //open dialog with data of appointment to edit it
  onEdit() {
    this.dialogRef.close();

    this.dialog.open(EditAppointmentDialogComponent, {
      data: {
        event: this.appointment,
        category: this.category,
        categories: this.categories
      }
    });
  }

  //open dialog to invite a user to the appointment
  onInvite() {
    this.dialog.open(InviteFormDialogComponent, {
      data: {
        appId: this.appointment._id,
      },
      width: "300px",
    });
  }

  //open dialog to delete the appointment
  onRemove() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        appId: this.appointment._id,
        dialog: this.dialogRef,
      }
    });
  }
}
