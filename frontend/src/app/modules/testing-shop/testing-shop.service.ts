import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestingShopService {
  serverUrl = "https://questlearn-server.herokuapp.com/"
  localUrl = "http://localhost:3000/"

  constructor(
    private http: HttpClient,
    public auth: AuthService,
  ) { }

  createShopItem(formData: any) {
    return this.http.post(`${this.localUrl}api/shop/create-item`, formData);
  }

  buyShopItem(formData: any) {
    return this.http.post(`${this.localUrl}api/shop/buy-item`, formData);
  }

  async getShopItems() {
    return await this.http.get(`${this.localUrl}api/shop/get-items`).toPromise();
  }

  async editShopItem(formData: any) {
    return await this.http.post(`${this.localUrl}api/shop/edit-item`, formData).toPromise();
  }
}
