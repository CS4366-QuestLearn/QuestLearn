import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
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
    return this.http.get(`${this.serverUrl}api/sub`)
  }
  pullTopic() {
    return this.http.get(`${this.serverUrl}api/pull`)
  }
  getClassrooms(user: gapi.auth2.GoogleUser) {
    return this.http.get(`${this.localUrl}api/google/classrooms?access_token=${user.getAuthResponse().access_token}`)
  }
  subToPull() {
    return this.http.get(`${this.serverUrl}api/google/createpush`)
  }

}
