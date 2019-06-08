/*
 * This component displays the details of an appointment after clicking on it.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EditAppointmentDialogComponent } from '../edit-appointment-dialog/edit-appointment-dialog.component';
import { AppointmentService } from 'src/app/services/appointment.service';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { InviteFormDialogComponent } from '../invite-form-dialog/invite-form-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
  category: CategoryModel;

  appointment;

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
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

      //get category
      this.categories = this.catService.getCategories();
      for(let i = 0; i < this.categories.length;i++){
        if(this.categories[i]._id == this.appointment.category){
          this.category = this.categories[i];
        }
      }
     }

  ngOnInit() {
    
  }

  onEdit(){
    this.dialogRef.close();

    this.dialog.open(EditAppointmentDialogComponent, {
			data: {
        event: this.appointment,
        category: this.category,
        categories: this.categories
			}
		});
    //open new component to edit window

  }

  onInvite(){
    this.dialog.open(InviteFormDialogComponent, {
			data: {
				appId: this.appointment._id,
			}
		});
  }

  //call appointment service delete request
  onRemove(){    
    this.dialog.open(DeleteDialogComponent, {
			data: {
        appId: this.appointment._id,
        dialog: this.dialogRef,
			}
		});
  }
}
