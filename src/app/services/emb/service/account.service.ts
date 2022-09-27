import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/profile';
  }



  async getAccountImage(b_acct_id) {
    const obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    const resp = await this.http.post(this.main.httpUrl + '/accountInfo/getAccountImage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }


  async getAccountInfo(acct_id){
    const res = await this.http.get<any>(this.main.httpUrl + '/accountInfo/getAccountInfo' + acct_id).toPromise().then(res => {
       return res;
     });
     return res;

  }

  async updateAccountInfo(obj){
    const res = await this.http.put<any>(this.main.httpUrl + '/accountInfo/updateAccountInfo' , obj).toPromise().then(res => {
       return res;
     });
     return res;

  }
}
