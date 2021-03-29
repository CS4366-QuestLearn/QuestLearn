import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/auth.service';
import { TestingService } from './testing.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  public user: gapi.auth2.GoogleUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private testingService: TestingService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  async logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  request() {
    this.testingService.fooHttp()
      .subscribe(response => {
        console.log(response);
      });
  }

  sub() {
    this.testingService.subToTopic()
      .subscribe(response => {
        console.log(response);
      });
  }

  pull() {
    this.testingService.pullTopic()
      .subscribe(response => {
        console.log(response);
      });
  }

  getClassrooms() {
    this.testingService.getClassrooms(this.user)
      .subscribe(response => {
        console.log(response)
      })
  }

  getCoursework() {
    this.testingService.importClassroomCoursework(this.user)
      .subscribe(response => {
        console.log(response)
      })
  }

}
