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

  getTestClassroom() {
    return this.http.get(`${this.localUrl}api/classroom/test/classroom`)
  }
  importQuestsToUser(user: gapi.auth2.GoogleUser) {
    return this.http.get(`${this.localUrl}api/login/test/importquests?access_token=${user.getAuthResponse().access_token}&google_id=${user.getBasicProfile().getId()}`)
  }
  turnInQuest(user: gapi.auth2.GoogleUser, id, value, classroom_id) {
    return this.http.get(`${this.localUrl}api/login/complete-quest?google_id=${user.getBasicProfile().getId()}&_id=${id}&value=${value}&classroom_id=${classroom_id}`)
  }
}
