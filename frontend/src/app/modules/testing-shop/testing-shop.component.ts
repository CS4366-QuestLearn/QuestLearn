import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TestingShopService } from './testing-shop.service';

@Component({
  selector: 'app-testing-shop',
  templateUrl: './testing-shop.component.html',
  styleUrls: ['./testing-shop.component.scss']
})
export class TestingShopComponent implements OnInit {
  itemFormGroup: FormGroup;
  purchaseFormGroup: FormGroup;
  editItemFormGroup: FormGroup;
  
  items: any;

  constructor(
    private formBuilder: FormBuilder,
    private testingShopService: TestingShopService,
  ) { }

  async ngOnInit() {
    this.items = await this.testingShopService.getShopItems();
    console.log(this.items);

    this.itemFormGroup = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'cost': [null, [Validators.required]],
      'thumbnail_url': [null, [Validators.required]],
      'full_url': [null, [Validators.required]],
      'type': [null, [Validators.required]],
    });

    this.purchaseFormGroup = this.formBuilder.group({
      'google_id': ['105368490813779071144', [Validators.required]],
      'item_id': [null, [Validators.required]],
      'item_type': [null, []],
    });

    this.editItemFormGroup = this.formBuilder.group({
      '_id': [null, [Validators.required]],
      'name': [null, [Validators.required]],
      'cost': [null, [Validators.required]],
      'thumbnail_url': [null, [Validators.required]],
      'full_url': [null, [Validators.required]],
      'type': [null, [Validators.required]],
      'times_purchased': [null, [Validators.required]],
    });
  }

  onItemCreate(formData) {
    console.log(formData);
    this.testingShopService.createShopItem(formData).subscribe(x => {
      console.log(x);
    });
  }

  onItemBuy(formData) {
    formData.item_type = (this.items as Array<any>).find(x => x._id == formData.item_id).type;
    console.log(formData);
    this.testingShopService.buyShopItem(formData).subscribe(x => {
      console.log(x);
    });
  }

  onEditChange(value) {
    this.editItemFormGroup.reset();
    if (value) {
      const item = this.items.find(x => x._id == value);
      this.editItemFormGroup.patchValue(item);
    }
  }

  async onItemEdit(formData) {
    const res = await this.testingShopService.editShopItem(formData);
    this.items = await this.testingShopService.getShopItems();
  }

}
