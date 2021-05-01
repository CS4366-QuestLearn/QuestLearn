import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnDefinition } from 'src/app/shared/models/column-definition';
import { AuthService } from 'src/app/utils/auth.service';
import { GoogleService } from 'src/app/utils/google.service';

@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrls: ['./teacher-home.component.scss']
})
export class TeacherHomeComponent implements OnInit {
  public displayedColumns: ColumnDefinition[] = [
    { header: 'Name', propName: 'name', type: 'text' },
    { header: 'Last Updated', propName: 'updateTime', type: 'date' },
    { header: 'Class Status', propName: 'courseState', type: 'text' }
  ];

  public dataSource: any[];
  public user: gapi.auth2.GoogleUser;
  public userType

  constructor(
    private authService: AuthService,
    private googleService: GoogleService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    
    this.user = this.authService.currentUserValue;
    // this.googleService.authorizeClient(this.user)
    // .subscribe(response => {
    //   console.log(response)
    // })
    this.authService.userMongoRead(this.user)
    .subscribe(response => {
      // console.log(typeof response)
      this.userType = JSON.parse(response.toString()).user_type
      console.log(this.user)
      this.googleService.getClassrooms(this.user, this.userType)
      .subscribe((response: Array<any>) => {
        this.dataSource = response
      })
    })
  }

  getRecord(record){
    this.router.navigate([`../class/${record.id}`], {relativeTo: this.route});
  }

}
