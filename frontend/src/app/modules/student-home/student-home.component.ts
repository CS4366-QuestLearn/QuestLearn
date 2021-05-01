import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnDefinition } from 'src/app/shared/models/column-definition';
import { AuthService } from 'src/app/utils/auth.service';
import { GoogleService } from 'src/app/utils/google.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {
  public displayedColumns: ColumnDefinition[] = [
    { header: 'Class', propName: 'name', type: 'text' },
    { header: 'Teacher', propName: 'teacher', type: 'text' },
  ];

  public dataSource;
  public user: gapi.auth2.GoogleUser;
  public userType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private googleService: GoogleService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    // this.googleService.authorizeClient(this.user)
    // .subscribe(response => {
    //   console.log(response)
    // })
    this.authService.userMongoRead(this.user)
    .subscribe(response => {
      console.log(typeof response)
      this.userType = JSON.parse(response.toString()).user_type
      console.log(this.userType)
    })
    this.googleService.getClassrooms(this.user, this.userType)
      .subscribe((response: Array<any>) => {
        this.dataSource = response
        this.dataSource.forEach(element => {
          // placeholder because all we get is the teacher's ID...
          element.teacher = "QuestLearn Teacher"
        });
        
        console.log(this.dataSource.reverse())
      })
      

  }

  getRecord(record){
    this.router.navigate([`../class/${record.id}`], {relativeTo: this.route});
  }

}
