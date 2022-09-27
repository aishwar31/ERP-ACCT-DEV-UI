import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class UndertakingService {

  constructor(private http: HttpClient, private main: MainService) { }
  async getUndertakings(obj){
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/metadata/undertakings/getundertakings'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createUndertakings(obj){
    const resp = await this.http.post<any>(this.main.httpUrl2 + '/metadata/undertakings/addUndertaking',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateUndertakings(obj){
    const resp = await this.http.put<any>(this.main.httpUrl2 + '/metadata/undertakings/UpdateUndertaking',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
