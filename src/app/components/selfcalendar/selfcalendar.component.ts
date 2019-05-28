import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-selfcalendar',
  templateUrl: './selfcalendar.component.html',
  styleUrls: ['./selfcalendar.component.css']
})
export class SelfcalendarComponent implements OnInit {
	
	
	months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	today: Date;
	currentMonth;
	currentYear;
	monthAndYear;
	
	constructor(private service: AppointmentService) { }

  ngOnInit() {
			this.today = new Date();
			this.currentMonth = this.today.getMonth();
			this.currentYear = this.today.getFullYear();
			this.monthAndYear = document.getElementById("monthAndYear");
			this.initCalendar(this.currentMonth, this.currentYear);
	}

	//loading the next month
	nextMonth() {
			this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
			this.currentMonth = (this.currentMonth + 1) % 12;
			this.initCalendar(this.currentMonth, this.currentYear);
	}
	
	//loading previous month
	previousMonth() {
			this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
			this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
			this.initCalendar(this.currentMonth, this.currentYear);
	}
	
	//create empty calender for the selected month
	initCalendar(month, year) {
	
			let firstDayOfMonth = (new Date(year, month)).getDay();
			let daysInMonth = 32 - new Date(year, month, 32).getDate();
	
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
							if (i === 0 && j < firstDayOfMonth-1) {
									let cell = document.createElement("td");
									let cellText = document.createTextNode("");
									cell.style.borderStyle = "solid";
									cell.appendChild(cellText);
									row.appendChild(cell);
							}
							else if (date > daysInMonth) {
									break;
							}
							
							//creating cells with data
							else {
									let cell = document.createElement("td");
									let cellText = document.createTextNode(date.toString());
									cell.setAttribute("id",date.toString());
									if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
											cell.classList.add("bg-info");
											cell.style.backgroundColor="lightblue";											
									} 
									cell.style.borderStyle = "solid";
									cell.style.verticalAlign = "top";
									cell.style.height ="15%";
									cell.appendChild(cellText);
									//test div
									let div = document.createElement("div");
									div.style.backgroundColor="red";
									div.style.width="95%";
									div.style.height="30px";
									let divText = document.createTextNode("TestTermin");
									div.appendChild(divText);
									cell.appendChild(div);

									row.appendChild(cell);
									date++;
							}
					}
					tbl.appendChild(row); // appending each row into calendar body.
			}
	}}
