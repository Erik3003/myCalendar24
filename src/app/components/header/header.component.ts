/*
 * The header component uses the authentification service to get information, if the user is logged in.
 * This information is needed to display or hide buttons for navigation.
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn:boolean;

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.loggedIn();
  }

}
