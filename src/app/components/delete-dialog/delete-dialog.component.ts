/*
 * This component is represented in a Dialog and apears after clicking on the
 * delete button of the appointment dialog. It asks if the user is sure of the
 * deleting operation and call the appointment service for deleting.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DisplayAppointmentComponent } from '../display-appointment-dialog/display-appointment.component';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  appointmentID: string;
  parentDialog: MatDialogRef<DisplayAppointmentComponent>;

  constructor(
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //getting data from opening window
    this.appointmentID = data.appId;
    this.parentDialog = data.dialog;
  }

  ngOnInit() {
  }

  /*calling service for deleting on clicking accept and close the dialogs.
   * Afterward call the service changed function to tell other subscribing
   * components, that the appointments changed.
   */
  onDelete() {
    this.appointmentService.removeApp(this.appointmentID).subscribe(data => console.log(data));
    this.onClose();
    this.parentDialog.close();
    this.appointmentService.changed();
  }

  //close the dialog
  onClose() {
    this.dialogRef.close();
  }

}
