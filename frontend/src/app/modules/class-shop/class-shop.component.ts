import { Component, OnInit } from '@angular/core';

export interface Classroom {
  value: number;
  viewValue: string;
}


@Component({
  selector: 'app-class-shop',
  templateUrl: './class-shop.component.html',
  styleUrls: ['./class-shop.component.scss']
})


export class ClassShopComponent implements OnInit {

  
  constructor() { }

  ngOnInit(): void {
    this.openCity(null, 'Classroom_Rewards');
    document.getElementById('First_Button').className += " active";
  }

  classrooms: Classroom[] = [
    {value: 1, viewValue: 'Mrs. Johnson - 1st Period Social Studies'},
    {value: 2, viewValue: 'Random Class 1'},
    {value: 3, viewValue: 'Random Class 2'}
  ];

  openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(cityName).style.display = "flex";
    if(evt != null)
      evt.currentTarget.className += " active";
  } 
}

