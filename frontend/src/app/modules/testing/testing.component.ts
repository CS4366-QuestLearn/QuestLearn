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
  public user;

  constructor(
    private authService: AuthService,
    private router: Router,
    private testingService: TestingService,
  ) { }

  async ngOnInit() {
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

  getClassroom() {
    console.log(this.user as gapi.auth2.GoogleUser)
    // console.log(typeof(this.user))
    this.testingService.getClassroom(this.user)
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

  getClassrooms() {
    console.log(this.user as gapi.auth2.GoogleUser)
    // console.log(typeof(this.user))
    this.testingService.getClassrooms(this.user)
      .subscribe(response => {
        console.log(response)
      })
  }

  importQuestsToUser() {
    console.log(this.user as gapi.auth2.GoogleUser)
    // console.log(typeof(this.user))
    this.testingService.importQuestsToUser(this.user)
      .subscribe(response => {
        console.log(response)
      })
  }

  getQuestData() {
    console.log(this.user as gapi.auth2.GoogleUser)


      // table data
      this.testingService.getTestClassroom(this.user)
      .subscribe((response: Array<any>) => {
        console.log('classroom data')
        console.log(response)
        this.testingService.importQuestsToUser(this.user)
        .subscribe((status: Array<any>) => {
          console.log('student data')
          console.log(status)
          response.forEach(element => {
            // element.completed = status.find(x => x._id == element._id).completed
            console.log('aaa')
          });
          console.log(response)
        })
      })

      // load class data into table
      // then for each element inthe table
      // check the user object for true false and then change status "Completed", "Incomplete", etc
  }

  addTestRequest() {
        this.testingService.addTestRequest()
      .subscribe(response => {
        console.log(response)
      })
  }

}
