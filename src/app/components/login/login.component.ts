import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../../models/login.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': [this.user.email,[
        Validators.required,
        Validators.email
      ]],
      'passwort': [this.user.password,[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]]
    });
  }

  submitLogin(){
    this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    console.log("Logging in...");
    this.authService.authUser(this.user);
  }
}
