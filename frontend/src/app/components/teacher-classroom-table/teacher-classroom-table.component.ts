import { Component, OnInit } from '@angular/core';

export interface QuestElement {
  quest_name: string;
  students_completed: string;
  due_date: string;
  reward: string;
}

const ELEMENT_DATA: QuestElement[] = [
  {quest_name: "HW 1", students_completed: '25/25', due_date: '2/15/2020', reward: '10 QC'},
  {quest_name: "HW 2", students_completed: '21/25', due_date: '3/5/2020', reward: '5 QC'},
  {quest_name: "Test 1", students_completed: '13/25', due_date: '3/4/2020', reward: '20 QC'},
  {quest_name: "Test 3", students_completed: '0/25', due_date: '3/16/2020', reward: '20 QC'}
];

@Component({
  selector: 'app-teacher-classroom-table',
  templateUrl: './teacher-classroom-table.component.html',
  styleUrls: ['./teacher-classroom-table.component.scss']
})
export class TeacherClassroomTableComponent implements OnInit {
  displayedColumns: string[] = ['quest_name', 'students_completed', 'due_date', 'reward'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}


