import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseConfirmationComponent } from 'src/app/components/purchase-confirmation/purchase-confirmation.component';
import { AddRewardDialogComponent } from 'src/app/components/add-reward-dialog/add-reward-dialog.component';

export interface Classroom {
  value: number;
  viewValue: string;
}

export interface Class_Item { 
  name: string; 
  price: number;
  image: string;
}

@Component({
  selector: 'app-class-shop',
  templateUrl: './class-shop.component.html',
  styleUrls: ['./class-shop.component.scss']
})


export class ClassShopComponent implements OnInit {

  item_name: string;
  item_price: number;
  balance: number;
  display_top: number;
  window: any;

  classrooms: Classroom[] = [
    {value: 1, viewValue: 'Mrs. Johnson - 1st Period Social Studies'},
    {value: 2, viewValue: 'Random Class 1'},
    {value: 3, viewValue: 'Random Class 2'}
  ];

  class_rewards: Class_Item[] = [
    {name: "Bag of Lays", price: 100, image: ""},
    {name: "Take One from the Grab Bag", price: 200, image: ""},
    {name: "No-Homework Pass", price: 700, image: ""},
    {name: "Fruit Snacks", price: 100, image: ""},
    {name: "5 Homework Points", price: 700, image: ""},
    {name: "Lunch with the Teacher", price: 200, image: ""},
  ];
  
  empty_item = {name: "", price: 0, image: ""};

  displayed_class_items: Class_Item[] = [
    this.empty_item,
    this.empty_item,
    this.empty_item,
    this.empty_item,
    this.empty_item,
    this.empty_item
  ];

  animals: Class_Item[] = [
    {name: "Rabbit", price: 100, image: "../../../assets/img/Rabbit.PNG"},
    {name: "Dog", price: 500, image: "../../../assets/img/Dog.PNG"},
  ];

  hats: Class_Item[] = [
    {name: "Bow", price: 100, image: "../../../assets/img/Bow.PNG"},
  ];

  shirts: Class_Item[] = [];

  legs: Class_Item[] = [];

  accessories_seasonal: Class_Item[] = [
    {name: "Santa", price: 50, image: "../../../assets/img/Santa Hat.PNG"},
  ];
  
  inventory: Class_Item[][] = [
    this.animals,
    this.hats,
    this.shirts,
    this.legs,
    this.accessories_seasonal,
  ];

  image_element: HTMLImageElement;
  
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.balance = 200;
    this.openTab(null, 'Classroom_Rewards');
    for(var i = 0; i < this.inventory.length; i++)
    {
      for(var j = 0; j < this.inventory[i].length; j++)
      {
        this.image_element = <HTMLImageElement> document.getElementById(this.inventory[i][j].name).firstChild.firstChild.lastChild;
        this.image_element.src =  this.inventory[i][j].image;
        console.log(document.getElementById(this.inventory[i][j].name).firstChild.firstChild.lastChild);
        document.getElementById(this.inventory[i][j].name).firstChild.lastChild.textContent= this.inventory[i][j].name + "  " + this.inventory[i][j].price + " QC";
      }
    }
    document.getElementById('First_Button').className += " active";
    this.display_top = 0;
    this.setClassItems(0);
  }

  setClassItems(change: number) {
    this.display_top += change;
    var finish = this.class_rewards.length-this.display_top;
    for(var i = 0; i < 6; i++)
    {
      
      if(this.display_top+i >= this.class_rewards.length)
      {
        this.displayed_class_items[i] = this.empty_item;
      }
      else
      {
        this.displayed_class_items[i] = this.class_rewards[this.display_top+i];
      }
    }
    document.getElementById("up").style.display = (this.display_top == 0) ?  "none" :"flex";
    document.getElementById("down").style.display = (this.display_top+6 >= this.class_rewards.length) ?  "none" :"flex";
    document.getElementById("display_six").style.display = (finish <= 5) ?  "none" : "flex";
    document.getElementById("display_five").style.display = (finish <= 4) ?  "none" : "flex";
    document.getElementById("display_four").style.display = (finish <= 3) ?  "none" : "flex";
    document.getElementById("display_three").style.display = (finish <= 2) ?  "none" : "flex";
    document.getElementById("display_two").style.display = (finish <= 1) ?  "none" : "flex";
  }

  openTab(evt, tabName: string) {
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
    document.getElementById(tabName).style.display = "flex";
    if(evt != null)
      evt.currentTarget.className += " active";
  }

  openWindow(selected_item:Class_Item, evt: any)
  {
    console.log(evt.currentTarget.id);
    if(evt.currentTarget.className == "add-button")
    {
      this.window = AddRewardDialogComponent;
    }
    else
    {
      this.item_name=selected_item.name;
      this.item_price=selected_item.price;
      this.window = PurchaseConfirmationComponent;
    }
    if(this.window != null)
      this.openDialog();
  }

  openDialog()
  {
    let dialogRef = this.dialog.open(this.window, 
      {
        height: '40%',
        minWidth: '30%',

        data: {name: this.item_name, price: this.item_price, balance: this.balance}
      });
      dialogRef.afterClosed().subscribe(result => {
        switch(this.window)
        {
          case PurchaseConfirmationComponent: this.balance -= result;
            break;
          case AddRewardDialogComponent:
            console.log(result);
            if(result != '')
              this.class_rewards.push({name:result.name, price: result.price, image: ""});
            this.setClassItems(0);
            break;
        }
      })
  }
}

