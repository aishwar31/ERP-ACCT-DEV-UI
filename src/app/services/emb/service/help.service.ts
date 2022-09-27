import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class HelpService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl+'/help';
  }
  async askUs(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/gethelp', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
}
