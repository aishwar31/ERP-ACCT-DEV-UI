import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';


@Injectable({
  providedIn: 'root'
})
export class DeviationService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async updateSORItem(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/dev/updatedev' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async completion(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/dev/completion', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async Approvedev(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/dev/Approvedev', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getgendev(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/dev/getgendev' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updatedeviationnew(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/dev/updatedeviation', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getdev(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/dev/getdev' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async createdeviation(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/deviation/createdeviation', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async addDev(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/dev/createdev', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async createMultipledev(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/dev/createMultipledev', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  
  async createSOR(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/dev/createSOR' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getdeviation(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/deviation/getdeviation' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getLastdeviation(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/deviation/getLastdeviation' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async deletedeviation(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/dev/deletedeviation' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updatedeviation(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/deviation/updatedeviation', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
}
