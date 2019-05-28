import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OptionsInput} from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import { FullCalendarComponent } from '@fullcalendar/angular';

import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  options: OptionsInput;
  eventsModel: any;
  fullcalendar: FullCalendarComponent;

  ngOnInit() {
    this.options = {
      editable: true,
      header: {
        left: 'dayGridMonth,dayGridWeek,dayGridDay',
        center: 'title',
        right: 'prev,next today'
      },
      plugins: [dayGridPlugin],
      locale: deLocale,
      events: []
    };
    this.service.getApps().subscribe(data => this.options.events);
    console.log(this.options.events);
  }

  eventClick(model) {
    console.log(model);
  }
  eventDragStop(model) {
    console.log(model);
  }
  dateClick(model) {
    console.log(model);
  }


  constructor(private service: AppointmentService) { }

  /*ngOnInit() {
    this.service.getData().subscribe(data => this.calendarEvents = data);
  }*/

}
