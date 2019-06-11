/*
 * This component displays the calendar with a month view. It created a table with
 * one cell for each day of the month an adds the users appointments to the right cells
 * after calling the appointment service. 
 */

import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MatDialog } from '@angular/material';
import { DisplayAppointmentComponent } from '../display-appointment-dialog/display-appointment.component';
import { CategoryService } from 'src/app/services/category.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentModel } from 'src/models/appointment.model';

@Component({
	selector: 'app-selfcalendar',
	templateUrl: './selfcalendar.component.html',
	styleUrls: ['./selfcalendar.component.css']
})
export class SelfcalendarComponent implements OnInit {

	//names of the months for the heading selector
	months = [
		{ name: "Januar", value: 0 },
		{ name: "Februar", value: 1 },
		{ name: "März", value: 2 },
		{ name: "April", value: 3 },
		{ name: "Mai", value: 4 },
		{ name: "Juni", value: 5 },
		{ name: "Juli", value: 6 },
		{ name: "August", value: 7 },
		{ name: "September", value: 8 },
		{ name: "Oktober", value: 9 },
		{ name: "November", value: 10 },
		{ name: "Dezember", value: 11 }];

	//variable for year selector
	years: number[];

	//form for selected month and year
	selectForm: FormGroup;

	//variables for the selected date
	today: Date;
	currentMonth: number;
	currentYear: number;
	daysInMonth;

	//array of appointments and categories to display them in the calendar cells
	appointments: AppointmentModel[] = [];
	categories = [];

	//boolean for disabling the onclick of a day if an appointment is clicked
	appClicked: boolean;

	//an array with one boolean for each categorie to display or hide categories
	checkedCategories: boolean[] = [];

	//subscribtions to category and appointment service to get messegas about changes
	categorySub: Subscription;
	appointmentSub: Subscription;


	constructor(
		private appointmentService: AppointmentService,
		private categoryService: CategoryService,
		private dialog: MatDialog,
		private router: Router,
		private formBuilder: FormBuilder
	) {

	}

	ngOnInit() {
		//setting calendar to current date
		this.today = new Date();
		this.currentMonth = this.today.getMonth();
		this.currentYear = this.today.getFullYear();

		//filling array with values for selectable years
		this.years = [];
		for (let i = 2000; i <= 2050; i++) {
			this.years[i - 2000] = i;
		}

		//initilizing form for month and year selection
		this.selectForm = this.formBuilder.group({
			year: [this.currentYear],
			month: [this.currentMonth]
		});

		//fetching categories if a category has been changed to hide or show
		let counter = 0;
		this.categorySub = this.categoryService.currentMessage.subscribe(message => {
			if (message == "choosen changed") {
				//disabling first fetch because of a double fetch at the beginning
				if (counter == 1) {
					counter++;
				} else {
					counter++;
					this.checkedCategories = this.categoryService.getChoosen();
					this.categories = this.categoryService.getCategories();
					this.getAppointments();
				}
			}
		});

		//fetching appointments if an appointment changed
		this.appointmentSub = this.appointmentService.currentMessage.subscribe(message => {
			if (message == "changed") {
				this.getAppointments();
			}
		});
	}

	//Unsubscribe services on destroy component
	ngOnDestroy() {
		this.categorySub.unsubscribe();
		this.appointmentSub.unsubscribe();
	}

	//loading the next month
	nextMonth() {
		this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
		this.currentMonth = (this.currentMonth + 1) % 12;
		this.updateMonthAndYear();
	}

	//loading previous month
	previousMonth() {
		this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
		this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
		this.updateMonthAndYear();
	}

	//updating selection form, initilizing new calendar and loading matching events
	updateMonthAndYear() {
		this.selectForm.controls['month'].setValue(this.currentMonth);
		this.selectForm.controls['year'].setValue(this.currentYear);
		this.initCalendar(this.currentMonth, this.currentYear);
		this.getAppointments();
	}

	//create empty calender for the selected month
	initCalendar(month, year) {
		let firstDayOfMonth = (new Date(year, month)).getDay();
		this.daysInMonth = 32 - new Date(year, month, 32).getDate();

		let tbl = document.getElementById("calendar-body");

		// clearing all previous cells
		tbl.innerHTML = "";

		// creating cells for month
		let date = 1;
		for (let i = 0; i < 6; i++) {
			// creates a table row
			let row = document.createElement("tr");

			//creating empty cells
			for (let j = 0; j < 7; j++) {
				if (i === 0 && j < firstDayOfMonth - 1) {
					let cell = document.createElement("td");
					let cellText = document.createTextNode("");
					cell.style.borderStyle = "solid";
					cell.appendChild(cellText);
					row.appendChild(cell);
				}
				else if (date > this.daysInMonth) {
					break;
				}

				//creating cells with date
				else {
					let cell = document.createElement("td");
					let cellText = document.createTextNode(date.toString());
					cell.setAttribute("id", date.toString());
					cell.classList.add("dateCell");
					cell.addEventListener("click", (event) => this.cellClicked(cell));

					//adding style for todays date
					if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
						cell.style.backgroundColor = "lightblue";
					}

					//style of cell
					cell.style.borderStyle = "solid";
					cell.style.verticalAlign = "top";
					cell.style.textAlign = "center";
					cell.style.height = "15%";
					cell.style.width = "14%";
					cell.appendChild(cellText);

					row.appendChild(cell);
					date++;
				}
			}
			//appending row to calendar body
			tbl.appendChild(row);
		}
	}

	/*calling appointment service for fetching appointments of the selected month.
	  calling the category service for fetching users categories.*/
	async getAppointments() {
		this.initCalendar(this.currentMonth, this.currentYear);
		this.appointments = [];
		const data = await this.appointmentService.fetchAppointments(this.currentMonth, this.currentYear).toPromise();
		this.appointments = data;

		const catData = await this.categoryService.fetchCategories().toPromise();
		this.categories = catData;

		this.appendAppointmentsToCell();
	}

	//calculating which events belong to which cell
	appendAppointmentsToCell() {
		//iterating through all appointments
		for (let i = 0; i < this.appointments.length; i++) {
			//integer number of date components
			let dayStart = parseInt(this.appointments[i].date.substr(8, 2));
			let monthStart = parseInt(this.appointments[i].date.substr(5, 2));
			let yaerStart = parseInt(this.appointments[i].date.substr(0, 4));
			let dayEnd = parseInt(this.appointments[i].enddate.substr(8, 2));
			let monthEnd = parseInt(this.appointments[i].enddate.substr(5, 2));
			let yearEnd = parseInt(this.appointments[i].enddate.substr(0, 4));

			//get start and end date
			let startDate = new Date(this.appointments[i].date);
			let endDate = new Date(this.appointments[i].enddate);

			//appointment only at one day
			if (startDate.getTime() === endDate.getTime()) {
				this.createAppointmentElement(i, dayStart);
			}
			//apointment at more then one day
			else if (startDate < endDate) {
				//appointment ends after displayed month
				if (this.currentYear < yearEnd || (this.currentYear == yearEnd && this.currentMonth < monthEnd - 1)) {
					dayEnd = this.daysInMonth;
				}
				//appointment startet before displayed month
				if (yaerStart < this.currentYear || (this.currentYear == yaerStart && monthStart - 1 < this.currentMonth)) {
					dayStart = 1;
				}
				let nrOfDays = dayEnd - dayStart;
				for (let j = 0; j <= nrOfDays; j++) {
					this.createAppointmentElement(i, dayStart + j);
				}
			}
		}
	}

	//creating div element for an appointment and add it to the given cell
	createAppointmentElement(eventIndex, dayId) {
		let found = false;
		let color = '';

		//check for category and if it is selected in sidebar
		for (let i = 0; i < this.categories.length; i++) {
			//for appointments which the user created
			if (!found) {
				if (this.categories[i]._id === this.appointments[eventIndex].category) {
					if (this.checkedCategories[i]) {
						color = this.categories[i].color;
						found = true;
					} else {
						return;
					}
				}
			}
		}

		//for appointments of other users (groupappointments)
		if (!found && this.checkedCategories[0]) {
			color = this.categories[0].color;
			found = true;
		}

		//creating div for the appointment at this day
		if (found) {
			let div = document.createElement("div");
			div.setAttribute("id", eventIndex + 100);
			div.style.backgroundColor = color;
			div.style.width = "95%";
			div.style.height = "20px";
			div.style.margin = "1% 2.5%";
			div.style.overflow = "hidden";
			div.addEventListener("click", (event) => this.appointmentClicked(div));
			let divText = document.createTextNode(this.appointments[eventIndex].title);
			div.appendChild(divText);
			//append div for appointment to cell of the day
			let cell = document.getElementById(dayId.toString());
			cell.appendChild(div);
		}
	}

	//open information dialog of appointment after clicking on it
	appointmentClicked(ele) {
		this.appClicked = true;
		let id = ele.getAttribute("id");
		id -= 100;

		this.dialog.open(DisplayAppointmentComponent, {
			data: {
				event: this.appointments[id],
			}
		});
	}

	//Open daily view component after clicking on a calendar cell
	cellClicked(ele) {
		if (!this.appClicked) {
			let id = ele.getAttribute("id");
			let selectedDate = new Date(this.currentYear, this.currentMonth, id);
			this.appointmentService.setSelectedDate(selectedDate);
			this.router.navigate(['/day'])
		} else {
			this.appClicked = false;
		}
	}

	//load new calendar and appointments for the selected month and year
	selectionChanged() {
		this.currentMonth = this.selectForm.get("month").value;
		this.currentYear = this.selectForm.get("year").value;
		this.initCalendar(this.currentMonth, this.currentYear);
		this.getAppointments();
	}
}
