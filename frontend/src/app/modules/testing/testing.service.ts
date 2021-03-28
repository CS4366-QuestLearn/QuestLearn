import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestingService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"
  constructor(
    private http: HttpClient,
    public auth: AuthService,
  ) { }
  fooHttp() {
    return this.http.get(`${this.localUrl}api/foobar`)
  }
  subToTopic() {
    return this.http.get(`${this.localUrl}api/sub`)
  }
  pullTopic() {
    return this.http.get(`${this.localUrl}api/pull`)
  }
  getClassrooms(user: gapi.auth2.GoogleUser) {
    console.log(user.getBasicProfile().getId())
    return this.http.get(`${this.localUrl}api/google/classrooms?access_token=${user.getAuthResponse().access_token}`)
  }
  subToPush() {
    return this.http.get(`${this.serverUrl}api/google/createpush`)
  }
  importClassroomCoursework(user: gapi.auth2.GoogleUser) {
    return this.http.get(`${this.localUrl}api/quests/import?access_token=${user.getAuthResponse().access_token}`)
  }
}
