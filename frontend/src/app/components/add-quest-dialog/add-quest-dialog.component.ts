import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestService } from 'src/app/utils/quest.service';

@Component({
  selector: 'app-add-quest-dialog',
  templateUrl: './add-quest-dialog.component.html',
  styleUrls: ['./add-quest-dialog.component.scss']
})
export class AddQuestDialogComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private questService: QuestService,
  ) { }

  ngOnInit(): void {
    // TODO: get classroom ID from route

    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'classroom_id': [0, [Validators.required]], // TODO: insert classroom ID
      'name': [null, [Validators.required]],
      'due_date': [null, [Validators.required]],
      'reward_amount': [null, [Validators.required]],
      'type': [null, [Validators.required]],
    });
  }

  onSubmit(formData) {
    console.log(formData);
    this.questService.addQuest(formData).subscribe(x => {
      console.log(x);
    });
  }

}
