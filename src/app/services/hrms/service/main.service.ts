import { HttpClient, HttpEventType } from '@angular/common/http';

import { AuthenticationService } from '../../../authentication.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient,private auth:AuthenticationService) { }
  profileImageUrl;
  codeValueTechObj={};
  accountImageUrl;
  accInfo={}
  codeValueShowObj={};
  allLableShowObjHR = {};
  allLabelHR = [];
  language_cd='ENG'
  //httpUrl="http://localhost:3001";
  // httpUrl="https://vdaerp.svayamtech.com:3000";
  httpUrl=this.auth.httpUrl;

  
  dateformatchange(date){
    if(date==null || date == undefined){
      return "";
    }
    var datear1 = date.split('T')[0]
    var datearr = datear1.split("-") 
    return datearr[2]+'/'+datearr[1]+'/'+datearr[0]
  }
  changeLanguage() {
    if(this.language_cd==null || this.language_cd==undefined){
      this.language_cd='ENG'
    }
    console.log(this.language_cd)
  }
  
  async getFields(obj){
    const res = await this.http.get<any>(this.httpUrl + '/metadata/fields/getfields'+obj).toPromise().then(res => {
      return res;
    });
    return res;

  }
  async getcomponentLabelvalueswithLanguage(obj) {
    const res = await this.http.get<any>(this.httpUrl + '/systemdata/languages/getcomponentLabelvalueswithLanguage' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getCodeValue(b_acct_id){
    const resp = await this.http.get<any>(this.httpUrl + '/metadata/codeValue/getCodeValues'+b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createLegalEntity(obj){
    const res = await this.http.post<any>(this.httpUrl + '/systemdata/legalentity/createindentity',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getCurrentLegalEntity(b_acct_id){
    const resp = await this.http.get<any>(this.httpUrl + '/systemdata/legalentity/getcurrentlegalentity'+b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async add_legal_entity(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/md/user/addlegalentity',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

}

