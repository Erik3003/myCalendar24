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
    console.log("speichern");
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
