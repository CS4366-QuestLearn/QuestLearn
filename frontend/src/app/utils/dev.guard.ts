import { Injectable, isDevMode } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DevGuard implements CanActivateChild {
  constructor(
    private authService: AuthService
  ) {}
  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.authService.checkUser(); 
    return isDevMode();
  }
  
}
