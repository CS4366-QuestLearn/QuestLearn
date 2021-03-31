import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnDefinition } from 'src/app/shared/models/column-definition';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {
  public displayedColumns: ColumnDefinition[] = [
    { header: 'Class', propName: 'class', type: 'text' },
    { header: 'Teacher', propName: 'teacher', type: 'text' },
  ];

  public dataSource: any[] = [
    { class: "1st Period Social Studies", teacher: 'Mrs. Johnson', id: 1},
    { class: "6th Period History", teacher: 'Coach Jeff', id: 2},
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  getRecord(record){
    this.router.navigate([`../class/${record.id}`], {relativeTo: this.route});
  }

}
