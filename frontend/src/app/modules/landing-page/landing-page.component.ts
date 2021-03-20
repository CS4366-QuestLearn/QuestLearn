import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/utils/auth.service';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styles: []
})
export class LandingPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private landingPageService: LandingPageService
  ) { }

  ngOnInit(): void {
  }

  async logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  request() {
    this.landingPageService.fooHttp()
      .subscribe(response => {
        console.log(response);
      });
  }

  sub() {
    this.landingPageService.subToTopic()
      .subscribe(response => {
        console.log(response);
      });
  }

  pull() {
    this.landingPageService.pullTopic()
      .subscribe(response => {
        console.log(response);
      });
  }

}
