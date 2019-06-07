import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppointmentModel } from 'src/models/appointment.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RemoveAppModel } from 'src/models/removeApp.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  items=[];
  //readonly ROOT_URL_POST = 'http://httpbin.org/post';

  CreateNewAppointment(appointment: AppointmentModel){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    console.log(headers);

    this.http.post("http://localhost:3000/api/appointment/new", appointment, {headers:headers}).toPromise().then((data: any) =>{
      if (data.Success){
        console.log("Termin erfolreich erstellt");
        console.log(data);
      }
    });
  }
  
  getApps(month,year): Observable<AppointmentModel[]>{
    let date = new Date(year,month);
    let isodate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    console.log(isodate);
    

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    headers = headers.append("dateParams", isodate);
    return this.http.get<AppointmentModel[]>("http://localhost:3000/api/appointment/get",{headers:headers});
  }

  removeApp(id:string){
    let appointment = new RemoveAppModel();
    appointment._id = id;
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "bearer "+this.authService.getToken());
    console.log("request");
    
    this.http.post("http://localhost:3000/api/appointment/remove", appointment, {headers:headers});
  }
}
