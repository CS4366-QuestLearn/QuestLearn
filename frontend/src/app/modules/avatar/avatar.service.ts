import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"

  constructor(
    private http: HttpClient,
    public auth: AuthService,
  ) { }

  async getShopItems(): Promise<Array<any>> {
    return await this.http.get(`${this.localUrl}api/shop/get-items`).toPromise() as Array<any>;
  }

  
  async updateEquippedItems(saveData: any, user: gapi.auth2.GoogleUser) {
    return await this.http.post(`${this.localUrl}api/user/update-equipped-items?google_id=${user.getBasicProfile().getId()}`, saveData).toPromise()
  }

}
