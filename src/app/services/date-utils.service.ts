/*
 * Service for getting input of the forms into ISOSting format for 
 * sending request in a correct format.
 */
import { Injectable } from '@angular/core';

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
}
