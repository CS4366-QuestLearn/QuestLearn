import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestlearnService {
  public serverUrl = "https://questlearn-server.herokuapp.com/"
  public localUrl = "http://localhost:3000/"
  
  public questlearnUserSubject: BehaviorSubject<any>;

  public get questlearnUserValue() {
    return this.questlearnUserSubject.value;
  }

  constructor(
    private http: HttpClient,
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
    const response = await this.http.get(`${this.localUrl}api/questlearn/user?google_id=${user.getBasicProfile().getId()}`).toPromise();
    this.questlearnUserSubject.next(response);
  }

  async getClassroom(user: gapi.auth2.GoogleUser, id) {
    return await this.http.get(`${this.localUrl}api/google/classroom?access_token=${user.getAuthResponse().access_token}&class_id=${id}`).toPromise();
  }
}
