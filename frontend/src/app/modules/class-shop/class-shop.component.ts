import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseConfirmationComponent } from 'src/app/components/purchase-confirmation/purchase-confirmation.component';
import { AddRewardDialogComponent } from 'src/app/components/add-reward-dialog/add-reward-dialog.component';
import { DonateBankDialogComponent } from 'src/app/components/donate-bank-dialog/donate-bank-dialog.component';
import { ClassShopService } from './class-shop.service';
import { QuestlearnService } from 'src/app/utils/questlearn.service';
import { GoogleService } from 'src/app/utils/google.service';
import { AuthService } from 'src/app/utils/auth.service';
import { QuestService } from 'src/app/utils/quest.service';

export interface Classroom {
  value: number;
  viewValue: string;
}

export interface Avatar_Item { 
  name: string; 
  price: number;
  image: string;
  purchased: boolean;
  times_purchased: number;
  type: string;
  _id: string;
}

export interface Class_Reward {
  price: number;
  name: string;
  _id: string;
}

export interface Class_ID_Rewards{
  classroom_id: number;
  rewards: any[];
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
  finish: number;
  purchase_button: any;
  one_time_purchase: boolean;
  current_purchase: Avatar_Item;
  class_rewards: Class_Reward[];
  all_class_rewards: Class_ID_Rewards[];
  window: any;

  classroomsData: any[];
  classrooms: Classroom[] = [];
  selectedClass = 0;

  empty_item: Avatar_Item = {name: "", price: 0, image: "", purchased: false, times_purchased: 0, _id: "", type: ""};

  popular_items: Avatar_Item[] = []

  empty_reward: Class_Reward = {name: '', price: 0, _id: ''};

  displayed_class_items: Class_Reward[] = [];

  animals: Avatar_Item[];
  hats: Avatar_Item[];
  shirts: Avatar_Item[];
  pants: Avatar_Item[];
  accessories: Avatar_Item[];
  
  inventory: Avatar_Item[][];
  shopItems: Avatar_Item[];

  user: gapi.auth2.GoogleUser;
  userType: any;
  questlearnUser: any;
  
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private googleService: GoogleService,
    private questService: QuestService,
    private questlearnService: QuestlearnService,
    private classShopService: ClassShopService,
  ) { }

  async ngOnInit(): Promise<void> {
    // this.balance = 200;
    this.openTab(null, 'Classroom_Rewards');
    this.bank_balance = 400;
    this.bank_max = 500;

    this.user = this.authService.currentUserValue;
    this.questlearnUser = this.questlearnService.questlearnUserValue;

    await this.initShop();

    document.getElementById('First_Button').className += " active";
    this.display_top = 0;
  }

  async initShop() {
    // Init classroom rewards
    this.googleService.getClassrooms(this.user, this.questlearnUser.user_type)
      .subscribe(async (response: Array<any>) => {
        this.classroomsData = response;
        this.classrooms = response
        .sort((a, b) => {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        .map(x => {
          return { value: x.id, viewValue: x.name };
        });
        
        this.all_class_rewards = (await this.questService.getClassroomRewards());
        await this.updateSelectedClass(this.classrooms[0].value);
      })
    
    // Init global items

    // Get list of user's purchased items
    const purchasedList = [
      ...this.questlearnUser.inventory.animal_ids,
      ...this.questlearnUser.inventory.head_ids,
      ...this.questlearnUser.inventory.shirt_ids,
      ...this.questlearnUser.inventory.pant_ids,
      ...this.questlearnUser.inventory.accessory_ids,
    ];

    this.shopItems = (await this.classShopService.getShopItems())
      .filter(x => x.cost !== 0)
      .sort((a, b) => b.times_purchased - a.times_purchased)
      .map(x => {
        return {
          name: x.name,
          price: x.cost,
          image: x.thumbnail_url,
          purchased: purchasedList.includes(x._id),
          times_purchased: x.times_purchased,
          type: x.type,
          _id: x._id
        }
      });
    this.animals = this.shopItems.filter(x => x.type ==='animal');
    this.hats = this.shopItems.filter(x => x.type ==='head');
    this.shirts = this.shopItems.filter(x => x.type ==='shirt');
    this.pants = this.shopItems.filter(x => x.type ==='pant');
    this.accessories = this.shopItems.filter(x => x.type ==='accessory');

    this.inventory = [
      this.animals,
      this.hats,
      this.shirts,
      this.pants,
      this.accessories,
    ];
  }

  async updateSelectedClass(value) {
    const classData = this.questlearnUser.classes.find(x => x.classroom_id == value);
    this.class_rewards = this.all_class_rewards.find(x => x.classroom_id == value).rewards.map(x => {
      return {
        name: x.reward_name,
        price: x.reward_amount,
        _id: x._id,
      }
    });
    this.setClassItems(0);
    
    this.selectedClass = value;
    this.balance = classData.balance;
  }

  setClassItems(change: number) {
    this.display_top += change;
    this.finish = this.class_rewards.length-this.display_top;
    for(var i = 0; i < 6; i++)
    {
      
      if(this.display_top+i >= this.class_rewards.length)
      {
        this.displayed_class_items[i] = this.empty_reward;
      }
      else
      {
        this.displayed_class_items[i] = this.class_rewards[this.display_top+i];
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

  openWindow(selected_item, evt: any, one_purchase: boolean) {
   if (!selected_item.purchased) {
      if (evt.toElement.classList.contains('add-button')) {
        this.window = AddRewardDialogComponent;
        this.openDialog({
          classroom_id: this.selectedClass
        });
      } else if(evt.toElement.classList.contains('donate-button')) {
        this.window = DonateBankDialogComponent;
        this.openDialog({
          bank: this.bank_balance,
          max: this.bank_max,
          balance: this.balance,
        });
      } else {
        this.window = PurchaseConfirmationComponent;
        this.openDialog({
          item: selected_item,
          balance: this.balance,
          user: this.user,
          classroom_id: this.selectedClass,
        });
      }
    }
  }

  openDialog(dialogData)
  {
    let dialogRef = this.dialog.open(this.window, 
      {
        minWidth: '30%',
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(result => {
        if(this.window == PurchaseConfirmationComponent && result?.purchased) {
          if (!Number.isNaN(result.price)) {
            this.balance -= result.price;
          }
        }
        else if(this.window == AddRewardDialogComponent) {
          if(result)
              this.class_rewards.push(result)
              this.setClassItems(0);
        }
        else if(this.window == DonateBankDialogComponent) {
          if (result && !Number.isNaN(result)) {
            this.bank_balance += Number(result);
            this.balance -= Number(result);
          }
        }
      })
  }
}

