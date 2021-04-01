import { trigger, state, style, transition, animate, group, query } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserRoute } from 'src/app/shared/models/user-type.enum';
import { AuthService } from 'src/app/utils/auth.service';
import { QuestlearnService } from 'src/app/utils/questlearn.service';

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
  public _classroom: string;

  set classroom(classroom: any) {
    this.dataState = 'entering';
    console.log(classroom, this.dataState)
    this._classroom = classroom;
  }

  get classroom() { return this._classroom };

  constructor(
    private authService: AuthService,
    private questlearnService: QuestlearnService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.questlearnUser = this.questlearnService.questlearnUserValue;

    this.subscribeRouterEvents();
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
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

}
