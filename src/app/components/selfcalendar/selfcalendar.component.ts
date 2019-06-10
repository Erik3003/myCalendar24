import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MatDialog } from '@angular/material';
import { DisplayAppointmentComponent } from '../display-appointment-dialog/display-appointment.component';
import { CategoryService } from 'src/app/services/category.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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
	years:number[];

	selectForm: FormGroup;

	//variables for selected date
	today: Date;
	currentMonth: number;
	currentYear: number;
	daysInMonth;

	//array of appointments
	events = [];
	categories = [];
	appClicked: boolean;
	checkedCategories: boolean[] = [];
	categorySub: Subscription;
	appointmentSub: Subscription;


	constructor(
		private appointmentService: AppointmentService,
		private catService: CategoryService,
		private dialog: MatDialog,
		private router: Router,
		private formBuilder: FormBuilder
	) {

	}

	ngOnInit() {
		this.today = new Date();
		this.currentMonth = this.today.getMonth();
		this.currentYear = this.today.getFullYear();

		//filling array with values for selectable years
		this.years = [];
		for (let i = 2000; i<= 2050; i++){
			this.years[i-2000] = i;
		}

		this.selectForm  = this.formBuilder.group({
			year: [this.currentYear],
			month: [this.currentMonth]
		  });

		//fetching categories if a choosen category changed
		let counter = 0;
		this.categorySub = this.catService.currentMessage.subscribe(message => {
			if (message == "choosen changed") {
				//disabling first fetch
				if (counter == 1) {
					counter++;
				} else {
					counter++;

					this.checkedCategories = this.catService.getChoosen();
					this.categories = this.catService.getCategories();
					this.getAppointments();
				}
			}
		});

		//fetching appointments if a appointment changed
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
	updateMonthAndYear(){
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

	//requesting service for events 
	async getAppointments() {
		this.initCalendar(this.currentMonth, this.currentYear);
		this.events = [];
		const data = await this.appointmentService.fetchAppointments(this.currentMonth, this.currentYear).toPromise();
		this.events = data;

		const catData = await this.catService.fetchCategories().toPromise();
		this.categories = catData;

		this.appendAppointmentsToCell();
	}

	//calculating which events belong to which cell
	appendAppointmentsToCell() {
		//iterating through all appointments
		for (let i = 0; i < this.events.length; i++) {
			//integer number of date components
			let dayStart = parseInt(this.events[i].date.substr(8, 2));
			let monthStart = parseInt(this.events[i].date.substr(5, 2));
			let yaerStart = parseInt(this.events[i].date.substr(0, 4));
			let dayEnd = parseInt(this.events[i].enddate.substr(8, 2));
			let monthEnd = parseInt(this.events[i].enddate.substr(5, 2));
			let yearEnd = parseInt(this.events[i].enddate.substr(0, 4));

			//start and end date
			let startDate = new Date(this.events[i].date);
			let endDate = new Date(this.events[i].enddate);

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

		//check for category and if it is selected
		for (let i = 0; i < this.categories.length; i++) {
			//for users own appointments
			if (!found) {
				if (this.categories[i]._id === this.events[eventIndex].category) {
					if (this.checkedCategories[i]) {
						color = this.categories[i].color;
						found = true;
					} else {
						return;
					}
				}
			}
		}

		if (!found && this.checkedCategories[0]) {
			color = this.categories[0].color;
			found = true;
		}

		if (found) {
			//creating div for the appointment
			let div = document.createElement("div");
			div.setAttribute("id", eventIndex + 100);
			div.style.backgroundColor = color;
			div.style.width = "95%";
			div.style.height = "20px";
			div.style.margin = "1% 2.5%";
			div.style.overflow = "hidden";
			div.addEventListener("click", (event) => this.appointmentClicked(div));
			let divText = document.createTextNode(this.events[eventIndex].title);
			div.appendChild(divText);
			//append div for appointment to cell of the day
			let cell = document.getElementById(dayId.toString());
			cell.appendChild(div);
		}
	}

	//open information dialog of appointment
	appointmentClicked(ele) {
		this.appClicked = true;
		let id = ele.getAttribute("id");
		id -= 100;

		this.dialog.open(DisplayAppointmentComponent, {
			data: {
				event: this.events[id],
			}
		});
	}

	//Open daily view
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

	selectionChanged(){
		this.currentMonth=this.selectForm.get("month").value;
		this.currentYear=this.selectForm.get("year").value;
		console.log(this.currentMonth);
		
		this.initCalendar(this.currentMonth, this.currentYear);
		this.getAppointments();
	}
}
