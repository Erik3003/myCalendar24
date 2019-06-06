import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppointmentModel } from '../../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {

  appointmentForm: FormGroup;
  appointment: AppointmentModel = new AppointmentModel();
  today;
  selectedStartDate;
  selectedEndDate;
  selectedTime;
  minTime;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    //setting current date as html-input default value
    this.today = new Date();
    
    //setting next hour as html-input default value
    let hours = this.today.getHours();
    if (hours < 23) {
      this.selectedTime = (hours + 1).toString() + ":00";
    } else {
      this.selectedTime = '00:00';
    }
    this.minTime = this.selectedTime;

    //setting time for start date to 00:00:00
    this.today.setHours(0);
    this.today.setMinutes(0);
    this.today.setSeconds(0);
    this.today.setMilliseconds(0);
    this.selectedStartDate = this.today;

    
  }

  //creating appointment form
  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      date: [this.today, [
        Validators.required,
      ]],
      time: [this.selectedTime,
      Validators.required
      ],
      enddate: [this.today,
        Validators.required
      ],
      endtime: ['',
        Validators.required
      ],
      description: ['',
      ],
      public:[false,
      ]
    });
  }

  //updating values if input is changed for validating end date >= start date
  changeStartDate() {
    this.selectedStartDate = this.appointmentForm.get('date').value;
  }

  changeEndDate() {
    this.selectedEndDate = this.appointmentForm.get('enddate').value;
    if(this.selectedEndDate.getTime()===this.selectedStartDate.getTime()){
      this.minTime = this.selectedTime;
    }else{
      this.minTime = "00:00";
    }
  }

  changeTime() {
    this.selectedTime = this.appointmentForm.get('time').value;
    this.minTime = this.selectedTime;
  }

  //getting valid input values from form and call the appointment service to make a http post request
  submitAppointment() {
    //get values of form
    this.appointment.title = this.appointmentForm.get('title').value;
    this.appointment.description = this.appointmentForm.get('description').value;
    //this.appointment.public = this.appointmentForm.get('public').value;
    this.appointment.date = this.calculateDate(this.appointmentForm.get('date').value, this.appointmentForm.get('time').value);
    this.appointment.enddate = this.calculateDate(this.appointmentForm.get('enddate').value, this.appointmentForm.get('endtime').value);

    //calling service to send data to server
    console.log("creating appointment...");
    this.appointmentService.CreateNewAppointment(this.appointment);
    this.router.navigate(['/']);
  }

  //create isostring of date and time
  calculateDate(date: Date, time: Number) {
    let newDate = new Date();
    let hours = parseInt(time.toString().substr(0, 2));
    let minutes = parseInt(time.toString().substr(3));
    newDate.setTime(date.getTime() + (((hours + 2) * 60 + minutes) * 60 * 1000));
    return newDate.toISOString();
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

