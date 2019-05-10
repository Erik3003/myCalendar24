import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppointmentModel } from '../../../models/appointment.model';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {

  appointmentForm: FormGroup;
  appointment: AppointmentModel = new AppointmentModel();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      'title': [this.appointment.title,[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      'date': [this.appointment.date,[
        Validators.required,
      ]],
      'description': [this.appointment.description,
      ]
    });
  }

  submitAppointment(){
    //this.appointment.title = this.appointmentForm.get('title').value;
    //this.appointment.description = this.appointmentForm.get('description').value;

    console.log("creating appointment...");
    //this.authService.registerUser(this.user);
  }
}

