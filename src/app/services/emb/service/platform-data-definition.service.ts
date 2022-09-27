import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class PlatformDataDefinitionService {
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/datadictionary';
  }




  ////new Code Shubham;


  async getAllBusinessTerms(pg_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/data_dictionary/terms/getAllTerms' + pg_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async createfile(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/data_dictionary/balance_file/createRsf ', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }

  async getconfiguredfileInfo(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/data_dictionary/balance_file/getAllBalanceFiles' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }

  async getfileselect(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/data_dictionary/getAllFileInfo' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async deletefile(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/administration/data_dictionary/balance_file/deleteRsf' + obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }


  async Updatefile(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/data_dictionary/balance_file/updateBalanceFile ', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }



  async get_file_info(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/data_dictionary/balance_file/getBalanceFileInfo' + obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }





  async get_process(obj) {

    const resp = await this.http.get<any>(this.main.httpUrl + '/controls/platform_processing/process_log/getProcessLog' +
      obj).toPromise().then(res => {
        return res;
      });
    return resp;
  }
  ////new Code Shubham;



  //old code



  async getDataFromMultipleCodeValue(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/getDataFromMultipleCodeValue' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteDatafromMultipleCodeValue(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/deleteDatafromMultipleCodeValue' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateDatafromMultipleCodeValue(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/updateDatafromMultipleCodeValue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async addMultipleCodeValue(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/addMultipleCodeValue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createteHierarchy(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/dataDictionary/hierarchy/createteHierarchy', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async gethierarchy(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dataDictionary/hierarchy/gethierarchy' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async deleteHierarchy(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/dataDictionary/hierarchy/deleteHierarchy' + obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async updateHierarchy(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/dataDictionary/balanceFile/updateHierarchy', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  // async createfile(obj) {
  //   const resp = await this.http.post<any>(this.main.httpUrl + '/dataDictionary/balanceFile/createbalanceFile', obj).toPromise().then(res => {

  //     return res;
  //   });
  //   return resp;
  // }
  // async getconfiguredfileInfo(acct_id) {
  //   const resp = await this.http.get<any>(this.main.httpUrl + '/dataDictionary/balanceFile/getBalanceFile' + acct_id).toPromise().then(res => {

  //     return res;
  //   });
  //   return resp;
  // }
  // async deletefile(obj) {
  //   const resp = await this.http.delete<any>(this.main.httpUrl + '/dataDictionary/balanceFile/deletebalanceFile' + obj).toPromise().then(res => {

  //     return res;
  //   });
  //   return resp;
  // }
  // async Updatefile(obj) {
  //   const resp = await this.http.put<any>(this.main.httpUrl + '/dataDictionary/balanceFile/updateBalanceFile', obj).toPromise().then(res => {

  //     return res;
  //   });
  //   return resp;
  // }


  ///////////////////////////////////////////////////Field/////////////////////////////////////////////////////////

  async getconfiguredFields(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getconfiguredFields' + obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }

  async updateConfiguredField(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateField', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }

  async addNewField(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/addNewField', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }

  async deleteField(field_id) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteField' + field_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }


  /////////////////////////////////////////////////////////Multi Code value///////////////////////////////////////////////////

  async getAllMultiCodeValue(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/getMultipleCodeValues' + acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteMultiCodeValue(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/deletemultipleCodeValue' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updatemulticodevalue(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/updateMultipleCodeValue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createmulticodevalue(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/dataDictionary/multipleCodeValue/createMultipleCodeValue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }



  ///////////////////////////////////////////////////////Event Layout/////////////////////////////////////////////////////


  async geteventLayouts(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dataDictionary/eventLayouts/geteventLayouts' + acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteEventLayout(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/dataDictionary/eventLayouts/deleteEventLayout' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateEventLayout(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/dataDictionary/eventLayouts/updateEventLayout', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createEventLayout(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/dataDictionary/eventLayouts/createEventLayout', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async getExtNaturalKey(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata/getExtNaturalKey' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async updateExtNaturalKey(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/platformdata/updateExtNaturalKey', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }






  async getconfiguredJournalInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/Journal/getJournalInfo' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }

  async getconfiguredIpInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/ip/getipInfo' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }

  async getconfiguredAuditInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/audit/getauditInfo' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }

  async getconfiguredSalInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/sal/getsalInfo' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }


  async UpdateJournal(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/journal/UpdateJournal', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async UpdateIp(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/ip/UpdateIp', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async UpdateSal(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/sal/UpdateSal', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async UpdateAudit(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/audit/UpdateAudit', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async getAllLogicalFields() {

    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata' + '/getAllLogicalFields').toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async getextensionData(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata/getAllExtFields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }

  async addExtension(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/platformData/createExtStructures', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async delete_extension(obj) {
    var params = JSON.stringify(obj)

    const resp = await this.http.delete<any>(this.main.httpUrl + '/platformData/deleteExtStructures' + params).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async updateExtension(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/platformData/updateExtStructures', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }


  async getJsfRsfStatus(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata/getjsfrsfstatus' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async updateJsfRsfStatus(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/platformdata/updatejsfrsfstatus', obj).toPromise().then(res => {


      return res;
    });
    return resp;
  }
  async getAllRsfFileFields(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata/getallrsffilefields' + acct_id).toPromise().then(res => {


      return res;
    });
    return resp;
  }
  async getJsfFilefilelds(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata/getjsffilefields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async addJsf(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/platformdata/updatejsfstructure', obj).toPromise().then(res => {


      return res;
    });
    return resp;
  }
  async addRsf(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/platformdata/creatersfstructures', obj).toPromise().then(res => {


      return res;
    });
    return resp;
  }

  async deleteRsfField(params) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/platformData/deletersfStructures' + params).toPromise().then(res => {


      return res;
    });
    return resp;
  }
  async updateRsfField(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/platformdata/updatersfstructures', obj).toPromise().then(res => {


      return res;
    });
    return resp;
  }
  async getBalanceFiles(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata/getBalanceFiles' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async getAllFiles(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata/getAllFileFields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async createBalanceFile(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/platformdata/createBalanceFile', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async updateBalanceFile(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/platformdata/updateBalanceFile', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async deleteBalanceFile(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/platformData/deleteBalanceFile' + JSON.stringify(obj)).toPromise().then(res => {

      return res;
    });
    return resp;
  }
}