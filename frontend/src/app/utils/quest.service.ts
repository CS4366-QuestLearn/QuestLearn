import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"

  constructor(
    private http: HttpClient,
    ) { }

  
  addQuest(data) {
    return this.http.post(`${this.localUrl}api/quest`, data)
  }
}
