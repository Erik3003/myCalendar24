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
    this.http.post("http://localhost:3000/api/user/register", user).subscribe( (data: any) => {
      if (data.token != null){
        this.isLoggedIn = true;
        this.token = data.token;
        console.log("erfolgreich registriert");      
      }else{
        console.log("registrierung fehlgeschlagen");
      }
    },
    error => {
      console.log("fehler", error)
    }
    );    
  }

  loginUser(user: LoginModel):boolean{
    this.http.post("http://localhost:3000/api/user/login", user).subscribe( (data: any) => {
      if (data.token != null){
        this.isLoggedIn = true;
        this.token = data.token;
        console.log("service erfolgreich eingeloggt: "+this.isLoggedIn); 
      }else{
        console.log("service login fehlgeschlagen");
      }   
    console.log("service eingeloggt: "+this.isLoggedIn);  
    });
    console.log("return");
    return true;  
  }

  loggedIn():boolean{
    return this.isLoggedIn;
  }

  getToken():string{
    return this.token;
  }
}
