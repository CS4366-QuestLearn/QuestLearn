import { trigger, state, style, transition, animate, group, query } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserRoute } from 'src/app/shared/models/user-type.enum';
import { AuthService } from 'src/app/utils/auth.service';
import { QuestlearnService } from 'src/app/utils/questlearn.service';
import { TopNavigationBarService } from './top-navigation-bar.service';

@Component({
  selector: 'app-top-navigation-bar',
  templateUrl: './top-navigation-bar.component.html',
  styleUrls: ['./top-navigation-bar.component.scss'],
  animations: [
    trigger('dataChange', [
      transition('done => entering', [
        style({
          opacity: 0
        }),
        animate('200ms ease', style({ opacity: 1 }))
      ]),
    ])
  ]
})
export class TopNavigationBarComponent implements OnInit, OnDestroy {
  dataState: 'entering' | 'done' = 'done';

  public user: gapi.auth2.GoogleUser;
  public questlearnUser: any;
  public class_id: any;
  public routerSub: Subscription;
  public topNavSubscription: Subscription;
  public _classroom: string;
  public avatarUrl: string;

  set classroom(classroom: any) {
    this.dataState = 'entering';
    this._classroom = classroom;
  }

  get classroom() { return this._classroom };

  constructor(
    private authService: AuthService,
    private questlearnService: QuestlearnService,
    private router: Router,
    private route: ActivatedRoute,
    private topNavigationBarService: TopNavigationBarService,
  ) { }

  async ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.questlearnUser = this.questlearnService.questlearnUserValue;

    this.subscribeRouterEvents();
    this.subscribeToAvatarUpdates();
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }

    if (this.topNavSubscription) {
      this.topNavSubscription.unsubscribe();
      this.topNavigationBarService.avatarUrlSubject.next(null);
    }
  }

  async logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  async home() {
    this.authService.userMongoRead(this.user).subscribe((x: any) => {
      const response = JSON.parse(x);
      this.router.navigate([`/${Object.values(UserRoute)[response.user_type - 1]}`]);
    })
  }

  subscribeRouterEvents() {
    this.class_id = this.route.snapshot.firstChild?.firstChild?.params?.id;
    this.updateHeader();

    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      if (this.route.snapshot.firstChild?.firstChild?.params) {
        this.class_id = this.route.snapshot.firstChild?.firstChild?.params?.id;
        this.updateHeader();
      }
    });
  }

  async updateHeader() {
    let response: any = { name: 'Welcome!' };
    if (this.class_id) {
      response = await this.questlearnService.getClassroom(this.user, this.class_id);
    }

    this.classroom = response.name;
  }

  subscribeToAvatarUpdates() {
    this.topNavSubscription = this.topNavigationBarService.avatarUrl.subscribe(x => {
      if (x) {
        this.avatarUrl = x;

        const origMsg = this.classroom;
        this.classroom = 'Saved!'

        setTimeout(() => {
          this.classroom = origMsg;
        }, 4000);
      }
    })
  }

  shop() {
    this.router.navigate(['shop']);
  }

  avatar() {
    this.router.navigate(['avatar']);
  }

}
