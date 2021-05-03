import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassShopService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"

  constructor(
    private http: HttpClient,
    public auth: AuthService,
  ) { }

  buyShopItem(formData: any) {
    return this.http.post(`${this.localUrl}api/shop/buy-item`, formData);
  }

  buyShopreward(formData: any) {
    return this.http.post(`${this.localUrl}api/shop/buy-reward`, formData);
  }

  async getShopItems() {
    return await this.http.get(`${this.localUrl}api/shop/get-items`).toPromise() as Array<any>;
  }
}
