import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
import { stringify } from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class PropCostingService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async  getPropertyType(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/property/propertyTypeInfo/getAllpropertyGroupData' +obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getPropertyTypeCost(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/property/propertyTypeInfo/getPropertyTypeCost' +obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createPropertyCosting(obj){
    const resp = await this.http.post(this.main.httpUrl + '/property/propertyTypeInfo/createPropertyTypeCost', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async createLocation(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/location/createlocation', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getLocationData(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/location/getlocationdata' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getAllGisLocation(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/location/getlocationCoordinates' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getLocationDoc(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/location/getlocationdoc' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateLocation(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/property/location/updatelocation' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async updatePropertyCost(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propertyTypeInfo/updatePropertyCost' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async deleteLocation(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/property/location/deletelocation' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  // async inactivePropertyTypeCost(obj) {
  //   const resp = await this.http.delete<any>(this.main.httpUrl + '/property/propertyTypeInfo/inactivePropertyTypeCost' + obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  
  async inactivePropertyTypeCost(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/property/propertyTypeInfo/inactivePropertyTypeCost' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async createPaymentOption(obj){
    const resp = await this.http.post(this.main.httpUrl + '/property/paymentOption/createPaymentOption', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getPaymentOption(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/property/paymentOption/getPaymentOption' +obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updatePaymentOption(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/property/paymentOption/updatePaymentOption' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async inactivePaymentOption(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/property/paymentOption/inactivePaymentOption' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  
  // feature

  async createFeature(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/feature/createFeature', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async  getFeatures(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/property/feature/getFeature' +obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateFeature(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/property/feature/updateFeature' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async deleteFeature(obj){
    const resp = this.http.put<any>(this.main.httpUrl + '/property/feature/inactiveFeature' ,obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async  getFeaturesExceptGiven(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/property/feature/allfeatureExceptGivenType' +obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
