import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class AllotmentLetterConfigurationService {
  httpUrl;

  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + "/property/application";
  }

  async getAllAllotmentLetterData(obj) {
    const resp = this.http.get<any>(this.main.httpUrl + '/property/allotmentletter/getAllAllotmentLetter' + obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getAllChildAllotmentLetterData(obj) {
    const resp = this.http.get<any>(this.main.httpUrl + '/property/allotmentletter/getAllChildAllotmentLetter' + obj).toPromise().then(res => {
      return res
    });
    return resp
  }


  async uploadImage(obj) {
    const resp = this.http.post<any>(this.httpUrl + '/uploadImage', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async uploadImage2(obj) {
    const resp = this.http.post<any>(this.httpUrl + '/uploadImage', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async insertAllotmentLetterData(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/property/allotmentletter/insertAllotmentLetterData', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async insertAllotmentChildLetterData(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/property/allotmentletter/insertAllotmentChildLetterData', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async updateAllotmentLetterData(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/allotmentletter/updateAllotmentLetterData', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async upadteAllotmentChildLetterData(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/allotmentletter/upadteAllotmentChildLetterData', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getUploadedFileofparty(obj) {
     
    const resp = await this.http.post(this.main.httpUrl + '/property/allotmentletter/getImage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }
  
  async getdistinctOffer(obj) {
    const resp = this.http.get<any>(this.main.httpUrl + '/property/offers/getAlldistinctoffer' + obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getAllterms(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/co/getco' , obj).toPromise().then(res => {
      return res
    });
    return resp

  }
  
  async postco(obj){
    const resp = this.http.post<any>(this.main.httpUrl + '/co/addco' , obj).toPromise().then(res => {
      return res
    });
    return resp

  }
  
  async updateco(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/co/updateco' , obj).toPromise().then(res => {
      return res
    });
    return resp

  }
  
  async deleteco(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/co/deleteco' , obj).toPromise().then(res => {
      return res
    });
    return resp

  }
  
}

