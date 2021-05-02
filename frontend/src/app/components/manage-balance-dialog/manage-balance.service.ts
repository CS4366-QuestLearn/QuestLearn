import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManageBalanceService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    ) { }

  
  updateBalance(data) {
    return this.http.post(`${this.localUrl}api/user/update-balance`, data)
  }
}
