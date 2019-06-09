/*
 * This component displays the register form.
 * It consists functions for validating the users input and sends valid input to the authentification service.
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MyErrorStateMatcher } from 'src/app/class/my-error-state-matcher';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: UserModel = new UserModel();
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  isRegisterError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private categoryService: CategoryService,
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

    this.authService.registerUser(this.user).subscribe( (data:any) =>{
      this.authService.setToken(data.token);
      //adding default categories
      let defaultCategory = new CategoryModel();
      defaultCategory.title = "Privat";
      defaultCategory.color = "lightblue";
      this.categoryService.createCategory(defaultCategory).subscribe();
      defaultCategory.title = "Beruf";
      defaultCategory.color = "lightgreen";
      this.categoryService.createCategory(defaultCategory).subscribe();

      this.router.navigate(['/calendar']);
    },
    (err: HttpErrorResponse) => {
      this.isRegisterError = true;     
    });
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
