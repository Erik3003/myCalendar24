import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppointmentModel } from '../../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { CreateCategoryComponent } from '../create-category-dialog/create-category.component';
import { MatDialog } from '@angular/material';
import { DateUtilsService } from 'src/app/services/date-utils.service';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {

  //form for entering appointment information
  appointmentForm: FormGroup;
  appointment: AppointmentModel = new AppointmentModel();

  //variable for available categories
  categories: CategoryModel[] = [];

  //variables for date selection
  today: Date;
  selectedStartDate;
  selectedEndDate;
  selectedTime: string;
  minTime: string;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private catService: CategoryService,
    private dateUtils: DateUtilsService,
    private router: Router,
    private dialog: MatDialog
  ) {
    //setting current date as html-input default value
    this.today = new Date();

    //setting next hour as html-input default value
    let hours = this.today.getHours();
    if (hours < 23) {
      this.selectedTime = (hours + 1).toString() + ":00";
    } else {
      this.selectedTime = '00:00';
    }
    this.minTime = this.selectedTime;

    //setting time for start date to 00:00:00
    this.today.setHours(0);
    this.today.setMinutes(0);
    this.today.setSeconds(0);
    this.today.setMilliseconds(0);
    this.selectedStartDate = this.today;

    //fetch categories
    this.loadCategories();

    //fetching if a category was added
    this.catService.currentMessage.subscribe(message => {
      if (message == "form changed") {
        setTimeout(() => { this.loadCategories() }, 200);
      }
    });

  }

  //creating appointment form
  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      date: [this.today, [
        Validators.required,
      ]],
      time: [this.selectedTime,
      Validators.required
      ],
      enddate: [this.today,
      Validators.required
      ],
      endtime: ['',
        Validators.required
      ],
      category: ['',
        Validators.required
      ],
      description: [' ',
      ],
      public: [false,
      ]
    });
  }

  //updating values if input is changed for validating end date >= start date
  changeStartDate() {
    this.selectedStartDate = this.appointmentForm.get('date').value;
    this.selectedEndDate = this.appointmentForm.get('enddate').value;
  }

  changeEndDate() {
    this.selectedEndDate = this.appointmentForm.get('enddate').value;
    if (this.selectedEndDate.getTime() === this.selectedStartDate.getTime()) {
      this.minTime = this.selectedTime;
    } else {
      this.minTime = "00:00";
    }
  }

  //setting mintime for endtime
  changeTime() {
    this.selectedTime = this.appointmentForm.get('time').value;
    this.minTime = this.selectedTime;
  }

  //getting valid input values from form and call the appointment service to make a http post request
  submitAppointment() {
    //get values of form
    this.appointment.title = this.appointmentForm.get('title').value;
    this.appointment.description = this.appointmentForm.get('description').value;
    this.appointment.public = this.appointmentForm.get('public').value;
    this.appointment.category = this.appointmentForm.get("category").value;

    this.appointment.date = this.dateUtils.calculateDate(this.appointmentForm.get('date').value, this.appointmentForm.get('time').value);
    this.appointment.enddate = this.dateUtils.calculateDate(this.appointmentForm.get('enddate').value, this.appointmentForm.get('endtime').value);

    //calling service to send data to server
    this.appointmentService.CreateNewAppointment(this.appointment).subscribe(data => {
      console.log(data);
      this.router.navigate(['/calendar']);
    });
  }

  //open dialog to create categorie
  onCategoryCreate() {
    this.dialog.open(CreateCategoryComponent, {
      data: {
        element: "form",
      }
    });
  }

  //load categorie and create array for choices
  async loadCategories() {
    const data = await this.catService.fetchCategories().toPromise();
    this.categories = data;
  }

  //getter for validating form in html
  get title() {
    return this.appointmentForm.get('title');
  }
  get date() {
    return this.appointmentForm.get('date');
  }
  get time() {
    return this.appointmentForm.get('time');
  }
  get enddate() {
    return this.appointmentForm.get('enddate');
  }
  get endtime() {
    return this.appointmentForm.get('endtime');
  }
  get description() {
    return this.appointmentForm.get('description');
  }
}

