/*
 * This component displays the login form. It consists functions for validating 
 * the users input and sends valid input to the authentification service.
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //variable for inputting user values
  user: UserModel = new UserModel();

  //form with username and password
  loginForm: FormGroup;

  //boolean to display error message
  isLogginError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  //creating login form with username, password and validators
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

  /*getting the inputs of the form and call the service for authentification.
    route to the main calendar if the login is successful.*/
  submitLogin() {
    this.user.username = this.loginForm.get('name').value;
    this.user.password = this.loginForm.get('password').value;

    this.authService.loginUser(this.user).subscribe((data: any) => {
      this.authService.setUser(data.User);
      this.authService.setToken(data.token);
      this.router.navigate(['/calendar']);
    },
      (err: HttpErrorResponse) => {
        this.isLogginError = true;
      });
  }

  //getter for validating inputs in form
  get name() {
    return this.loginForm.get('name');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
