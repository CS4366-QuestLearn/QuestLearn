import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quest-board',
  templateUrl: './quest-board.component.html',
  styleUrls: ['./quest-board.component.scss']
})
export class QuestBoardComponent implements OnInit {

  public teamQuests = [
    { description: 'Donate to the Class Bank', progress: '300/500', due_date: 'Due March 20th', reward: 'Pizza Party' },
    { description: 'Participate in Lab', progress: 'Entire Class', due_date: 'Due March 15th', reward: '5 QC' },
    { description: 'Participate in Lab', progress: 'Entire Class', due_date: 'Due March 15th', reward: '5 QC' },
    { description: 'Participate in Lab', progress: 'Entire Class', due_date: 'Due March 15th', reward: '5 QC' },
    { description: 'Participate in Lab', progress: 'Entire Class', due_date: 'Due March 15th', reward: '5 QC' },
    { description: 'Participate in Lab', progress: 'Entire Class', due_date: 'Due March 15th', reward: '5 QC' },
    { description: 'Participate in Lab', progress: 'Entire Class', due_date: 'Due March 15th', reward: '5 QC' },
  ];
  
  public yourQuests = [
    { description: 'Homework 1', progress: 'Turn In', due_date: 'Due March 11th', reward: '10 QC' },
    { description: 'Homework 2', progress: 'Turn In', due_date: 'Due March 16th', reward: '5 QC' },
    { description: 'Reading Analysis', progress: 'Turn In', due_date: 'Due March 19th', reward: '8 QC' },
    { description: 'Reading Analysis', progress: 'Turn In', due_date: 'Due March 19th', reward: '8 QC' },
    { description: 'Reading Analysis', progress: 'Turn In', due_date: 'Due March 19th', reward: '8 QC' },
    { description: 'Reading Analysis', progress: 'Turn In', due_date: 'Due March 19th', reward: '8 QC' },
    { description: 'Reading Analysis', progress: 'Turn In', due_date: 'Due March 19th', reward: '8 QC' },
    { description: 'Reading Analysis', progress: 'Turn In', due_date: 'Due March 19th', reward: '8 QC' },
    { description: 'Reading Analysis', progress: 'Turn In', due_date: 'Due March 19th', reward: '8 QC' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
