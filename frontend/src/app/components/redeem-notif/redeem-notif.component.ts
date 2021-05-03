import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestService } from 'src/app/utils/quest.service';

@Component({
  selector: 'app-redeem-notif',
  templateUrl: './redeem-notif.component.html',
  styleUrls: ['./redeem-notif.component.scss']
})
export class RedeemNotifComponent implements OnInit {
  @Input() data;
  @Input() classroom_id;
  @Output() submitted = new EventEmitter();
  constructor(
    private questService: QuestService,
  ) { }

  ngOnInit(): void {
  }

  requestStatus(num) {
    this.questService.requestStatus(this.classroom_id, this.data, num).subscribe(x => {
      console.log(x);
      this.submitted.emit()
    });
  }

}
