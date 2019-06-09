/*
 * This component displays the login form.
 * It consists functions for validating the users input and sends valid input to the authentification service.
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from 'src/app/services/category.service';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  loginForm: FormGroup;
  isLogginError:boolean;

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
    this.user.username = this.loginForm.get('name').value;
    this.user.password = this.loginForm.get('password').value;
    
    this.authService.loginUser(this.user).subscribe( (data:any) =>{
      this.authService.setUser(data.User);
      this.authService.setToken(data.token);
      this.router.navigate(['/calendar']);
    },
    (err: HttpErrorResponse) => {
      this.isLogginError = true;     
    });
  }

  //getter for validating  inputs in html
  get name() {
    return this.loginForm.get('name');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
