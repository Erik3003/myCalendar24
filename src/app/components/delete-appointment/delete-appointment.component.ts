import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-delete-appointment',
  templateUrl: './delete-appointment.component.html',
  styleUrls: ['./delete-appointment.component.css']
})
export class DeleteAppointmentComponent implements OnInit {

  appointment;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private appointmentService: AppointmentService,
    private dialogRef: MatDialogRef<DeleteAppointmentComponent>
    ) { 
    this.appointment = data.event;
  }

  ngOnInit() {
  }

  onCommit(){
    this.appointmentService.removeApp(this.appointment._id).subscribe((data: any)=>{
      console.log("delete");
      this.dialogRef.close();
    });
  }

}
