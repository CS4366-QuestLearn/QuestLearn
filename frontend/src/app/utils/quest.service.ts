import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    ) { }

  
  addQuest(data) {
    return this.http.post(`${this.localUrl}api/classroom/quest`, data)
  }
  importGoogleAssignments(user, id){
    console.log(id)
    return this.http.get(`${this.localUrl}api/quests/import?access_token=${user.getAuthResponse().access_token}&class_id=${id}`)
  }
  getAllAssignments(user, id, save) {
    return this.http.get(`${this.localUrl}api/classroom/quests?class_id=${id}&save=${save}`)
  }
  updateStudentQuests(user: gapi.auth2.GoogleUser, id) {
    return this.http.get(`${this.localUrl}api/user/update-assignments?google_id=${user.getBasicProfile().getId()}&classroom_id=${id}`)
  }
  turnInQuest(user: gapi.auth2.GoogleUser, id, value, classroom_id) {
    return this.http.get(`${this.localUrl}api/user/complete-quest?google_id=${user.getBasicProfile().getId()}&_id=${id}&value=${value}&classroom_id=${classroom_id}`)
  }
}
