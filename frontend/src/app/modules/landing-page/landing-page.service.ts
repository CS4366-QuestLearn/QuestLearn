import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { getSyntheticPropertyName } from '@angular/compiler/src/render3/util';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"
  constructor(private http: HttpClient) { }
  fooHttp() {
    return this.http.get(`${this.localUrl}api/foobar`)
  }
  subToTopic() {
    return this.http.get(`${this.serverUrl}api/sub`)
  }
  pullTopic() {
    return this.http.get(`${this.serverUrl}api/pull`)
  }

}
