import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
// import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // online$: Observable<boolean>;
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/profile';
  }
  async getImage(user_id) {
    const obj = new Object();
    obj['user_id'] = user_id;
    const resp = await this.http.post(this.main.httpUrl + '/userProfile/getProfileImage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }
  async changePasword(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/authentication/changePassword', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getUserProfileInfo(user_id) {
    
      const res = await this.http.get<any>(this.main.httpUrl + '/userProfile/getUserProfile' + user_id).toPromise().then(res => {
        return res;
      });
      return res;
  
   
    
  }
  // async getUserProfileInfo(user_id) {

  //   var resp = { error: true };
  //   var error_flag = false;
  //   if (navigator.onLine) { // true|false
  //     const res = await this.http.get<any>(this.main.httpUrl + '/userProfile/getUserProfile' + user_id).toPromise().then(res => {
  //       console.log(res)
  //       return res;
  //     })
  //       .catch(err => {
  //         error_flag = true;
  //         console.log(err);
  //       });
  //     if (error_flag) {
  //       return resp
  //     }
  //     return res;
  
  //   }else{
      
  //     console.log(" Your Internet Not Connected")
  //     return resp
  //   }
    
  // }
  async updateProfile(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/userProfile/updateProfile', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}