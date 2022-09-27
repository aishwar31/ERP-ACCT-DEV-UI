import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
import { stringify } from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  httpUrl;


  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl+"/property/dashboard";
  }

  async view_Doc(obj){
    const resp = await this.http.post(this.main.httpUrl + '/property/PropertyDoc/viewDocument', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getAllUploadedDocument(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/PropertyDoc/getdoc' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
