/*
 * The header component represents the angular material bar on the top. It consists
 * of the navigation links for the page.
 * It uses the authentification service to get information, if the user is logged in.
 * This information is needed to display or hide buttons for navigation.
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { InvitesDialogComponent } from '../invites-dialog/invites-dialog.component';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Router } from '@angular/router';
import { CustomizeCategoriesComponent } from '../customize-categories/customize-categories.component';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //booleans to show or hide html elements
  isLoggedIn: boolean;
  hasInvites: boolean;

  //variable with user information
  user: UserModel;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private router: Router
  ) {
    //check in authentication service if the user is logged in
    this.user = new UserModel();
    this.isLoggedIn = this.authService.loggedIn();
    //check if the user has invites
    this.getInvites();
  }

  ngOnInit() {
    if (this.isLoggedIn) {
      this.user = this.authService.getUser();
    }
  }

  //fetch if user has any invites to display a colored button in the header
  async getInvites() {
    if (this.isLoggedIn) {
      const data = await this.appointmentService.fetchInvites().toPromise();
      let invites = data;
      if (invites.length != 0) {
        this.hasInvites = true;
      }
    }
  }

  //open dialog with a list of invitations
  onInvitesClick() {
    this.dialog.open(InvitesDialogComponent);
  }

  //logging out and route to login
  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }

  //open customize category dialog
  onUpdateCategories() {
    this.dialog.open(CustomizeCategoriesComponent);
  }
}
