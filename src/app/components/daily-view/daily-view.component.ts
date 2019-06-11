import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from 'src/models/appointment.model';
import { CustumDateModel } from 'src/models/costumDate.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Subscription } from 'rxjs';
import { DateUtilsService } from 'src/app/services/date-utils.service';
import { MatDialog } from '@angular/material';
import { DisplayAppointmentComponent } from '../display-appointment-dialog/display-appointment.component';
import { CategoryModel } from 'src/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-daily-view',
  templateUrl: './daily-view.component.html',
  styleUrls: ['./daily-view.component.css']
})
export class DailyViewComponent implements OnInit {

  monthAppointments: AppointmentModel[] = [];
  dayAppointments: AppointmentModel[] = [];
  appointmentMonthDate: CustumDateModel[] = [];
  appointmentDate: CustumDateModel[] = [];

  /*variable for all categories of the user to get its color with
   the foreign key id stored in the appointment.*/
  categories: CategoryModel[] = [];

  hasAppointments: boolean;
  heading: string;
  getDateSubscription: Subscription;
  date: Date;
  day: number;
  month: number;
  year: number;
  months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  constructor(
    private appointmentService: AppointmentService,
    private catService: CategoryService,
    private dateUtils: DateUtilsService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.heading = "Heute";
    this.day = 10;
    this.month = 5;
    this.year = 2019;
    this.getAppointments();
    this.getDateSubscription = this.appointmentService.currentMessage.subscribe(message => {
      if (message == "date changed") {
        this.date = this.appointmentService.getSelectedDate();
        this.day = this.date.getDate();
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();
        this.heading = this.day.toString() + "." + this.months[this.month] + "." + this.year.toString().substr(-2);
        this.getAppointments();
      }
    });
  }

  ngOnDestroy() {
    this.getDateSubscription.unsubscribe();
  }

  //fetch appointments from server
  async getAppointments() {
    const data = await this.appointmentService.fetchAppointments(this.month, this.year).toPromise();
    this.monthAppointments = data;
    this.dayAppointments = [];

    //getting the date components out of the invitation data
    let counter = 0;
    for (let j = 0; j < this.monthAppointments.length; j++) {
      this.appointmentMonthDate[j] = new CustumDateModel();
      this.appointmentMonthDate[j] = this.dateUtils.getCustomFormat(this.monthAppointments[j].date, this.monthAppointments[j].enddate);

      let startDay = Number(this.appointmentMonthDate[j].startday);
      let endDay = Number(this.appointmentMonthDate[j].endday);

      if (startDay == this.day || endDay == this.day || (startDay < this.day && endDay > this.day)) {

        this.dayAppointments[counter] = this.monthAppointments[j];

        this.appointmentDate[counter] = new CustumDateModel();
        this.appointmentDate[counter] = this.dateUtils.getCustomFormat(this.monthAppointments[j].date, this.monthAppointments[j].enddate);
        counter++;
      }
    }

    if (this.dayAppointments.length !== 0) {
      this.hasAppointments = true;
    }

  }

  onClick(id: number) {

    this.dialog.open(DisplayAppointmentComponent, {
      data: {
        event: this.dayAppointments[id],
      }
    });
  }
}
