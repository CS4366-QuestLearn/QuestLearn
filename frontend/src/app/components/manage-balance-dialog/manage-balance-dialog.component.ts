import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject } from '@angular/core';
import { ColumnDefinition } from 'src/app/shared/models/column-definition';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageBalanceService } from './manage-balance.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleService } from 'src/app/utils/google.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
];
@Component({
  selector: 'app-manage-balance-dialog',
  templateUrl: './manage-balance-dialog.component.html',
  styleUrls: ['./manage-balance-dialog.component.scss']
})


export class ManageBalanceDialogComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'balance'];
  public dataSource
  selection = new SelectionModel<any>(true, []);
  formGroup: FormGroup;
  public id;
  
  constructor(
    private formBuilder: FormBuilder,
    private manageBalanceService: ManageBalanceService,
    private route: ActivatedRoute,
    private googleService: GoogleService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.googleService.getStudentsBalance(this.data.id)
    .subscribe(response => {
      this.dataSource = response
      this.dataSource.forEach(element => {
        element.name = element.profile.name.fullName
      });
    })
    
    this.createForm()

  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'number': [null, [Validators.required]],
      'type': [null, [Validators.required]]
    });

    console.log(this.formGroup)
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onSubmit(formData) {
    formData.ids = this.selection.selected.map(x => x.userId)
    formData.class_id = this.data.id
    // console.log(formData)


    this.manageBalanceService.updateBalance(formData).subscribe(x => {
      console.log(x);
    });
  }

}
