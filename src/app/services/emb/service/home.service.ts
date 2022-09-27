import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/home';
  }
  async getSystemCountInfo(acct_id) {
    const res = await this.http.get<any>(this.httpUrl + '/SystemCountInfo' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;

  }

  async getAllCountInfo(pg_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/dashboard/getAllCount' + pg_id).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getSystemPpdRecordCound(acct_id) {
    const res = await this.http.get<any>(this.httpUrl + '/SystemPpdRecordCount' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;

  }
  async getCurrentPpd(pg_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/controls/platform_processing/ppd/getCurrentPpd' + pg_id).toPromise().then(res => {
      return res;
    });
    return res;

  }
  async getAccountInfo(acct_id){
    const res = await this.http.get<any>(this.main.httpUrl + '/profile/getAccountInfo' + acct_id).toPromise().then(res => {
       return res;
     });
     return res;

  }
  async getProcessInfo(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/SystemProcessRuleCountInfo' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }
}
