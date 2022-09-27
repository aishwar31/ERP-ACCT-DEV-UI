import { Injectable } from '@angular/core';

import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class EmbService {
  

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    
    this.httpUrl = this.main.httpUrl + '/emb';


  }
    
async changestatus(obj){
  const resp = await this.http.put<any>(this.main.httpUrl + '/info/emb/changestatus', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async createembxrefappr(obj){
  const resp = await this.http.post<any>(this.main.httpUrl + '/info/emb/createembxrefappr', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
  async getbillforprint(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getbillforprint' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  } 
  async getHeadRecord(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/head/getheadDetails'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async getembbillforprint(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/info/ebill/getembbillforprint' + obj).toPromise().then(res => {
      return res;
    });
    return resp;

  } 
  async getEmbForBill(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getEmbforbill'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async getLastEMB(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getLastEmb'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async getAllEmbList(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getEmb'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async getapprovexrefembxrefappr(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getapprovexrefembxrefappr'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async deleteEMB(obj){
    const resp = await this.http.delete<any>(this.main.httpUrl+'/info/emb/deleteEMB'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
   
  }
  async updateEMB(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/emb/updateEMB', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
}