import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class VendorService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async getvendor(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/party/getvendor'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async partywithphone(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/party/partywithphone'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async getWorkInfo(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/info/work/getWorkInfo' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getApprbyvendorid(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/appr/getApprbyvendorid'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
