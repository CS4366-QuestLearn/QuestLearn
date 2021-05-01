import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopNavigationBarService {
  public avatarUrlSubject: BehaviorSubject<string>;
  public avatarUrl: Observable<any>;
  
  constructor() {
    this.avatarUrlSubject = new BehaviorSubject<string>(null);
    this.avatarUrl = this.avatarUrlSubject.asObservable();
  }

  updateAvatarUrl(newUrl) {
    this.avatarUrlSubject.next(newUrl);
  }
}
