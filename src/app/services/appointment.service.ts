import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppointmentModel } from 'src/models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  items=[];
  //readonly ROOT_URL_POST = 'http://httpbin.org/post';

  CreateNewAppointment(appointment: AppointmentModel){
    this.http.post("http://localhost:3000/api/appointment/new", appointment).toPromise().then((data: any) =>{
      if (data.Success){
        console.log("Termin erfolreich erstellt");
        console.log(data);
      }
    });
  }
  
  getApps(): Observable<AppointmentModel[]>{
    //this.http.get("http://localhost:3000/api/appointment/get").toPromise().then((data: any)=>{console.log(data);});
    return this.http.get<AppointmentModel[]>("http://localhost:3000/api/appointment/get");
  }
}
