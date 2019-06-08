/*
 *This component represents a dialog with a form to invite a user to an 
 *appointment. 
 */

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-invite-form-dialog',
  templateUrl: './invite-form-dialog.component.html',
  styleUrls: ['./invite-form-dialog.component.css']
})
export class InviteFormDialogComponent implements OnInit {

  inviteForm: FormGroup;
  userID: string;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private dialogRef: MatDialogRef<InviteFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userID = data.appId;
  }

  //create form
  ngOnInit() {
    this.inviteForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]]
    });
  }

  //sending invite to server
  onSubmit() {
    let invite = {
      appointment: { _id: this.userID },
      target: { username: this.inviteForm.get("name").value }
    };

    //errorhandling#################################################
    this.appointmentService.sendInvite(invite).subscribe(data => console.log(data));
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }

  get name() {
    return this.inviteForm.get("name");
  }

}
