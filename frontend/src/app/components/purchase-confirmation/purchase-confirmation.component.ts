import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassShopService } from 'src/app/modules/class-shop/class-shop.service';

@Component({
  selector: 'app-purchase-confirmation',
  templateUrl: './purchase-confirmation.component.html',
  styleUrls: ['./purchase-confirmation.component.scss']
})
export class PurchaseConfirmationComponent implements OnInit {

  remaining: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PurchaseConfirmationComponent>,
    private classShopService: ClassShopService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.remaining = this.data.balance - this.data.item.price;
  
    if(this.remaining < 0){
      document.getElementById("purchasable1").style.display = "none";
      document.getElementById("purchasable2").style.display = "none";
    }
    else{
      document.getElementById("not_purchasable").style.display = "none";
    }
  }

  onAccept() {
    const user = this.data.user as gapi.auth2.GoogleUser;

    this.classShopService.buyShopItem({
      google_id: user.getBasicProfile().getId(),
      item_type: this.data.item.type,
      item_id: this.data.item._id,
      classroom_id: this.data.classroom_id,
    }).subscribe(res => {
      this.data.item.purchased = true;
      this.dialogRef.close({
        purchased: true,
        price: this.data.item.price
      });
    }, error => {
      if (error) {
        this.dialogRef.close();    
      }
    })
  }

  onDecline() {
    this.dialogRef.close();
  }

}
