/*
 * This component displays the details of an appointment after clicking on it.
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


@Component({
  selector: 'app-display-appointment',
  templateUrl: './display-appointment.component.html',
  styleUrls: ['./display-appointment.component.css']
})
export class DisplayAppointmentComponent implements OnInit {

  //variables to display the date in a customized format
  endYear: string;
  endMonth: string;
  endDay: string;
  endHours: string;
  endMinutes: string;

  startYear: string;
  startMonth: string;
  startDay: string;
  startHours: string;
  startMinutes: string;

  categories: CategoryModel[] = [];
  category: CategoryModel = new CategoryModel();

  appointment: AppointmentModel;

  constructor(
    private authService: AuthService,
    private catService: CategoryService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DisplayAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
    ) {
      this.appointment = data.event;
      //getting the date components out of the appointment data
      this.endYear = this.appointment.enddate.substr(0,4);
      this.endMonth = this.appointment.enddate.substr(5,2);
      this.endDay = this.appointment.enddate.substr(8,2);
      this.endHours = this.appointment.enddate.substr(11,2);
      this.endMinutes = this.appointment.enddate.substr(14,2);
      this.startYear = this.appointment.date.substr(0,4);
      this.startMonth = this.appointment.date.substr(5,2);
      this.startDay = this.appointment.date.substr(8,2);
      this.startHours = this.appointment.date.substr(11,2);
      this.startMinutes = this.appointment.date.substr(14,2);
      
      //get category of appointment to display color
      this.loadCategories();
     }

  ngOnInit() {

  }

  async loadCategories(){
    
    //fetching all category
    const data = await this.catService.fetchCategories().toPromise();
    this.categories=data;   
    
    //get category of given appointment
    let found = false;
    for(let i = 0; i < this.categories.length;i++){
      if(this.categories[i]._id == this.appointment.category){
        this.category = this.categories[i];
        found = true;
      }

      //displaying category for group appointments
      if (!found){
        this.category.color = this.categories[0].color;
        this.category.title = this.categories[0].title;
      }
    }    
  }

  //open dialog with data of appointment to edit it
  onEdit(){
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
  onInvite(){
    this.dialog.open(InviteFormDialogComponent, {
			data: {
				appId: this.appointment._id,
      },
      width: "300px",
		});
  }

  //open dialog to delete the appointment
  onRemove(){    
    this.dialog.open(DeleteDialogComponent, {
			data: {
        appId: this.appointment._id,
        dialog: this.dialogRef,
			}
		});
  }
}
