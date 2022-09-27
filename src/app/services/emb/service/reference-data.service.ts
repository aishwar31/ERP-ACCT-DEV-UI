import { Injectable } from '@angular/core';

import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/reference';
  }



  //dev approve

 
  async createmasterDeduction(obj){
      
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/masterdeduction/createmasterded', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }

   async getmasterdeduction(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl + '/info/masterdeduction/getmasterdeduction'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }


  async deletemasterded(acct_id){
    const resp= this.http.delete<any>(this.main.httpUrl + '/info/masterdeduction/deletemasterded'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }


  async updatemasterded(obj){
    
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/masterdeduction/updatemasterded', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
  async inserforappr(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/LevelOfAppr/inserforappr', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async getApprovalLevels(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/administration/LevelOfAppr/getApprovalLevels'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }

  async zoneheadforza(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/head/zoneheadforza'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  
  async updateApprovalLevel(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/LevelOfAppr/updateApprovalLevel', obj).toPromise().then(res => {
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

  // async getZoneHead(obj){
  //   const resp= this.http.get<any>(this.main.httpUrl+'/info/head/getZoneHead'+obj).toPromise().then(res =>{
  //     return res
  //   });
  //   return resp
  // }
  
  //budget

  async getlogOfbud(obj){
    const resp= this.http.post<any>(this.main.httpUrl+'/info/bud/getlogOfbud',JSON.parse(obj)).toPromise().then(res =>{
      return res
    });
    return resp
  }


  async getBudget(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/bud/getbud'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async createBudget(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/bud/createbud', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async updateBudget(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/bud/updatebud', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async deleteBudget(obj){
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/bud/deletebud'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }

   async getAllExpenseOnBud(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/bud/getAllExpenseOnBud',JSON.parse(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
   }
  //budget
  async getdataforprint(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getdataforprint'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async createDeduction(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/info/deduction/createded', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async addevent(obj){
    const resp = await this.http.post<any>(this.main.httpUrl2 + '/account/event/addevent', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async getDeductionList(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl + '/info/deduction/getded'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async deleteDeduction(obj){
    const resp = await this.http.delete<any>(this.main.httpUrl + '/info/deduction/deleteded'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async updateDeduction(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/deduction/updateded', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async updatededeventcode(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/info/deduction/updatededeventcode', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
  async createField(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/md/fields/createField', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
  
   async getAllFields(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl + '/md/fields/getFields'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  
  async getDataType(acct_id){
    const resp= this.http.get<any>(this.main.httpUrl + '/md/fields/'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  
  async updateFields(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/md/fields/updateField', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async deleteFields(obj){
    const resp = await this.http.delete<any>(this.main.httpUrl + '/md/fields/deleteField'+ JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async createCodeValue(obj){
    const resp = await this.http.post<any>(this.main.httpUrl + '/md/codeValue/createcodevalue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async getAllCodeValue(b_acct_id){
    const resp= this.http.get<any>(this.main.httpUrl + '/md/codeValue/getCodeValues'+b_acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async updateCodeValue(obj){
    const resp = await this.http.put<any>(this.main.httpUrl + '/md/codeValue/updatecodevalue', obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
   async deleteCodeValue(obj){
    const resp = await this.http.delete<any>(this.main.httpUrl + '/md/codeValue/deletecodevalue'+obj).toPromise().then(res => {
      return res;
    });
    return resp;
   }
  async addHierarchy(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/dataDictionary/hierarchy/addHierarchy', obj).toPromise().then(res => {
    
    return res;
    });
    return resp;
    }
    async getDataFromHierarchy(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/dataDictionary/hierarchy/getDataFromHierarchy'+obj).toPromise().then(res => {
    
    return res;
    });
    return resp;
    }
    async updateDatafromHierarchy(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/dataDictionary/hierarchy/updateDatafromHierarchy', obj).toPromise().then(res => {
    
    return res;
    });
    return resp;
    }
    async deleteDatafromHierarchy(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/dataDictionary/hierarchy/deleteDatafromHierarchy'+obj).toPromise().then(res => {
    
    return res;
    });
    return resp;
    }
  async deleteUploadedFile(id: any) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/upload/deleteUploadedFile' +id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async referenceFileProcess(obj: Object) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/upload/processUploadedFile', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async validateFile(obj: Object) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/upload/validateUploadedFile', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getUploadedReferenceFiles(acct_id){
    const res = await this.http.get<any>(this.main.httpUrl + '/upload/getUploadedReferenceFiles' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async getAccountStore(acct_id){
    const res = await this.http.get<any>(this.main.httpUrl + '/platformdata/getdatastore' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async getAllReferenceFiles(acct_id) {
    
    const res = await this.http.get<any>(this.httpUrl + '/getAllReferenceFiles' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async getconfiguredFields(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/datadictionary/getconfiguredFields' + obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async createNewRefFile(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/createreferencefile', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async updateReferenceFile(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateReferenceFile', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async deleteRefFile(obj) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteReferenceFile' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getReferenceData(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/getreferencedata' + JSON.stringify(obj)).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async insertRow(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/addRow', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteRow(obj){
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteRow' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteAllRows(obj){
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteAllRows' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async changeStateOfAllRows(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/changeStateOfAllRows', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updateRow(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateRow', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getRefAccountDetail(acct_id){
    const resp= this.http.get<any>(this.httpUrl+'/accountdetails'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async getExchangeRate(acct_id){
    const resp= this.http.get<any>(this.httpUrl+'/getexchangerate'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  async getOrganisation(acct_id){
    const resp= this.http.get<any>(this.httpUrl+'/getOrganisation'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }

  async getPresentationCurrency(acct_id){
    const resp= this.http.get<any>(this.httpUrl+'/getPresentationCurrency'+acct_id).toPromise().then(res =>{
      return res
    });
    return resp
  }
  
  async deleteAccount(params){
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteaccountinfo' + params).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 async Account_Setup_insert(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/insertaccountdetails', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async Account_Setup_update(obj){
  const resp = await this.http.put<any>(this.httpUrl + '/updateaccountinfo', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async updateExchnageRate(obj){
  const resp = await this.http.put<any>(this.httpUrl + '/updateExchangeRate', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async updateOrg(obj){
  const resp = await this.http.put<any>(this.httpUrl + '/updateOrganisation', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async addExchnageRate(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/insertExchangeRate', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async deleteExchangeRate(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/deleteExchangeRate', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async addOrganisation(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/insertOrganisation', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async deleteOrganisation(obj){
  const resp = await this.http.delete<any>(this.httpUrl + '/deleteOrganisation'+ JSON.stringify(obj)).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async createGeometry(obj){
  const resp = await this.http.post<any>(this.main.httpUrl + '/info/geometry/creategeometry', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async upddateGeometry(obj){
  const resp = await this.http.put<any>(this.main.httpUrl + '/info/geometry/updategeometry', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async getGeometry(acct_id){
  const resp= this.http.get<any>(this.main.httpUrl+'/info/geometry/getgeometry'+acct_id).toPromise().then(res =>{
    return res
  });
  return resp
}
async deleteGeometry(obj){
  const resp = await this.http.delete<any>(this.main.httpUrl+'/info/geometry/deletegeometry'+obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async createEMB(obj){
  const resp = await this.http.post<any>(this.main.httpUrl + '/info/emb/createEMB', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async getLastEMB(acct_id){
  const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getLastEmb'+acct_id).toPromise().then(res =>{
    return res
  });
  return resp
}
async getEmbforupdate(obj){
  const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getEmbforupdate'+obj).toPromise().then(res =>{
    return res
  });
  return resp
}
async getembforprint(obj){
  const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getembforprint'+obj).toPromise().then(res =>{
    return res
  });
  return resp
}
async getEmbforbill(obj){
  const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getEmbforbill'+obj).toPromise().then(res =>{
    return res
  });
  return resp
}
async getEmbList(acct_id){
  const resp= this.http.get<any>(this.main.httpUrl+'/info/emb/getEmb'+acct_id).toPromise().then(res =>{
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

 //Work Zone Project
 async getWorkHead(obj){
  const resp= this.http.get<any>(this.main.httpUrl+'/info/head/getWorkHead'+obj).toPromise().then(res =>{
    return res
  });
  return resp
}

async createWorkHead(obj){
  const resp= this.http.post<any>(this.main.httpUrl+'/info/head/createWorkHead',obj).toPromise().then(res =>{
    return res
  });
  return resp
}

async updateWorkHead(obj){
  const resp= this.http.post<any>(this.main.httpUrl+'/info/head/updateWorkHead',obj).toPromise().then(res =>{
    return res
  });
  return resp
}

async deleteWorkHead(obj){
  const resp= this.http.delete<any>(this.main.httpUrl+'/info/head/deleteWorkHead'+obj).toPromise().then(res =>{
    return res
  });
  return resp
}


//work head


  //Project head

  async getProjectHead(obj){
    const resp= this.http.get<any>(this.main.httpUrl+'/info/head/getProjectHead'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }

  async createProjectHead(obj){
    const resp= this.http.post<any>(this.main.httpUrl+'/info/head/createProjectHead',obj).toPromise().then(res =>{
      return res
    });
    return resp
  }

  async updateProjectHead(obj){
    const resp= this.http.post<any>(this.main.httpUrl+'/info/head/updateProjectHead',obj).toPromise().then(res =>{
      return res
    });
    return resp
  }

  async deleteProjectHead(obj){
    const resp= this.http.delete<any>(this.main.httpUrl+'/info/head/deleteProjectHead'+obj).toPromise().then(res =>{
      return res
    });
    return resp
  }


  //Project head

    //Zone head

    async getZoneHead(obj){
      const resp= this.http.get<any>(this.main.httpUrl+'/info/head/getZoneHead'+obj).toPromise().then(res =>{
        return res
      });
      return resp
    }

    async workheadFromProj(obj){
      const resp= this.http.get<any>(this.main.httpUrl+'/info/head/workheadFromProj'+obj).toPromise().then(res =>{
        return res
      });
      return resp
    }
    async Projectheadfromzone(obj){
      const resp= this.http.get<any>(this.main.httpUrl+'/info/head/Projectheadfromzone'+obj).toPromise().then(res =>{
        return res
      });
      return resp
    }
  
    async createZoneHead(obj){
      const resp= this.http.post<any>(this.main.httpUrl+'/info/head/createZoneHead',obj).toPromise().then(res =>{
        return res
      });
      return resp
    }
  
    async updateZoneHead(obj){
      const resp= this.http.post<any>(this.main.httpUrl+'/info/head/updateZoneHead',obj).toPromise().then(res =>{
        return res
      });
      return resp
    }
  
    async deleteZoneHead(obj){
      const resp= this.http.delete<any>(this.main.httpUrl+'/info/head/deleteZoneHead'+obj).toPromise().then(res =>{
        return res
      });
      return resp
    }


}
