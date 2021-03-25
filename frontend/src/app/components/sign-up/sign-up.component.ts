import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoute, UserType } from 'src/app/shared/models/user-type.enum';
import { AuthService } from 'src/app/utils/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  user: gapi.auth2.GoogleUser;

  public get UserType() {
    return UserType;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    console.log(this.user);
  }

  signUp(type) {
    this.authService.userMongoWrite(this.user, type).subscribe(x => {
      console.log('account created', x);
    });

    this.zone.run(() => { 
      this.router.navigate([`/${Object.values(UserRoute)[type - 1]}`]);
     });

  }

}
