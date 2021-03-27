import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/utils/auth.service';
import { mergeMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss']
})
export class AuthButtonComponent implements OnInit, OnDestroy {
  @Output() toSignUp = new EventEmitter<boolean>();

  returnUrl: string;
  isClicking = false;
  user: gapi.auth2.GoogleUser;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
  ) {

  }

  async ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async authenticate() {
    this.subscription = this.authService.currentUserSubject.pipe(
      mergeMap(user => {
        if (user) {
          this.user = user;
          return this.authService.userMongoRead(this.user);
        }
        return of(0);
      }),
    ).subscribe((res:any) => {
      let response = JSON.parse(res);
      if (response) {
        if (response.exists) {
          this.zone.run(() => { this.router.navigate([this.returnUrl]); });
        } else {
          this.toSignUp.emit(true);
        }
      }
    })

    this.authService.authenticate();
  }

  setClickingOn() {
    this.isClicking = true;
  }

  setClickingOff() {
    this.isClicking = false;
  }

}



