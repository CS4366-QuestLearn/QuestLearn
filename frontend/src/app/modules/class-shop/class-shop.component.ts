import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseConfirmationComponent } from 'src/app/components/purchase-confirmation/purchase-confirmation.component';
import { AddRewardDialogComponent } from 'src/app/components/add-reward-dialog/add-reward-dialog.component';
import { DonateBankDialogComponent } from 'src/app/components/donate-bank-dialog/donate-bank-dialog.component';

export interface Classroom {
  value: number;
  viewValue: string;
}

export interface Class_Item { 
  name: string; 
  price: number;
  image: string;
  purchased: boolean;
  sales: number;
}

export interface Class_ID_Rewards{
  id: number;
  name: string;
  rewards: Class_Item[];
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
  bank_balance: number;
  bank_max: number;
  display_top: number;
  purchase_button: any;
  one_time_purchase: boolean;
  current_purchase: Class_Item;
  class_rewards: Class_Item[];
  window: any;

  

  class_rewards_ex_1: Class_Item[] = [
    {name: "Bag of Lays", price: 100, image: "", purchased: false, sales: 0},
    {name: "Take One from the Grab Bag", price: 200, image: "", purchased: false, sales: 0},
    {name: "No-Homework Pass", price: 700, image: "", purchased: false, sales: 0},
    {name: "Fruit Snacks", price: 100, image: "", purchased: false, sales: 0},
    {name: "5 Homework Points", price: 700, image: "", purchased: false, sales: 0},
    {name: "Lunch with the Teacher", price: 200, image: "", purchased: false, sales: 0},
  ];

  class_rewards_ex_2: Class_Item[] = [
    {name: "Amogus", price: 10000, image: "", purchased: false, sales: 0},
  ];

  class_rewards_ex_3: Class_Item[] = [
    {name: "Travis Scott Meal", price: 5.99, image: "", purchased: false, sales: 0},
  ];
  
  all_class_rewards: Class_ID_Rewards[] = [
    {id: 0, name: 'Mrs. Johnson - 1st Period Social Studies', rewards: this.class_rewards_ex_1},
    {id: 1, name: 'Random Class 1', rewards: this.class_rewards_ex_2},
    {id: 2, name: 'Random Class 2', rewards: this.class_rewards_ex_3},
  ];

  classrooms: Classroom[] = [
    {value: 1, viewValue: this.all_class_rewards[0].name},
    {value: 2, viewValue: this.all_class_rewards[1].name},
    {value: 3, viewValue: this.all_class_rewards[2].name}
  ];

  empty_item = {name: "", price: 0, image: "", purchased: false, sales: 0};

  popular_items: Class_Item[] = [
    this.empty_item,
    this.empty_item,
    this.empty_item
  ]

  displayed_class_items: Class_Item[] = [
    this.empty_item,
    this.empty_item,
    this.empty_item,
    this.empty_item,
    this.empty_item,
    this.empty_item
  ];

  animals: Class_Item[] = [
    {name: "Rabbit", price: 100, image: "../../../assets/img/Rabbit.PNG", purchased: false, sales: 0},
    {name: "Dog", price: 500, image: "../../../assets/img/Dog.PNG", purchased: false, sales: 0},
  ];

  hats: Class_Item[] = [
    {name: "Bow", price: 100, image: "../../../assets/img/Bow.PNG", purchased: false, sales: 0},
  ];

  shirts: Class_Item[] = [];

  legs: Class_Item[] = [];

  accessories: Class_Item[] = [
    {name: "Santa", price: 50, image: "../../../assets/img/Santa Hat.PNG", purchased: false, sales: 0},
  ];
  
  inventory: Class_Item[][] = [
    this.animals,
    this.hats,
    this.shirts,
    this.legs,
    this.accessories,
  ];

  image_element: HTMLImageElement;
  
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.balance = 200;
    this.bank_balance = 400;
    this.bank_max = 500;
    this.openTab(null, 'Classroom_Rewards');
    document.getElementById("Classroom_Rewards").style.display = "none";
    document.getElementById("bar").style.width = (this.bank_balance/500 * 100) + '%';
    for(var i = 0; i < this.inventory.length; i++)
    {
      for(var j = 0; j < this.inventory[i].length; j++)
      {
        this.image_element = <HTMLImageElement> document.getElementById(this.inventory[i][j].name).firstChild.firstChild.lastChild;
        this.image_element.src =  this.inventory[i][j].image;
        document.getElementById(this.inventory[i][j].name).firstChild.lastChild.textContent= this.inventory[i][j].name + "  " + this.inventory[i][j].price + " QC";
      }
    }
    document.getElementById('First_Button').className += " active";
    this.display_top = 0;
  }

  setIdItems(evt: any)
  {
    document.getElementById("Classroom_Rewards").style.display = "flex";
    this.class_rewards=this.all_class_rewards[(evt.value)-1].rewards;
    this.display_top = 0;
    this.setPopular();
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
    document.getElementById("display_one").style.display = "flex";
  }

  setPopular()
  {
    var s:string;
    for(var i = 0; i < 3; i++)
    {
      for(var j = 0; j < this.inventory.length; j++)
      {
        for(var k = 0; k < this.inventory[j].length; k++)
        {
          if(this.inventory[j][k].sales >= this.popular_items[0].sales && !this.popular_items.includes(this.inventory[j][k]))
            {
              switch(i)
              {
                case 0: s = "popular_one"; break;
                case 1: s = "popular_two"; break;
                case 2: s = "popular_three"; break;
              }
              this.popular_items[i] = this.inventory[j][k];
              this.image_element = <HTMLImageElement> document.getElementById(s).firstChild.firstChild.lastChild;
              this.image_element.src =  this.inventory[j][k].image;
              document.getElementById(s).firstChild.lastChild.textContent= this.inventory[j][k].name + "  " + this.inventory[j][k].price + " QC";
            }
        }
      }
    }
  }

  openTab(evt, tabName: string) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent"); // Get all elements with class="tabcontent" and hide them
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

  openWindow(selected_item:Class_Item, evt: any, one_purchase: boolean)
  {
    if(evt.currentTarget.className == "add-button")
    {
      this.window = AddRewardDialogComponent;
    }
    else if(evt.currentTarget.className == "donate-button")
    {
      this.window = DonateBankDialogComponent;
    }
    else
    { 
      this.one_time_purchase = one_purchase;
      this.purchase_button = evt.currentTarget;
      this.current_purchase = selected_item;
      this.item_name=selected_item.name;
      this.item_price=selected_item.price;
      this.window = PurchaseConfirmationComponent;
    }
    if(this.window != null && !selected_item.purchased)
      this.openDialog();
  }

  openDialog()
  {
    let dialogRef = this.dialog.open(this.window, 
      {
        minHeight: '40%',
        minWidth: '30%',
        data: {name: this.item_name, price: this.item_price, balance: this.balance, bank: this.bank_balance, max: this.bank_max}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(this.window == PurchaseConfirmationComponent && result == "purchased")
        {
          this.balance -= this.item_price;
          this.current_purchase.sales++;
          if(this.one_time_purchase)
          {
            this.purchase_button.style.opacity = 0.3;
            this.current_purchase.purchased = true;
          }
          this.setPopular();
        }
        else if(this.window == AddRewardDialogComponent)
        {
          if(result != '')
              this.class_rewards.push({name:result.name, price: result.price, image: "", purchased: false, sales: 0});
            this.setClassItems(0);
        }
        else if(this.window == DonateBankDialogComponent)
        {
          this.bank_balance += Number(result);
          this.balance -= Number(result);
          document.getElementById("bar").style.width = (this.bank_balance/500 * 100) + '%';
        }
      })
  }
}

