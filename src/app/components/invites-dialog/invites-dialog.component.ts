/*
 * This component displays a list of appointment invitations for the user.
 * The list is represented as a pop up dialog after clicken the header icon.
 * The user can accept or delete the invitations from the list.
 */

import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentModel } from 'src/models/appointment.model';
import { InviteAnswerModel } from 'src/models/inviteAnswer.model';
import { MatDialogRef } from '@angular/material';
import { CustumDateModel } from 'src/models/costumDate.model';
import { DateUtilsService } from 'src/app/services/date-utils.service';

@Component({
  selector: 'app-invites-dialog',
  templateUrl: './invites-dialog.component.html',
  styleUrls: ['./invites-dialog.component.css']
})
export class InvitesDialogComponent implements OnInit {

  //array of appointments to which the user is invited
  invites: AppointmentModel[] = [];

  //array of customized date format for each invitation
  inviteDate: CustumDateModel[] = [];

  //boolean to display no ivites message
  hasInvites: boolean;

  //object with the response to the invitation
  inviteAnswer: InviteAnswerModel;

  constructor(
    private appointmentService: AppointmentService,
    private dialogRef: MatDialogRef<InvitesDialogComponent>,
    private dateUtils: DateUtilsService
  ) {
    //loading users invitations
    this.inviteAnswer = new InviteAnswerModel();
    this.getInvites();
  }

  ngOnInit() {
  }

  //fetch invitations by calling the appointment service 
  async getInvites() {
    const data = await this.appointmentService.fetchInvites().toPromise();
    this.invites = data;

    /*getting the date components out of the invitation data to display in 
      a customized format.*/
    for (let j = 0; j < this.invites.length; j++) {
      this.inviteDate[j] = new CustumDateModel();
      this.inviteDate[j] = this.dateUtils.getCustomFormat(this.invites[j].date,this.invites[j].enddate);
    }

    //checking if the user has no invitations to display message
    if (this.invites.length !== 0) {
      this.hasInvites = true;
    }

  }

  //accepting invitation by calling the appointment service
  onAnswer(index: number, answer: boolean) {
    this.inviteAnswer._id = this.invites[index]._id;
    this.inviteAnswer.accept = answer;
    this.appointmentService.answerInvite(this.inviteAnswer).subscribe(data => {
      if (answer) {
        this.appointmentService.changed();
      }
    });
    setTimeout(()=>{this.getInvites(),200});
  }

}
