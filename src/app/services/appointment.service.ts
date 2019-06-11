/*
 * This service handles all requests for appointment between components and server.
 * This includes creating, updating, deleting and fetching of appointments as well as
 * sending invitation, fetch invitations and response on invitations.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppointmentModel } from 'src/models/appointment.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { InviteAnswerModel } from 'src/models/inviteAnswer.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  //variables for communication of changes
  messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  selectedDate: Date;

  readonly ROOT_URL = 'http://localhost:3000/api/appointment';

  constructor(private http: HttpClient, private authService: AuthService) { }

  //http post request for creating a new appointment
  CreateNewAppointment(appointment: AppointmentModel) {
    let headers = this.createRequestHeader();

    return this.http.post(this.ROOT_URL + "/new", appointment, { headers: headers });
  }

  //http get request for getting all appointments of the user
  fetchAppointments(month: number, year: number): Observable<AppointmentModel[]> {
    //create date format for header information
    let date = new Date(year, month);
    let isodate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

    //append request header
    let headers = this.createRequestHeader();
    headers = headers.append("dateParams", isodate);

    return this.http.get<AppointmentModel[]>(this.ROOT_URL + "/get", { headers: headers });
  }

  //http get request for getting all appointments of the user
  fetchDailyAppointments(day: number, month: number, year: number, ): Observable<AppointmentModel[]> {
    //create date format for header information
    let date = new Date(year, month, day);
    let isodate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

    //append request header
    let headers = this.createRequestHeader();
    headers = headers.append("dateParams", isodate);

    return this.http.get<AppointmentModel[]>(this.ROOT_URL + "/day", { headers: headers });
  }

  //http post request for deleting an appointment of theuser
  removeApp(id: string) {
    let appointment = new AppointmentModel();
    appointment._id = id;
    let headers = this.createRequestHeader();

    return this.http.post(this.ROOT_URL + "/remove", appointment, { headers: headers });
  }

  //http post request for updating an appointment of the user
  updateApp(appointment: AppointmentModel) {
    let headers = this.createRequestHeader();
    return this.http.post(this.ROOT_URL + "/update", appointment, { headers: headers });
  }

  //public appointments#########################################################

  fetchPublicAppointments(dates: string[]): Observable<AppointmentModel[]> {
    //append request header
    let headers = this.createRequestHeader();
    let data = JSON.stringify(dates);
    headers = headers.append("dateParams", data);

    return this.http.get<AppointmentModel[]>(this.ROOT_URL + "/search", { headers: headers });
  }

  //add a public appointment to users calendar
  addAppointment(appointment: AppointmentModel) {
    let headers = this.createRequestHeader();
    return this.http.post(this.ROOT_URL + "/add", appointment, { headers: headers });
  }



  //http post request with an invitation for an other user
  sendInvite(invite) {
    let headers = this.createRequestHeader();
    return this.http.post(this.ROOT_URL + "/invite", invite, { headers: headers });
  }

  //http get request for users invitations
  fetchInvites(): Observable<AppointmentModel[]> {
    let headers = this.createRequestHeader();
    return this.http.get<AppointmentModel[]>(this.ROOT_URL + "/invites", { headers: headers });
  }

  //http post request with user response for invitation
  answerInvite(answer: InviteAnswerModel) {
    let headers = this.createRequestHeader();
    return this.http.post(this.ROOT_URL + "/accept", answer, { headers: headers });
  }

  //call change event if events changed
  changed() {
    this.messageSource.next("changed");
  }

  //create request header with authorization token of the user stored in the auth service
  createRequestHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer " + this.authService.getToken());
    return headers;
  }

  //get and set selected date for updating the month calendar
  getSelectedDate(): Date {
    return this.selectedDate;
  }

  setSelectedDate(date: Date) {
    this.selectedDate = date;
    this.messageSource.next("date changed");
  }
}
