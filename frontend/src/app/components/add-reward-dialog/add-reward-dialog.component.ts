import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassShopComponent } from 'src/app/modules/class-shop/class-shop.component';

@Component({
  selector: 'app-add-reward-dialog',
  templateUrl: './add-reward-dialog.component.html',
  styleUrls: ['./add-reward-dialog.component.scss']
})
export class AddRewardDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<ClassShopComponent>, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'price': [null, [Validators.required, Validators.min(0)]]
    });
  }


  closeDialog() {
      this.dialogRef.close({name: this.formGroup.controls['name'].value, price: Number(this.formGroup.controls['price'].value)});
  }

}
