/*
 * Service for getting input of the forms into ISOSting format for 
 * sending request in a correct format.
 */
import { Injectable } from '@angular/core';
import { AppointmentModel } from 'src/models/appointment.model';
import { CustumDateModel } from 'src/models/costumDate.model';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() { }

  //create isostring of date and time
  calculateDate(date: Date, time: string) {
    let newDate = new Date();
    let hours = parseInt(time.toString().substr(0, 2));
    let minutes = parseInt(time.toString().substr(3));
    newDate.setTime(date.getTime() + (((hours + 2) * 60 + minutes) * 60 * 1000));
    return newDate.toISOString();
  }

  getCustomFormat(date:string, enddate: string): CustumDateModel {
    //getting the date components out of the appointment data
    let appointmentDate = new CustumDateModel;
    appointmentDate.endyear = enddate.substr(0, 4);
    appointmentDate.endmonth = enddate.substr(5, 2);
    appointmentDate.endday = enddate.substr(8, 2);
    appointmentDate.endhours = enddate.substr(11, 2);
    appointmentDate.endminutes = enddate.substr(14, 2);
    appointmentDate.startyear = date.substr(0, 4);
    appointmentDate.startmonth = date.substr(5, 2);
    appointmentDate.startday = date.substr(8, 2);
    appointmentDate.starthours = date.substr(11, 2);
    appointmentDate.startminutes = date.substr(14, 2);
    return appointmentDate;
  }
}
