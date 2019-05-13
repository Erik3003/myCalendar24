import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppointmentModel } from '../../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {

  appointmentForm: FormGroup;
  appointment: AppointmentModel = new AppointmentModel();

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService
    ) { }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      'title': [this.appointment.title,[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      'date': [this.appointment.date,[
        Validators.required
      ]],
      'endDate': [this.appointment.endDate,
      ],
      'time': [this.appointment.endDate,
      ],      
      'description': [this.appointment.description,
      ]
    });
  }

  submitAppointment(){
    this.appointment.title = this.appointmentForm.get('title').value;
    this.appointment.description = this.appointmentForm.get('description').value;
    this.appointment.date = new Date();
    this.appointment.endDate = new Date();

    console.log("creating appointment...");
    this.appointmentService.CreateNewAppointment(this.appointment);
  }
}

