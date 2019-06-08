/*
 * This component displays a list of appointment invitations for the user.
 * The list is represented as a pop up dialog after clicken the icon.
 */

import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentModel } from 'src/models/appointment.model';

@Component({
  selector: 'app-invites-dialog',
  templateUrl: './invites-dialog.component.html',
  styleUrls: ['./invites-dialog.component.css']
})
export class InvitesDialogComponent implements OnInit {

  invites : AppointmentModel[]= [];
  hasInvites: boolean;

  constructor(
    private appService: AppointmentService
  ) { 
    this.getInvites();
  }

  ngOnInit() {
  }

  //fetch invites from server
  async getInvites(){
    const data = await this.appService.fetchInvites().toPromise();
    this.invites = data;
    if(this.invites.length == 0){
      this.hasInvites = true;
    }
  }

}
