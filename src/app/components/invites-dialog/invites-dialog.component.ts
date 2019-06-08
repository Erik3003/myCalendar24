import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentModel } from 'src/models/appointment.model';

@Component({
  selector: 'app-invites-dialog',
  templateUrl: './invites-dialog.component.html',
  styleUrls: ['./invites-dialog.component.css']
})
export class InvitesDialogComponent implements OnInit {

  invites= [];

  constructor(
    private appService: AppointmentService
  ) { 
    this.getInvites();
  }

  ngOnInit() {
  }

  async getInvites(){
    const data = await this.appService.fetchInvites().toPromise();
    this.invites = data;
    console.log(this.invites);
  }

}
