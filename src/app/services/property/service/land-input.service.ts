import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
import { stringify } from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class LandInputService {


  httpUrl;


  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + "/property/dashboard";
  }

  // async  getDashBoardCount(obj) {
  //   const resp = await this.http.get<any>(this.httpUrl+'/getAllCount' +JSON.stringify(obj)).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  // async view_Doc(obj){
  //   const resp = await this.http.post(this.main.httpUrl + '/property/location/getlocationImage', obj, { responseType: 'blob' }).toPromise().then(res => {
  //     return res
  //   });
  //   return resp
  // }
  async createLandInput(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/locationGroup/createlocationGroup', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getLandInputData(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/locationGroup/getlocationGroupdata' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getlocationGroupTargetdata(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/locationGroup/getlocationGroupTargetdata' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateLandInput(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/locationGroup/updatelocationGroup', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteLandInput(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/locationGroup/inactivelocationGroup', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  //plan layout Service//
  async createpropertyGroup(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/PropertyGroup/createpropertyGroup', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getpropertygroup(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/PropertyGroup/getpropertygroup' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getpropertyGroupdata(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/PropertyGroup/getallpropertyGroupdata' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async inactivePropertyGroup(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/PropertyGroup/inactivePropertyGroup', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async updatepropertyGroup(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/PropertyGroup/updatepropertyGroup', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  // api for property inventory
  async createproperties(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/properties/createproperties', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getpropertiesData(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/properties/getpropertiesData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getpropertiesWithFeature(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/properties/getpropertiesWithFeature' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteProperties(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/properties/deleteProperties', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async updateproperties(obj) {
    const resp = this.http.put<any>(this.main.httpUrl + '/property/properties/updateproperties', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async createCodeValueForPlanLayout(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/PropertyGroup/createcodevalue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
