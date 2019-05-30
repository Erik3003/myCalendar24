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
      email: ['', [
        Validators.required,
        Validators.email
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
    console.log(this.authService.loggedIn());
    this.authService.setLoggin();
    console.log(this.authService.loggedIn());
    this.router.navigate(['/']);
    /*this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    console.log("Logging in...");
    this.authService.authUser(this.user);*/
  }

  //getter for validating  inputs in html
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
