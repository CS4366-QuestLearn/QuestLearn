import { Injectable } from '@angular/core';
<<<<<<< HEAD
=======
import { HttpClient } from '@angular/common/http'
import { getSyntheticPropertyName } from '@angular/compiler/src/render3/util';
import { AuthService } from 'src/app/utils/auth.service';
>>>>>>> 9d73a728bdf2413806ad2743b4784e8720307ae6

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
<<<<<<< HEAD
  constructor(
  ) { }
=======
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
    console.log(user.getBasicProfile().getId())
    return this.http.get(`${this.localUrl}api/google/classrooms?access_token=${user.getAuthResponse().access_token}`)
  }
  subToPull() {
    return this.http.get(`${this.serverUrl}api/google/createpush`)
  }

>>>>>>> 9d73a728bdf2413806ad2743b4784e8720307ae6
}
