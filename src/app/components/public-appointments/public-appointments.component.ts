/*
 * Component for displaying available public appointments in a selectable time interval.
 * The user can add the appointment to its own appointments.
 */
import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from 'src/models/appointment.model';
import { CustumDateModel } from 'src/models/costumDate.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateUtilsService } from 'src/app/services/date-utils.service';

@Component({
  selector: 'app-public-appointments',
  templateUrl: './public-appointments.component.html',
  styleUrls: ['./public-appointments.component.css']
})
export class PublicAppointmentsComponent implements OnInit {

  //appointment variables to display information of each appointment
  appointments: AppointmentModel[] = [];
  appointmentDate: CustumDateModel[] = [];

  //array of dates for requesting public appointments in the given interval
  searchDates: string[] = [];

  //bool for showing message for no appointments
  hasNoAppointments: boolean;

  //form for entering dates for the time interval
  selectDateForm: FormGroup;

  //date variables to get the corect format
  today: Date;
  enddateSearch: Date;
  selectedStartDate: Date;
  stringDate: string;

  constructor(
    private appointmentService: AppointmentService,
    private dateUtils: DateUtilsService,
    private formBuilder: FormBuilder
  ) {
    /*initial search for public appointments in the next 2 weeks by formating the
      dates with the help of the dateUtils class and calling the service*/
    this.today = new Date();
    this.selectedStartDate = this.today;
    this.enddateSearch = new Date(this.today);
    this.enddateSearch.setDate(this.today.getDate() + 14);
    this.searchDates = [];
    this.searchDates.push(this.dateUtils.calculateDate(this.today, "00:00"));
    this.searchDates.push(this.dateUtils.calculateDate(this.enddateSearch, '23:59'));
    this.getAppointments();
  }

  ngOnInit() {
    //initilizing form with dates
    this.selectDateForm = this.formBuilder.group({
      date: [this.today, [
        Validators.required,
      ]],
      enddate: [this.enddateSearch,
      Validators.required
      ]
    });
  }

  //fetch public appointments by calling the appointment service
  async getAppointments() {
    const data = await this.appointmentService.fetchPublicAppointments(this.searchDates).toPromise();
    this.appointments = data;

    //getting the date components out of the appointment data
    for (let j = 0; j < this.appointments.length; j++) {
      this.appointmentDate[j] = new CustumDateModel();
      this.appointmentDate[j] = this.dateUtils.getCustomFormat(this.appointments[j].date, this.appointments[j].enddate)
    }

    //show no appointments message
    if (this.appointments.length == 0) {
      this.hasNoAppointments = true;
    } else {
      this.hasNoAppointments = false;
    }
  }

  //sending search dates to service
  submitSearch() {
    this.searchDates = [];
    this.searchDates.push(this.dateUtils.calculateDate(this.selectDateForm.get('date').value, "00:00"));
    this.searchDates.push(this.dateUtils.calculateDate(this.selectDateForm.get('enddate').value, '23:59'));
    this.getAppointments();
  }

  //on reacting to an invitation, the respone is send to the service
  async onAnswer(i: number) {
    let appointment = new AppointmentModel();
    appointment._id = this.appointments[i]._id;
    const daa = await this.appointmentService.addAppointment(appointment).toPromise();
    this.getAppointments();
  }

  //setting selected date as minimum date for second date picker
  changeStartDate() {
    this.selectedStartDate = new Date(this.selectDateForm.get('date').value);
  }

  //getter for validating the Form
  get date() {
    return this.selectDateForm.get('date');
  }

  get enddate() {
    return this.selectDateForm.get('enddate');
  }
}
