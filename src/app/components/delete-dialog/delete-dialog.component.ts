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

  appId: string;
  parentDialog: MatDialogRef<DisplayAppointmentComponent>;

  constructor(
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.appId = data.appId;
    this.parentDialog = data.dialog;
  }

  ngOnInit() {
  }

  //calling service for deleting
  onDelete(){
    this.appointmentService.removeApp(this.appId).subscribe(data => console.log(data));
    this.onClose();
    this.parentDialog.close();
    this.appointmentService.changed();
  }

  onClose(){
    this.dialogRef.close();
  }

}
