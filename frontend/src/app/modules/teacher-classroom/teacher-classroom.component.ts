import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ColumnDefinition } from 'src/app/shared/models/column-definition';
import { AuthService } from 'src/app/utils/auth.service';
import { GoogleService } from 'src/app/utils/google.service';
import { QuestService } from 'src/app/utils/quest.service';

@Component({
  selector: 'app-teacher-classroom',
  templateUrl: './teacher-classroom.component.html',
  styleUrls: ['./teacher-classroom.component.scss']
})
export class TeacherClassroomComponent implements OnInit {

  // This is how you would pull from Google Classroom API only
  // public displayedColumns: ColumnDefinition[] = [
  //   { header: 'Quest Name', propName: 'title', type: 'text' },
  //   { header: 'Students Completed', propName: 'students_completed', type: 'text' },
  //   { header: 'Due Date', propName: 'dueDate', type: 'date' },
  //   { header: 'Reward', propName: 'reward', type: 'text' }
  // ];

  public displayedColumns: ColumnDefinition[] = [
    { header: 'Quest Name', propName: 'name', type: 'text' },
    { header: 'Students Completed', propName: 'students_completed', type: 'text' },
    { header: 'Due Date', propName: 'due_date', type: 'date' },
    { header: 'Reward', propName: 'reward_amount', type: 'text' }
  ];

  public dataSource
  public id
  
  public user: gapi.auth2.GoogleUser;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private googleService: GoogleService,
    private questService: QuestService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.user = this.authService.currentUserValue;
    this.googleService.authorizeClient(this.user)
    .subscribe(response => {
      console.log(response)
    })

    this.questService.importGoogleAssignments(this.user, this.id)
    .subscribe(response => {
      console.log(response)
    })
    // This is how you would pull from Google Classroom API only
    // this.googleService.getGoogleAssignments(this.user, id)
    //   .subscribe((response: Array<any>) => {
    //     this.dataSource = response
    //     console.log(response)
    //   })

    this.reloadTable(null)
  }

  reloadTable(event) {
    this.googleService.getAllAssignments(this.user, this.id)
    .subscribe((response: Array<any>) => {
      this.dataSource = response
      console.log(response)
    })
  }


}
