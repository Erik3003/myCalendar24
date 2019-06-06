import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterModel } from 'src/models/register.model';
import { LoginModel } from 'src/models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isLoggedIn: boolean = false;

  token: string;

  readonly ROOT_URL_POST = 'http://httpbin.org/post';

  registerUser(user: RegisterModel){
    this.http.post("http://localhost:3000/api/user/register", user).subscribe((data: any)=> {
      console.log(data);
      if (data.token != null){
        this.isLoggedIn = true;
        this.token = data.token;
        console.log("erfolgreich registriert.");
      }else{
        console.log("registrierung fehlgeschlagen");    
      }
    });    
  }

  loginUser(user: LoginModel){
    this.http.post("http://localhost:3000/api/user/login", user).subscribe((data: any)=> {
      if (data.token != null){
        this.isLoggedIn = true;
        this.token = data.token;
        console.log("erfolgreich eingeloggt");
      }else{
        console.log("login fehlgeschlagen");     
      }
    });
  }

  loggedIn():boolean{
    return this.isLoggedIn;
  }
}
