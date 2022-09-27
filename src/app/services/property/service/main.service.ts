import { HttpClient, HttpEventType } from '@angular/common/http';

import { AuthenticationService } from '../../../authentication.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }
  profileImageUrl;
  codeValueTechObj = {};
  accountImageUrl;
  accInfo = {}
  codeValueShowObj = {};
  allLableShowObj = {}
  allLabel = []
  //httpUrl="http://localhost:30001";
  //httpUrl="http://139.59.61.84:3000";
  uiUrl="https://erpuat.upda.co.in/public/#/prop/sale"
  // httpUrl="https://vdaerp.svayamtech.com:3002";
  httpUrl = this.auth.httpUrl;
  dateFormatChange(date) {
    var datear1 = date.split('T')[0]
    var datearr = datear1.split("-")
    return datearr[2] + '/' + datearr[1] + '/' + datearr[0]
  }
  async sendmail(obj) {
    console.log(this.httpUrl,obj)
    const resp = await this.http.post<any>( this.httpUrl + "/emailservice/sendemail" , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async sendsms(obj) {
    console.log(this.httpUrl,obj)
    const resp = await this.http.post<any>( this.httpUrl + "/emailservice/sendsms" , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getFields(obj) {

    const res = await this.http.get<any>(this.httpUrl + '/metadata/fields/getfields' + obj).toPromise().then(res => {
      return res;

    });
    return res;

  }
  async getCodeValue(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/codeValue/getCodeValues' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createLegalEntity(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/systemdata/legalentity/createindentity', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getCurrentLegalEntity(b_acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getcurrentlegalentity' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}

