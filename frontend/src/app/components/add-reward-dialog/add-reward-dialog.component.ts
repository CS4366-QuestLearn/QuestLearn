import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { ClassShopComponent } from 'src/app/modules/class-shop/class-shop.component';

@Component({
  selector: 'app-add-reward-dialog',
  templateUrl: './add-reward-dialog.component.html',
  styleUrls: ['./add-reward-dialog.component.scss']
})
export class AddRewardDialogComponent implements OnInit {
  reward_name: string;
  reward_price: number;
  price_set: boolean;

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  
  numberFormControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
  ]);
  constructor(public dialogRef: MatDialogRef<ClassShopComponent>) { }

  ngOnInit(): void {
    this.price_set = false;
  }

  setName()
  {
    this.reward_name=this.nameFormControl.value;
  }
  setPrice()
  {
    if(this.numberFormControl.value != '')
    {
      this.price_set = true;
    }
    this.reward_price=this.numberFormControl.value;
  }

  closeDialog() {
    if(this.reward_name != null && this.price_set)
      this.dialogRef.close({name: this.reward_name, price: this.reward_price});
  }

}
