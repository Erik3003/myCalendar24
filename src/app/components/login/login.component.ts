/*
 * This component displays the login form.
 * It consists functions for validating the users input and sends valid input to the authentification service.
 */

import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../../models/login.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: LoginModel = new LoginModel;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  //creating login form
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]]
    });
  }

  //getting the inputs and calling service for authentification
  submitLogin() {
    console.log("comp eingeloggt"+this.authService.loggedIn());
    this.user.username = this.loginForm.get('name').value;
    this.user.password = this.loginForm.get('password').value;
    console.log("comp Logging in...");
    let logedIn = this.authService.loginUser(this.user);
    if(logedIn){
      console.log("comp eingeloggt"+this.authService.loggedIn());
      this.router.navigate(['/calendar']);
    }
    console.log("comp service beendet");
       
  }

  //getter for validating  inputs in html
  get name() {
    return this.loginForm.get('name');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
