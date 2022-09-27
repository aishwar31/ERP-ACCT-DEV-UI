import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  httpUrl 
  constructor(private mainservice:MainService,private http:HttpClient ) { 
    this.httpUrl = this.mainservice.httpUrl
  }
  
async getEventBal(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/re/ev/bal' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 

async getIP(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/ip/getip' ,obj).toPromise().then(res => {
    return res;
  });
  return resp;
}
 async getar(obj){
   const resp = await this.http.post<any>(this.httpUrl + '/ar/getar' , obj).toPromise().then(res => {
    return res;
  });
  return resp
}
async getdistinctAr(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/ev/getDistinctar',obj).toPromise().then(res=>
    {
      return res
    })
    return resp
}
async getri(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/ri/getri' , obj).toPromise().then(res => {
   return res;
 });
 return resp
}

async geteventdetail(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/ev/getRegistrationList' , obj).toPromise().then(res => {
    return res;
  });
  return resp
}
async geteventdetail2(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/ev/getpaymentWithChallanId' , obj).toPromise().then(res => {
    return res;
  });
  return resp
}
async validateEmail(email) { //Validates the email address
  var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return emailRegex.test(email);
}

async validatePhone(phone) { //Validates the phone number
  console.log(phone)
  var phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
  return phoneRegex.test(phone);
}
async doValidatephone(phone) {
 let y= await this.validatePhone(phone)
 console.log(y)
 if ( ! await this.validatePhone(phone) ){
  
  return false;
}

}
async doValidateemail(email) {

if (! await this.validateEmail(email)  ){

 return false;
}
}
}
