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


    getClassrooms(user) {
      return this.http.get(`${this.localUrl}api/google/classrooms?access_token=${user.getAuthResponse().access_token}`)
    }
  }
