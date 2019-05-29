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

  readonly ROOT_URL_POST = 'http://httpbin.org/post';

  registerUser(user: RegisterModel){
    this.http.post(this.ROOT_URL_POST, user).subscribe(data => {console.log(data)});    
/*    
    this.http.post(this.ROOT_URL_POST, user).subscribe(data=>{
      if (data.success){
        console.log("register successful");
        //navigate to login, display message
      }else{
        console.log("failed to register");
      }
    });
*/
  }

  authUser(user: LoginModel){
    this.http.get('http://echo.jsontest.com/key/value/one/two').toPromise().then(data =>{console.log(data)});
  }

  loggedIn():boolean{
    return this.isLoggedIn;
  }

  setLoggin(){
    this.isLoggedIn = true;
  }
}
