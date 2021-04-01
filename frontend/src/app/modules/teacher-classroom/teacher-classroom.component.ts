import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ColumnDefinition } from 'src/app/shared/models/column-definition';

@Component({
  selector: 'app-teacher-classroom',
  templateUrl: './teacher-classroom.component.html',
  styleUrls: ['./teacher-classroom.component.scss']
})
export class TeacherClassroomComponent implements OnInit, OnDestroy {
  public displayedColumns: ColumnDefinition[] = [
    { header: 'Quest Name', propName: 'quest_name', type: 'text' },
    { header: 'Students Completed', propName: 'students_completed', type: 'text' },
    { header: 'Due Date', propName: 'due_date', type: 'date' },
    { header: 'Reward', propName: 'reward', type: 'text' }
  ];

  public dataSource: any[] = [
    {quest_name: "HW 1", students_completed: '25/25', due_date: '2/15/2020', reward: '10 QC'},
    {quest_name: "HW 2", students_completed: '21/25', due_date: '3/5/2020', reward: '5 QC'},
    {quest_name: "Test 1", students_completed: '13/25', due_date: '3/4/2020', reward: '20 QC'},
    {quest_name: "Test 3", students_completed: '0/25', due_date: '3/16/2020', reward: '20 QC'}
  ];
  
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      console.log(params['id']) //log the value of id
    });
  }
  
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
