import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-display-appointment',
  templateUrl: './display-appointment.component.html',
  styleUrls: ['./display-appointment.component.css']
})
export class DisplayAppointmentComponent implements OnInit {

  endYear;
  endMonth;
  endDay;
  endHours;
  endMinutes;

  startYear;
  startMonth;
  startDay;
  startHours;
  startMinutes;

  constructor(public dialogRef: MatDialogRef<DisplayAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {
      this.endYear = data.event.enddate.substr(0,4);
      this.endMonth = data.event.enddate.substr(5,2);
      this.endDay = data.event.enddate.substr(8,2);
      this.endHours = data.event.enddate.substr(11,2);
      this.endMinutes = data.event.enddate.substr(14,2);
      this.startYear = data.event.date.substr(0,4);
      this.startMonth = data.event.date.substr(5,2);
      this.startDay = data.event.date.substr(8,2);
      this.startHours = data.event.date.substr(11,2);
      this.startMinutes = data.event.date.substr(14,2);
     }

  ngOnInit() {
  }

  
}
