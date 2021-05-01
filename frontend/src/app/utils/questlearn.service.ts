import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestlearnService {
  public serverUrl = "https://questlearn-server.herokuapp.com/"
  public localUrl = "http://localhost:3000/"
  
  public questlearnUserSubject: BehaviorSubject<any>;
  private user: gapi.auth2.GoogleUser;

  public get questlearnUserValue() {
    return this.questlearnUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) {
    try {
      this.questlearnUserSubject = new BehaviorSubject<any>(
        JSON.parse(localStorage.getItem("questlearnUser"))
      );
    }
    catch (e) {
      console.log(e);
      console.log("Unexpected token - Resetting questlearnUser...");
      localStorage.removeItem("questlearnUser");
      this.questlearnUserSubject = new BehaviorSubject<any>(null);
    }
  }

  async init(user: gapi.auth2.GoogleUser) {
    this.user = user;
    const response = await this.http.get(`${this.localUrl}api/questlearn/user?google_id=${user.getBasicProfile().getId()}`).toPromise()
      .catch(error => {
        this.authService.logout();
        this.router.navigate(['login']);
      }
    );
    this.questlearnUserSubject.next(response);
  }

  async reload() {
    this.init(this.user);
  }

  async getClassroom(user: gapi.auth2.GoogleUser, id) {
    return await this.http.get(`${this.localUrl}api/google/classroom?access_token=${user.getAuthResponse().access_token}&class_id=${id}`).toPromise();
  }
}
