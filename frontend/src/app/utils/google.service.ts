import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"
  constructor(
    private http: HttpClient,
    public auth: AuthService,
  ) { }


  getClassrooms(user, type) {
    return this.http.get(`${this.localUrl}api/google/classrooms?access_token=${user.getAuthResponse().access_token}&user_type=${type}`)
  }
  getGoogleAssignments(user, id) {
    return this.http.get(`${this.localUrl}api/google/assignments?access_token=${user.getAuthResponse().access_token}&class_id=${id}`)
  }
  getAllAssignments(user, id) {
    return this.http.get(`${this.localUrl}api/classroom/quests?class_id=${id}`)
  }
  authorizeClient(user) {
    // If you want to use pubsub, you need to use this.serverUrl to do the authorization on the heroku server
    // Otherwise the pubsub on the heroku server won't be able to do anything with Google Classroom.
    return this.http.get(`${this.localUrl}api/google/client?access_token=${user.getAuthResponse().access_token}`)
  }
  getTeachers(user) {
    return this.http.get(`${this.localUrl}api/google/teachers?access_token=${user.getAuthResponse().access_token}`)
  }
}
