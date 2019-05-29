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
    console.log(this.authService.loggedIn());
    this.authService.setLoggin();
    console.log(this.authService.loggedIn());
    this.router.navigate(['/']);
    /*this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    console.log("Logging in...");
    this.authService.authUser(this.user);*/
  }
}
