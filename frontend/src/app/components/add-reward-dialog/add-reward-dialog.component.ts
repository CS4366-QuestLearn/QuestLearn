import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassShopComponent } from 'src/app/modules/class-shop/class-shop.component';
import { QuestService } from 'src/app/utils/quest.service';

@Component({
  selector: 'app-add-reward-dialog',
  templateUrl: './add-reward-dialog.component.html',
  styleUrls: ['./add-reward-dialog.component.scss']
})
export class AddRewardDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ClassShopComponent>,
    private formBuilder: FormBuilder,
    private questService: QuestService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

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

  onSubmit(formData) {
    formData.classroom_id = this.data.classroom_id
    this.questService.addReward(formData).subscribe((x: any) => {
      this.dialogRef.close({
        name: this.formGroup.controls['name'].value,
        price: Number(this.formGroup.controls['price'].value),
        _id: x._id
      });
      console.log(x);
    });
  }

}
