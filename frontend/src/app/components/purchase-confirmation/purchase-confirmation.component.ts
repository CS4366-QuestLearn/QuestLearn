import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-confirmation',
  templateUrl: './purchase-confirmation.component.html',
  styleUrls: ['./purchase-confirmation.component.scss']
})
export class PurchaseConfirmationComponent implements OnInit {

  remaining: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.remaining = data.balance-data.price;
  }

  ngOnInit(): void {
    if(this.remaining < 0){
      document.getElementById("purchasable1").style.display = "none";
      document.getElementById("purchasable2").style.display = "none";
    }
    else{
      document.getElementById("not_purchasable").style.display = "none";
    }
  }
}
