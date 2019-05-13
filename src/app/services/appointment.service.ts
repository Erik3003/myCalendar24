import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppointmentModel } from 'src/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  //readonly ROOT_URL_POST = 'http://httpbin.org/post';

  CreateNewAppointment(appointment: AppointmentModel){
    this.http.post("http://localhost:3000/api/appointment/new", appointment).toPromise().then((data: any) =>{
      if (data.Success){
        console.log("Termin erfolreich erstellt");
      }
    });
  }
}
