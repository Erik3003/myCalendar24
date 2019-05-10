import { Component, OnInit } from '@angular/core';
import { RegisterModel } from '../../../models/register.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: RegisterModel = new RegisterModel();
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      'name': [this.user.name,[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
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

  submitRegister(){
    this.user.name = this.registerForm.get('name').value;
    this.user.email = this.registerForm.get('email').value;
    this.user.password = this.registerForm.get('passwort').value;

    console.log("registering...");
    this.authService.registerUser(this.user);
  }
}
