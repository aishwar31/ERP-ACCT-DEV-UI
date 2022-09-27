import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
import { stringify } from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  httpUrl;


  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl+"/property/dashboard";
  }

  async  getDashBoardCount(obj) {
    const resp = await this.http.get<any>(this.httpUrl+'/getAllCount' +JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async view_Doc(obj){
    const resp = await this.http.post(this.main.httpUrl + '/property/location/getlocationImage', obj, { responseType: 'blob' }).toPromise().then(res => {
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

  async deleteLocation(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/property/location/deletelocation' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
