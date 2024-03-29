import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoute } from 'src/app/shared/models/user-type.enum';
import { AuthService } from 'src/app/utils/auth.service';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
  // providers: [AuthService]
})
export class LandingPageComponent implements OnInit {
  public user: gapi.auth2.GoogleUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private landingPageService: LandingPageService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    // TODO: re-integrate pub sub for push notifs
    // this.landingPageService.subToPush()
    //   .subscribe(() => {
    //     console.log('Subscribed to push endpoint.');
    //   });

    if (this.router.url === '/' || this.router.url === '') {
      // Navigate user if trying to access home
      this.authService.userMongoRead(this.user).subscribe((x: any) => {
        const response = JSON.parse(x);
        this.router.navigate([`/${Object.values(UserRoute)[response.user_type - 1]}`]);
      })
    }
  }
}
