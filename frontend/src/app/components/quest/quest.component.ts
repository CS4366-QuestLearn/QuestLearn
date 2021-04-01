import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss']
})
export class QuestComponent implements OnInit {
  @Input() description;
  @Input() due_date;
  @Input() progress;
  @Input() reward;
  constructor() { }

  ngOnInit(): void {
  }

}
