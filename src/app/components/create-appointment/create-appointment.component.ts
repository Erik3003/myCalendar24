import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
    ) { }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      title: [this.appointment.title,[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      date: ['',[
        Validators.required
      ]],
      time: ['',
        Validators.required
      ],
      enddate: ['',
        Validators.required
      ],
      endtime: ['',
        Validators.required
      ],     
      description: ['',
      ]
    });
  }

  submitAppointment(){
    //get values of form
    this.appointment.title = this.appointmentForm.get('title').value;
    this.appointment.description = this.appointmentForm.get('description').value;
    this.appointment.date = this.calculateDate(this.appointmentForm.get('date').value,this.appointmentForm.get('time').value);
    this.appointment.enddate = this.calculateDate(this.appointmentForm.get('enddate').value,this.appointmentForm.get('endtime').value);

    //sending to server
    console.log("creating appointment...");
    this.appointmentService.CreateNewAppointment(this.appointment);
    this.router.navigate(['/']);
  }

  //create isostring of date and time
  calculateDate(date: Date, time: Number){   
    let newDate = new Date();
    let hours = parseInt(time.toString().substr(0,2));
    let minutes = parseInt(time.toString().substr(3));
    newDate.setTime(date.getTime() + (((hours+2)*60+minutes)*60*1000));
    return newDate.toISOString();
  }
}

