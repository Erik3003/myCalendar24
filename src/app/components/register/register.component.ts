/*
 * This component displays the register form.
 * It consists functions for validating the users input and sends valid input to the authentification service.
 */

import { Component, OnInit } from '@angular/core';
import { RegisterModel } from '../../../models/register.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MyErrorStateMatcher } from 'src/app/class/my-error-state-matcher';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: RegisterModel = new RegisterModel();
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  //creating register form with validators
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]],
      confirmPassword: ['']
    }, { validator: this.checkPassword });
  }

  //getting input and calling http service for registration
  submitRegister() {
    this.user.username = this.registerForm.get('name').value;
    this.user.email = this.registerForm.get('email').value;
    this.user.password = this.registerForm.get('password').value;

    console.log("registering...");
    this.authService.registerUser(this.user).subscribe(
      res => {
        console.log("erfolreich")
        console.log(res);
        
        //setTimeout(() => this.showSucessMessage = false, 4000);
        //this.resetForm(form);
      },
      err =>{

      });
    //this.router.navigate(['/login']);
    }

  //check if the entered passwords matches
  checkPassword(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass == confirmPass ? null : { notSame: true };
  }

  //getter for validating form inputs
  get name() {
    return this.registerForm.get('name');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  get email() {
    return this.registerForm.get('email');
  }

}
