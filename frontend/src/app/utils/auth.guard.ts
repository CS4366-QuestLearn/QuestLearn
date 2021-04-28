import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { QuestlearnService } from "./questlearn.service";
import { GoogleService } from './google.service';

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleService,
    private questlearnService: QuestlearnService,
  ) {}

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.authService.checkUser();
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.googleService.authorizeClient(currentUser)
      .subscribe(response => {
        console.log('eyhaahahah')
      })
      // Authorized so return true
      console.log('User is authenticated.');
      
      await this.questlearnService.init(currentUser);
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
