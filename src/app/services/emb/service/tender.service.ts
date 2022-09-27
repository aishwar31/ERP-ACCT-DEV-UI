import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class TenderService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }

  //BOQ
  async getGeometry(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/geometry/getgeometry'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async createBoq(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/boq/createTender', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getBoq(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/boq/getTender' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getAllTender(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/boq/getAllTender' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getItem(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/boq/getItem' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getLastEMB(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/emb/getLastEMB' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteBoq(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/boq/deleteTender' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updateUnit(ob) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/boq/updateItem', ob).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getHeadRecord(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/head/getheadDetails'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async updateAlreadyMeasured(ob) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/boq/updateAlreadyMeasured', ob).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async changestatus(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/boq/changestatus', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updaterate(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/boq/updaterate', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateBoq(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/boq/updateTender', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
 
}
