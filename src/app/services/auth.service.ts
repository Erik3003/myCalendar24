import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from 'src/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isLoggedIn: boolean = false;
  token: string;
  user:UserModel;

  readonly ROOT_URL = 'http://localhost:3000/api/user';

  registerUser(user: UserModel){
    return this.http.post(this.ROOT_URL+"/register", user);      
  }

  loginUser(user: UserModel){
    return this.http.post(this.ROOT_URL+"/login", user);
  }

  logoutUser(){
    this.isLoggedIn = false;
    this.token = "";
  }

  loggedIn():boolean{
    return this.isLoggedIn;
  }

  getToken():string{
    return this.token;
  }

  setToken(token:string){
    this.token = token;
    this.isLoggedIn = true;
  }

  getUser():UserModel{
    return this.user
  }

  setUser(user: UserModel){
    this.user = user;
  }

}
