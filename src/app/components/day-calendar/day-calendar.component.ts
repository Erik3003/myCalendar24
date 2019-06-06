import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-day-calendar',
  templateUrl: './day-calendar.component.html',
  styleUrls: ['./day-calendar.component.css']
})
export class DayCalendarComponent implements OnInit {

  cellHeight = 20;

  constructor() { }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar(){
    let calendarHead = document.getElementById("calendar-head");


    //creating header---------------------------------------------------------------------------
    for(let i = 0; i<24; i++){

      //full hour
      let fullRow = document.createElement("tr");
      let fullHead = document.createElement("th");
      
      //half past full hour
      let halfRow = document.createElement("tr");
      let halfHead = document.createElement("th");

      //setting leading zero
      let leadingZero = '';      
      if(i<10){
        leadingZero = "0";
      }

      //creating text for heading
      let fullHeading = document.createTextNode(leadingZero+i.toString()+":00");  
      let halfHeading = document.createTextNode(leadingZero+i.toString()+":30");

      //style of heading cells
      fullHead.style.height = this.cellHeight.toString()+"px";
      halfHead.style.height = this.cellHeight.toString()+"px";
      fullHead.style.width = "200px";
      halfHead.style.backgroundColor = "red";
      fullHead.style.border = "solid";
      halfHead.style.border = "solid";

      //appending elements to header
      fullHead.appendChild(fullHeading);
      fullRow.appendChild(fullHead);
      calendarHead.appendChild(fullRow);
      halfHead.appendChild(halfHeading);
      halfRow.appendChild(halfHead);
      calendarHead.appendChild(halfRow);
    }

    let calendarBody = document.getElementById("calendar-body");
    for(let i = 0; i <48; i++){
      let row = document.createElement("tr");
      let cell = document.createElement("td");
      let text = document.createTextNode("");
      cell.setAttribute("id",i.toString());
      cell.style.backgroundColor = "lightblue";
      cell.style.border = "solid";
      cell.style.height = this.cellHeight.toString()+"px";
      cell.style.width = "1000px";
      cell.style.borderLeft = "none";
      cell.appendChild(text);
      row.appendChild(cell);
      calendarBody.appendChild(row);
    }
  }

  appendData(){
    let div = document.createElement("div");
    let height = this.cellHeight*3;
    let marginBottom = height - this.cellHeight;
    div.style.height = height.toString()+"px";
    div.style.backgroundColor = "yellow";
    div.style.marginBottom = "-"+marginBottom.toString()+"px";
    let cell = document.getElementById("12");
    cell.appendChild(div);
  }
}
