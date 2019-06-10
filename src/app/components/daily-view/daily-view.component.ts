import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from 'src/models/appointment.model';
import { CustumDateModel } from 'src/models/costumDate.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily-view',
  templateUrl: './daily-view.component.html',
  styleUrls: ['./daily-view.component.css']
})
export class DailyViewComponent implements OnInit {

  appointments: AppointmentModel[] = [];
  appointmentDate: CustumDateModel[] = [];
  hasAppointments: boolean;
  heading:string;
  getDateSubscription: Subscription;
  date: Date;
  day:number;
  month:number;
  year:number;
  months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  constructor(
    private appointmentService: AppointmentService
  ) { 
    
  }

  ngOnInit() {
    this.heading = "Heute";
    this.day = 10;
    this.month = 5;
    this.year = 2019;
    //this.getAppointments();
    this.getDateSubscription=this.appointmentService.currentMessage.subscribe(message => {
			if (message == "date changed") {             
        this.date = this.appointmentService.getSelectedDate();
        this.day = this.date.getDate();
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();
        this.heading = this.day.toString()+"."+this.months[this.month]+"."+this.year.toString().substr(-2);
        this.getAppointments();
			}
		});
  }

  ngOnDestroy(){
    
  }

  //fetch appointments from server
  getAppointments() {
    //const data = await this.appointmentService.fetchDailyAppointments(10,5,2019).toPromise();
    //this.appointments = data;
    this.appointmentService.fetchDailyAppointments(this.day,this.month,this.year).subscribe(data=> console.log(data));
    
    //getting the date components out of the invitation data
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
    }

      if (this.appointments.length !== 0) {
        this.hasAppointments = true;
      }
    
  }
}
