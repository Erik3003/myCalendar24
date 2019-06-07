import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppointmentModel } from 'src/models/appointment.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RemoveAppModel } from 'src/models/removeApp.model';
import { KategorieModel } from 'src/models/kategorie.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  appointments: AppointmentModel[];
  kategories: KategorieModel[];
  readonly ROOT_URL = 'http://localhost:3000/api/appointment';

  CreateNewAppointment(appointment: AppointmentModel){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    console.log(headers);

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
    let appointment = new RemoveAppModel();
    appointment._id = id;
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    
    this.http.post(this.ROOT_URL + "/remove", appointment, {headers:headers});
  }

  fetchKategories(){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());

    return this.http.get(this.ROOT_URL + "/getKategories", {headers:headers});
  }

//getter and setter ----------------------------------------------------------------------------------------------

  setAppointments(appointments: AppointmentModel[]){
    this.appointments = appointments;
  }

  getAppointments():AppointmentModel[]{
    return this.appointments
  }

  setKategories(kategories: KategorieModel[]){
    this.kategories = kategories;
  }

  getKategories():KategorieModel[]{
    return this.kategories;
  }
}
