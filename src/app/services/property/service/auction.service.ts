import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  httpUrl;
  httpUrl1;
  httpUrl2;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl =  this.main.httpUrl+ "/property/auction";
    this.httpUrl1=this.main.httpUrl+"/property/property_e_auction"
    this.httpUrl2=this.main.httpUrl+"/property" 
  }
  async getCompletedAuctionOffers(obj) {
    console.log(this.httpUrl1,obj)
    const resp = await this.http.post<any>(this.httpUrl1 + '/getCompletedAuctionOffers' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async approveoffer(obj) {
    console.log(this.httpUrl1,obj)
    const resp = await this.http.post<any>(this.httpUrl1 + '/approveOffer' , obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getUpcomingAuctionOffers(obj){
    const resp = await this.http.post<any>(this.httpUrl1 + '/getUpcomingAuctionOffers', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getSpecificOfferData(obj){
    const resp = await this.http.get<any>(this.httpUrl2 + '/offers/getSpecificOfferData'+ obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 async rejectProperty(obj){
    const resp = await this.http.post<any>(this.httpUrl1 + '/rejectProperty', obj).toPromise().then(res => {
      return res;
    });
    return resp;
    

  }
  async approveProperty(obj){
    const resp = await this.http.post<any>(this.httpUrl1 + '/approveProperty', obj).toPromise().then(res => {
      return res;
    });
    return resp;
    

  }
  async getFullAuctionDetails(obj){
    const resp = await this.http.post<any>(this.httpUrl1 + '/getFullAuctionDetails', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
 async getAuctionProgress(obj){
  const resp = await this.http.post<any>(this.httpUrl1 + '/getAuctionProgress', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
  async getOngoingAuctionOffers(obj) {
    const resp = await this.http.post<any>(this.httpUrl1 + '/getOngoingAuctionOffers', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createAuction(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/addauction', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllBids(obj) {
    const resp = this.http.get<any>(this.httpUrl + '/getallBid' + obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async updateAuction(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateauction', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllAuction(obj) {
    const resp = this.http.get<any>(this.httpUrl + '/getAuctiondata' + obj).toPromise().then(res => {
     
      return res
    });
    return resp
  }
  // async deleteauction(obj){
  //   const resp = await this.http.put<any>(this.httpUrl +'/inactiveauction'+JSON.stringify(obj)).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  async deleteauction(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/inactiveauction', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllAuctionApplication(obj) {
    const resp = this.http.get<any>(this.httpUrl + '/getapplication' + obj).toPromise().then(res => {
     
      return res
    });
    return resp
  }

  async getActivePropertiesByCategory(obj) {
    const resp = this.http.post<any>(this.httpUrl1 + '/getActivePropertiesByCategory' , obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async getAppliedUserDetails(obj) {
    const resp = this.http.post<any>(this.httpUrl1 + '/getAppliedUserDetails' , obj).toPromise().then(res => {
      return res
    });
    return resp
  }

}
