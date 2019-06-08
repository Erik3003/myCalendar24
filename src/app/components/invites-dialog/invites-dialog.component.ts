/*
 * This component displays a list of appointment invitations for the user.
 * The list is represented as a pop up dialog after clicken the icon.
 */

import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentModel } from 'src/models/appointment.model';
import { InviteAnswerModel } from 'src/models/inviteAnswer.model';

@Component({
  selector: 'app-invites-dialog',
  templateUrl: './invites-dialog.component.html',
  styleUrls: ['./invites-dialog.component.css']
})
export class InvitesDialogComponent implements OnInit {

  invites : AppointmentModel[]= [];
  hasInvites: boolean;
  inviteAnswer: InviteAnswerModel;

  constructor(
    private appService: AppointmentService
  ) { 
    this.inviteAnswer = new InviteAnswerModel();
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

  //accepting invite
  onAnswer(index:number, answer:boolean){  
    this.inviteAnswer._id = this.invites[index]._id;
    this.inviteAnswer.accept = answer;
    this.appService.answerInvite(this.inviteAnswer).subscribe(data=>console.log(data));
    
    console.log(index);
    
    let div = document.getElementById(index.toString());
    let parent = div.parentNode;
    div.parentNode.removeChild(div);

    if(!parent.hasChildNodes()){
      console.log(" kein element mehr");   
    }else{
      console.log(" noch was da"); 
    }
  }

}
