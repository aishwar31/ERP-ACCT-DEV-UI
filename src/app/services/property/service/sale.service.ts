import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + "/property/offers";
  }

  async getGroupPlanLayoutProperty(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getAllpropertyGroupData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getrefunds(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getrefunds' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllOffers(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/offers/getofferData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllOffers_auction(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/property_e_auction/getofferData_auc' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createOffer(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/offers/createoffer', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createOfferauction(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/property/property_e_auction/createOfferauction', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createEvent(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/account/event/addevent', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createEventHierarchy(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/accounts/hierarchy/addModulesHierarchy', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async sendToAccount(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/accounts/eventgroup/createevent', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async deleteOffer(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/offers/inactiveOffer', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async changeOfferStatus(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/offers/changeStatus', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAllPartyUploadedDocuments(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/offers/getPartyUplodedData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async view_Doc(obj){
    const resp = await this.http.post(this.main.httpUrl + '/property/PropertyDoc/viewDocument', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getAllRequiredDocumentsForUpload(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/offers/getOfferDocData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllUsedAccount(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/offers/getGatewayOffer' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllPropertyByOffer(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/property_e_auction/getofferPro_auc' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllSubsidyData(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/offers/getofferSubsidy' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async getCostingByOffer(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/offers/getCostingByOffer' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getPropTypeCost(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/property_type_cost/getPropTypeCost' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateOffer(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/offers/updateoffer', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateOffer_auction(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/property/property_e_auction/updateOfferauction', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllAuctionUser(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/interface/property/auction/getauctionPartyInfo' + obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }
  
  async getAllPropertyOffers(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/property/offers/getAllofferProperty' + obj).toPromise().then(res => {
      console.log(res)
      return res
    });
    return resp
  }

 
}
