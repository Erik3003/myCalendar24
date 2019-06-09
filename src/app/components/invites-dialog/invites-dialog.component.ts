/*
 * This component displays a list of appointment invitations for the user.
 * The list is represented as a pop up dialog after clicken the icon.
 */

import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentModel } from 'src/models/appointment.model';
import { InviteAnswerModel } from 'src/models/inviteAnswer.model';
import { MatDialogRef } from '@angular/material';
import { CustumDateModel } from 'src/models/costumDate.model';

@Component({
  selector: 'app-invites-dialog',
  templateUrl: './invites-dialog.component.html',
  styleUrls: ['./invites-dialog.component.css']
})
export class InvitesDialogComponent implements OnInit {

  invites: AppointmentModel[] = [];
  inviteDate: CustumDateModel[] = [];
  hasInvites: boolean;
  inviteAnswer: InviteAnswerModel;


  constructor(
    private appointmentService: AppointmentService,
    private dialogRef: MatDialogRef<InvitesDialogComponent>
  ) {
    this.inviteAnswer = new InviteAnswerModel();
    this.getInvites();
  }

  ngOnInit() {
  }

  //fetch invites from server
  async getInvites() {
    const data = await this.appointmentService.fetchInvites().toPromise();
    this.invites = data;

    console.log(this.invites.length);
    //getting the date components out of the invitation data
    for (let j = 0; j < this.invites.length; j++) {
      this.inviteDate[j] = new CustumDateModel();
      this.inviteDate[j].endyear = this.invites[j].enddate.substr(0, 4);
      this.inviteDate[j].endmonth = this.invites[j].enddate.substr(5, 2);
      this.inviteDate[j].endday = this.invites[j].enddate.substr(8, 2);
      this.inviteDate[j].endhours = this.invites[j].enddate.substr(11, 2);
      this.inviteDate[j].endminutes = this.invites[j].enddate.substr(14, 2);
      this.inviteDate[j].startyear = this.invites[j].date.substr(0, 4);
      this.inviteDate[j].startmonth = this.invites[j].date.substr(5, 2);
      this.inviteDate[j].startday = this.invites[j].date.substr(8, 2);
      this.inviteDate[j].starthours = this.invites[j].date.substr(11, 2);
      this.inviteDate[j].startminutes = this.invites[j].date.substr(14, 2);
      console.log(this.inviteDate[j].startday);
    }

      if (this.invites.length !== 0) {
        this.hasInvites = true;
      }
    
  }

  //accepting invite
  onAnswer(index: number, answer: boolean) {
    this.inviteAnswer._id = this.invites[index]._id;
    this.inviteAnswer.accept = answer;
    this.appointmentService.answerInvite(this.inviteAnswer).subscribe(data => {
      console.log(data);
      if (answer) {
        this.appointmentService.changed();
        this.dialogRef.close();
      }
    });
  }

}
