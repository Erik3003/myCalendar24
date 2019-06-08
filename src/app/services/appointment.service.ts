import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppointmentModel } from 'src/models/appointment.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { InviteAnswerModel } from 'src/models/inviteAnswer.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  appointments: AppointmentModel[];
  hasInvites: boolean;
  
  readonly ROOT_URL = 'http://localhost:3000/api/appointment';

  constructor(private http: HttpClient, private authService: AuthService) { 
  } 

  CreateNewAppointment(appointment: AppointmentModel){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());

    return this.http.post(this.ROOT_URL + "/new", appointment, {headers:headers});
  }
  
  fetchAppointments(month,year): Observable<AppointmentModel[]>{
    //create date format for header information
    let date = new Date(year,month);
    let isodate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    
    //append request header
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    headers = headers.append("dateParams", isodate);

    return this.http.get<AppointmentModel[]>(this.ROOT_URL + "/get",{headers:headers});
  }

  removeApp(id:string){
    let appointment = new AppointmentModel();
    appointment._id = id;
    console.log(appointment);
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    
    return this.http.post(this.ROOT_URL + "/remove", appointment, {headers:headers});
  }

  updateApp(appointment: AppointmentModel){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    return this.http.post(this.ROOT_URL + "/update", appointment, {headers:headers});
  }

  sendInvite(invite){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    return this.http.post(this.ROOT_URL + "/invite", invite, {headers:headers});
  }

  fetchInvites(): Observable<AppointmentModel[]>{
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    return this.http.get<AppointmentModel[]>(this.ROOT_URL + "/invites",{headers:headers});
  }

  answerInvite(answer:InviteAnswerModel){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    return this.http.post(this.ROOT_URL + "/accept",answer,{headers:headers});
  }

  changed(){
    
  }
}
