import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentModel } from 'src/models/appointment.model';
import { CategoryModel } from 'src/models/category.model';


@Component({
  selector: 'app-edit-appointment-dialog',
  templateUrl: './edit-appointment-dialog.component.html',
  styleUrls: ['./edit-appointment-dialog.component.css']
})
export class EditAppointmentDialogComponent implements OnInit {

  //form for the appointment values
  appointmentForm: FormGroup;

  //the selected appointment
  appointment: AppointmentModel;

  //category of the appointment
  category: CategoryModel;

  //all categories of the user to display the in the selector
  categories: CategoryModel[] = [];

  //variables for setting validation values 
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  minTime: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<EditAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //get data of the appointment to display it in form
    this.appointment = data.event;
    this.category = data.category;
    this.categories = data.categories;

    //set date values in proper format to load them into the form
    this.startDate = new Date(this.appointment.date);
    this.endDate = new Date(this.appointment.enddate);
    this.startDate.setTime(this.startDate.getTime() - (2 * 60 * 60 * 1000));
    this.endDate.setTime(this.endDate.getTime() - (2 * 60 * 60 * 1000));
    this.startDate.setHours(0);
    this.startDate.setMinutes(0);
    this.endDate.setHours(0);
    this.endDate.setMinutes(0);

    //set validation values (end date cant be before start date)
    this.startTime = this.appointment.date.substr(11, 5);
    this.endTime = this.appointment.enddate.substr(11, 5);
    if (this.startDate.getTime() == this.endDate.getTime()) {
      this.minTime = this.startTime;
    } else {
      this.minTime = "00:00";
    }
  }

  //creating form with stored values of the appointment
  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      title: [this.appointment.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      date: [this.startDate, [
        Validators.required
      ]],
      time: [this.startTime,
      Validators.required
      ],
      enddate: [this.endDate,
      Validators.required
      ],
      endtime: [this.endTime,
      Validators.required
      ],
      category: [this.category._id,
      Validators.required
      ],
      description: [this.appointment.description,
      ],
      public: [this.appointment.public,
      ]
    });
  }

  //updating values if input is changed for validating end date >= start date
  changeStartDate() {
    this.startDate = this.appointmentForm.get('date').value;
  }

  //updating values if input is changed for validating end date >= start date
  changeEndDate() {
    this.startDate = this.appointmentForm.get('date').value;
    this.endDate = this.appointmentForm.get('enddate').value;
    if (this.endDate.getTime() === this.startDate.getTime()) {
      this.minTime = this.startTime;
    } else {
      this.minTime = "00:00";
    }
  }

  //updating values if input is changed for validating end date >= start date
  changeTime() {
    this.startTime = this.appointmentForm.get('time').value;
    this.minTime = this.startTime;
  }

  //save changes of appointment by calling appointment service
  submitAppointment() {
    this.appointment.title = this.appointmentForm.get('title').value;
    this.appointment.description = this.appointmentForm.get('description').value;
    this.appointment.public = this.appointmentForm.get('public').value;
    this.appointment.category = this.appointmentForm.get("category").value;
    this.appointment.date = this.calculateDate(this.appointmentForm.get('date').value, this.appointmentForm.get('time').value);
    this.appointment.enddate = this.calculateDate(this.appointmentForm.get('enddate').value, this.appointmentForm.get('endtime').value);
    this.appointmentService.updateApp(this.appointment).subscribe(data => {
      console.log(data);
      this.appointmentService.changed();
      this.dialogRef.close();
    });
  }

  //create isostring of date and time
  calculateDate(date: Date, time: Number) {
    let newDate = new Date();
    let hours = parseInt(time.toString().substr(0, 2));
    let minutes = parseInt(time.toString().substr(3));
    newDate.setTime(date.getTime() + (((hours + 2) * 60 + minutes) * 60 * 1000));
    return newDate.toISOString();
  }

  //close pop up dialog
  onCancel() {
    this.dialogRef.close();
  }

  //getter for validating form in html
  get title() {
    return this.appointmentForm.get('title');
  }
  get date() {
    return this.appointmentForm.get('date');
  }
  get time() {
    return this.appointmentForm.get('time');
  }
  get enddate() {
    return this.appointmentForm.get('enddate');
  }
  get endtime() {
    return this.appointmentForm.get('endtime');
  }
  get description() {
    return this.appointmentForm.get('description');
  }

}
