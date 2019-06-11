/*
 * This service is for sending request of registration and login of the given user
 * and returning the requests to the calling components.
 * It also stores values if the user is logged in and its authorization token.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from 'src/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //boolean if the user is logged in for header navigation buttons
  isLoggedIn: boolean = false;

  //authorization token for the request header
  token: string;

  //object which is send in a http request to the server
  user: UserModel;

  //URL of the servers user routes
  readonly ROOT_URL = 'http://localhost:3000/api/user';

  //sending post request for registration of a user and returning response
  registerUser(user: UserModel) {
    return this.http.post(this.ROOT_URL + "/register", user);
  }

  //sending post request for login a user and returning response
  loginUser(user: UserModel) {
    return this.http.post(this.ROOT_URL + "/login", user);
  }

  //logout the user by deleting its token
  logoutUser() {
    this.isLoggedIn = false;
    this.token = "";
  }

  //get if the user is logged in
  loggedIn(): boolean {
    return this.isLoggedIn;
  }

  //setting token for authorizationafter loggin in
  setToken(token: string) {
    this.token = token;
    this.isLoggedIn= true;
  }

  //get token for appending it to the resonse header of in the services
  getToken(): string {
    return this.token;
  }

  //returning information about the user
  getUser(): UserModel {
    return this.user
  }

  //set user after loggin in
  setUser(user: UserModel) {
    this.user = user;
  }

}
