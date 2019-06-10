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

  constructor(
    private appointmentService: AppointmentService
  ) { 
    this.heading = "Heute";
    this.getAppointments();
  }

  ngOnInit() {
    this.getDateSubscription=this.appointmentService.currentMessage.subscribe(message => {
			if (message == "date changed") {
				console.log("date changed");
				this.appointmentService.getCurrentDate();
			}
		});
  }

  ngOnDestroy(){
    
  }

  //fetch appointments from server
  getAppointments() {
    //const data = await this.appointmentService.fetchDailyAppointments(10,5,2019).toPromise();
    //this.appointments = data;
    this.appointmentService.fetchDailyAppointments(10,5,2019).subscribe(data=> console.log(data));
    console.log(this.appointments);
    

    console.log(this.appointments.length);
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
