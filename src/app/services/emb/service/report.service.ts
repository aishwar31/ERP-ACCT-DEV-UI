import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl2 ;
  }
  async getallReports(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/emb/Reports/getallReports' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getBillDataReport(obj,path) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/emb/Reports/'+path + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAlluserWithAllRoles(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/md/user/getAlluserWithAllRoles' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createreports(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl2 + '/emb/Reports/createreports' , obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
}
