import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from 'src/models/appointment.model';
import { CustumDateModel } from 'src/models/costumDate.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-public-appointments',
  templateUrl: './public-appointments.component.html',
  styleUrls: ['./public-appointments.component.css']
})
export class PublicAppointmentsComponent implements OnInit {

  appointments: AppointmentModel[] = [];
  appointmentDate: CustumDateModel[] = [];
  hasNoAppointments: boolean;
  selectDateForm: FormGroup;
  today: Date;
  selectedStartDate: Date;
  stringDate: string;

  constructor(
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder
  ) {
    this.getAppointments(); 
    this.today = new Date();
    this.selectedStartDate= this.today;
  }

  ngOnInit() {
    this.selectDateForm = this.formBuilder.group({
      date: [this.today, [
        Validators.required,
      ]],
      enddate: [this.today,
      Validators.required
      ]
    });
  }

  //fetch invites from server
  async getAppointments() {
    const data = await this.appointmentService.fetchPublicAppointments().toPromise();
    this.appointments = data;

    console.log(this.appointments.length);
    //getting the date components out of the appointment data
    for (let j = 0; j < this.appointments.length; j++) {
      this.appointmentDate[j] = new CustumDateModel();
      this.appointmentDate[j].endyear = this.appointments[j].enddate.substr(0, 4);
      this.appointmentDate[j].endmonth = this.appointments[j].enddate.substr(5, 2);
      this.appointmentDate[j].endday = this.appointments[j].enddate.substr(8, 2);
      this.appointmentDate[j].endhours = this.appointments[j].enddate.substr(11, 2);
      this.appointmentDate[j].endminutes = this.appointments[j].enddate.substr(14, 2);
      this.appointmentDate[j].startyear = this.appointments[j].date.substr(0, 4);
      this.appointmentDate[j].startmonth = this.appointments[j].date.substr(5, 2);
      this.appointmentDate[j].startday = this.appointments[j].date.substr(8, 2);
      this.appointmentDate[j].starthours = this.appointments[j].date.substr(11, 2);
      this.appointmentDate[j].startminutes = this.appointments[j].date.substr(14, 2);
      console.log(this.appointmentDate[j].startday);
    }

    if (this.appointments.length == 0) {
      this.hasNoAppointments = true;
    }
  }

  submitSearch(){
    
  }

  async onAnswer(i:number){
    let appointment = new AppointmentModel();
    appointment._id = this.appointments[i]._id;
    const daa = await this.appointmentService.addAppointment(appointment).toPromise();
    this.getAppointments();
  }

  changeStartDate(){
    this.selectedStartDate = new Date(this.selectDateForm.get('date').value);    
  }

  get date() {
    return this.selectDateForm.get('date');
  }

  get enddate() {
    return this.selectDateForm.get('enddate');
  }
}
