import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})

export class EventGroupService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) { 
    this.httpUrl = this.main.httpUrl+"/accounts/eventgroup";
  }

  async geteventlist(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/geteventlist' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  

  async geteventxref(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/geteventxref' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async rejectevent(obj){
    const res = await this.http.post<any>(this.httpUrl + '/rejectEvent',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
 
  // async insertProcessedData(obj){
  //   const res = await this.http.post<any>(this.httpUrl + '/insertProcessedData',obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return res;
  // }
  async insertProcessedData(obj){
    console.log(this.httpUrl + '/addProcessedData');
    
    const res = await this.http.post<any>(this.httpUrl + '/addProcessedData',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }

  

}
