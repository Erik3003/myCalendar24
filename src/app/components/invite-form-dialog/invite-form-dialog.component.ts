/*
 *This component represents a dialog with a form to invite a user to an 
 *appointment by entering its username. 
 */

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppointmentService } from 'src/app/services/appointment.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invite-form-dialog',
  templateUrl: './invite-form-dialog.component.html',
  styleUrls: ['./invite-form-dialog.component.css']
})
export class InviteFormDialogComponent implements OnInit {

  //form for entering username
  inviteForm: FormGroup;

  //id of the selected appointment
  appointmentID: string;

  //boolean for displaying error message
  nameError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private dialogRef: MatDialogRef<InviteFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //fetching id of appointment from opening window
    this.appointmentID = data.appId;
  }

  //create form for entering username of invited user
  ngOnInit() {
    this.inviteForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]]
    });
  }

  /*calling appointment service for sending invitation to the selected user 
    or display an error message.*/
  onSubmit() {
    let invite = {
      appointment: { _id: this.appointmentID },
      target: { username: this.inviteForm.get("name").value }
    };

    this.appointmentService.sendInvite(invite).subscribe(data => {
      this.onClose();
    },
      (err: HttpErrorResponse) => {
        if (err.status == 400) {
          this.nameError = true;
        }
      });

  }

  //closing the dialog on clicking abort
  onClose() {
    this.dialogRef.close();
  }

  //getter for form validation
  get name() {
    return this.inviteForm.get("name");
  }

}
