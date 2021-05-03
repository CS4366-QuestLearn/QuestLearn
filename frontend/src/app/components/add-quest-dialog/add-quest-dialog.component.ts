import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestService } from 'src/app/utils/quest.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-quest-dialog',
  templateUrl: './add-quest-dialog.component.html',
  styleUrls: ['./add-quest-dialog.component.scss']
})
export class AddQuestDialogComponent implements OnInit {
  @Input() id;
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private questService: QuestService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddQuestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // TODO: get classroom ID from route

    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'classroom_id': [this.data.id, [Validators.required]], // TODO: insert classroom ID
      'name': [null, [Validators.required]],
      'due_date': [null, [Validators.required]],
      'reward_amount': [null, [Validators.required, Validators.min(0)]],
      'type': [null, [Validators.required]],
    });
  }

  onSubmit(formData) {
    this.questService.addQuest(formData).subscribe(x => {
      console.log(x);
    });
  }

}
