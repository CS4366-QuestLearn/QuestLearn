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
  getClassroom(user: gapi.auth2.GoogleUser) {
    return this.http.get(`${this.localUrl}api/google/classroom?access_token=${user.getAuthResponse().access_token}`)
  }
  subToPush() {
    return this.http.get(`${this.serverUrl}api/google/createpush`)
  }
  importClassroomCoursework(user: gapi.auth2.GoogleUser) {
    return this.http.get(`${this.localUrl}api/quests/import?access_token=${user.getAuthResponse().access_token}`)
  }

  // Teacher testing functions:
  // get the list of classrooms that the teacher has
  getClassrooms(user) {
    return this.http.get(`${this.localUrl}api/test/create?access_token=${user.getAuthResponse().access_token}`)
  }
  importQuestsToUser(user: gapi.auth2.GoogleUser) {
    return this.http.get(`${this.localUrl}api/user/test/importquests?access_token=${user.getAuthResponse().access_token}&google_id=${user.getBasicProfile().getId()}`)
  }

  getTestClassroom(user: gapi.auth2.GoogleUser) {
    return this.http.get(`${this.localUrl}api/classroom/test/classroom?access_token=${user.getAuthResponse().access_token}&google_id=${user.getBasicProfile().getId()}`)
  }
}
