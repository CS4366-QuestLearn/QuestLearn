import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-donate-bank-dialog',
  templateUrl: './donate-bank-dialog.component.html',
  styleUrls: ['./donate-bank-dialog.component.scss']
})


export class DonateBankDialogComponent implements OnInit {
  
  donation_max: number;
  donation: number;
  formGroup: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.donation_max = Math.min(this.data.balance, (this.data.max - this.data.bank)); 
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'donation_amount': [null, [Validators.required, Validators.min(0), Validators.max(this.donation_max)]]
    });
  }

  setDonation(amount: number)
  {
    this.donation=amount;
  }
}
