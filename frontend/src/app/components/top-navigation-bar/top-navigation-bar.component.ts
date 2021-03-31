import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoute } from 'src/app/shared/models/user-type.enum';
import { AuthService } from 'src/app/utils/auth.service';

@Component({
  selector: 'app-top-navigation-bar',
  templateUrl: './top-navigation-bar.component.html',
  styleUrls: ['./top-navigation-bar.component.scss']
})
export class TopNavigationBarComponent implements OnInit {
  public user: gapi.auth2.GoogleUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  async logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  async home() {this.authService.userMongoRead(this.user).subscribe((x: any) => {
    const response = JSON.parse(x);
    this.router.navigate([`/${Object.values(UserRoute)[response.user_type - 1]}`]);
  })
  }

}
