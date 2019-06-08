import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppointmentService } from 'src/app/services/appointment.service';


@Component({
  selector: 'app-edit-appointment-dialog',
  templateUrl: './edit-appointment-dialog.component.html',
  styleUrls: ['./edit-appointment-dialog.component.css']
})
export class EditAppointmentDialogComponent implements OnInit {

  appointmentForm: FormGroup;
  appointment;
  category;
  categories = [];

  //variables to display the date in a customized format
  startDate;
  startTime;
  endDate;
  endTime;

  //variable for date validation
  minTime;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<EditAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //get data of the appointment to display them in form
    this.appointment = data.event;
    this.category = data.category;
    this.categories = data.categories;
    this.startDate = this.appointment.date;
    this.endDate = this.appointment.enddate;

    this.startTime = this.appointment.date.substr(11, 5);
    this.endTime = this.appointment.enddate.substr(11, 5);
    this.minTime = this.startTime;
  }
  //creating form with given values of the appointment
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
      public: [false,
      ]
    });
  }

  //updating values if input is changed for validating end date >= start date
  changeStartDate() {
    this.startDate = this.appointmentForm.get('date').value;
  }

  changeEndDate() {
    this.startDate = this.appointmentForm.get('date').value;
    this.endDate = this.appointmentForm.get('enddate').value;
    if (this.endDate.getTime() === this.startDate.getTime()) {
      this.minTime = this.startTime;
    } else {
      this.minTime = "00:00";
    }
  }

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

    this.appointmentService.updateApp(this.appointment).subscribe(data=>console.log(data));
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
