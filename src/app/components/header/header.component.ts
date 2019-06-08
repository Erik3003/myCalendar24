/*
 * The header component uses the authentification service to get information, if the user is logged in.
 * This information is needed to display or hide buttons for navigation.
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { InvitesDialogComponent } from '../invites-dialog/invites-dialog.component';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean;
  hasInvites: boolean;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {
    this.isLoggedIn = this.authService.loggedIn();
    this.getInvites();
  }

  ngOnInit() {

  }

  //fetch if user has any invites
  async getInvites() {
    if (this.isLoggedIn) {
      const data = await this.appointmentService.fetchInvites().toPromise();
      let invites = data;
      if (invites.length != 0) {
        this.hasInvites = true;
      }
    }
  }

  //open invite list
  onInvitesClick() {
    this.dialog.open(InvitesDialogComponent);
  }
}
