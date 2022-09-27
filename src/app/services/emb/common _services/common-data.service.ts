import { Injectable } from '@angular/core';
import { ReferenceDataService } from '../service/reference-data.service';
import { FilterService } from '../service/filter.service';
import { UserService } from '../service/user.service';
import { MainService } from '../service/main.service';
import { ApproveService } from '../service/approve.service';
import { MasterDataService } from '../service/master-data.service';
import { EmbHierService } from '../service/emb-hier.service';


@Injectable({
  providedIn: 'root'
})


export class CommonDataService {

  constructor(private masterDataService: MasterDataService, 
    private approveService: ApproveService, private mainService: MainService, 
    public refService: ReferenceDataService, public filterService: FilterService, 
    public userService: UserService ,private embHierService:EmbHierService) { }
    
  async getCodeValue(b_acct_id, zone_cd) {
    let obj = {}
    obj['b_acct_id'] = b_acct_id;
    console.log(obj);
    var resp = await this.refService.getAllCodeValue(JSON.stringify(obj));
    var codeValueTempObj = {}
    var codeValueShowTempObj = {};
    if (resp['error'] == false) {
      for (var i = 0; i < resp.data.length; i++) {
        resp.data[i]['desc'] = resp.data[i]['code'] + " - " + resp.data[i]['value']
        if (codeValueTempObj[resp.data[i]['field_code']] == undefined) {
          codeValueTempObj[resp.data[i]['field_code']] = [];
          codeValueShowTempObj[resp.data[i]['field_code']] = {}
        }
        codeValueShowTempObj[resp.data[i]['field_code']][resp.data[i].code] = resp.data[i].value;
        codeValueTempObj[resp.data[i]['field_code']].push(resp.data[i])
      }
      if (zone_cd != null) {
        var temp = [];
        for (let i = 0; i < codeValueTempObj['EMB003'].length; i++) {
          if (codeValueTempObj['EMB003'][i]['code'] == zone_cd) {
            temp.push(codeValueTempObj['EMB003'][i])
          }
        }
        codeValueTempObj['EMB003'] = temp;
      }

      this.mainService.codeValueTechObj = codeValueTempObj;
      this.mainService.codeValueShowObj = codeValueShowTempObj;
      await this.filterService.FilterDataFunctionForCodeValue();
    }
  }



  ProjectCodeToZoneCodeObj = {}
  async getProjectZoneInfo(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    this.ProjectCodeToZoneCodeObj = {}
    var resp = await this.masterDataService.getProjectInfo(JSON.stringify(obj));
    if (resp['error'] == false) {
      for (let i = 0; i < resp.data.length; i++) {
        this.ProjectCodeToZoneCodeObj[resp.data[i]['project_cd']] = resp.data[i]['zone_cd']
      }
    }
    console.log(this.ProjectCodeToZoneCodeObj)
  }

  WorkOrderNumberToWOrkIDObj={}
  async getWorkOrderTOWorkIdInfo(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    this.WorkOrderNumberToWOrkIDObj = {}
    var resp = await this.masterDataService.getWorkInfo(JSON.stringify(obj));
    console.log(resp,'getWorkInfo')
    console.log(resp)
    if (resp['error'] == false) {
      for (let i = 0; i < resp.data.length; i++) {
        this.WorkOrderNumberToWOrkIDObj['EMBWORK'+resp.data[i]['id']] = resp.data[i]['id']
      }
    }
    console.log(this.WorkOrderNumberToWOrkIDObj)
  }


  assignedWork={};
  async getAssignedWorkInfo(b_acct_id,user_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    obj['user_id']=user_id;
    console.log(obj,'getuserAssigneddata')
    var resp = await this.embHierService.getAllEmbdataAssigned(JSON.stringify(obj));
  
    console.log(resp,'getuserAssigneddata')
    if (resp['error'] == false) {
      console.log(resp.data);
      this.assignedWork={};
      let work = await this.embHierService.getprojectHierarchy(obj)
      let node = work['data']
      for(let i=0;i<resp.data.length;i++){
        if(resp['data'][i]['user_id'] == user_id){
          let level = 0
          for (let j = 0; j < node.length; j++) {
            if(node[j]['leaf_cd']==resp.data[i]['node_cd']){
            for (let k = 1; k < 8; k++) {
              if(node[j]['lvl'+k+'_cd']==resp.data[i]['node_cd']){
                level = k
              }
              
              }
              
            }
            
            
          }
          for (let j = 0; j < node.length; j++) {
            if(node[j]['is_leaf']==1 && node[j]['lvl'+level+'_cd']==resp.data[i]['node_cd']){
              if(this.WorkOrderNumberToWOrkIDObj[node[j]['leaf_user_cd']] != undefined){
                this.assignedWork[this.WorkOrderNumberToWOrkIDObj[node[j]['leaf_user_cd']]]=this.WorkOrderNumberToWOrkIDObj[node[j]['leaf_user_cd']]

              }
            }
            
          }
        }
        /* if(resp.data[i]['is_leaf']==1){
          this.assignedWork[resp.data[i]['node_cd']]=resp.data[i]['node_cd']
        } */
      }
    }
    console.log(this.assignedWork);
  }

  
  async getAllRolesWIthResource(b_acct_id) {
    var resp = await this.mainService.getcurrentroleswithresources(JSON.stringify({ b_acct_id: b_acct_id }));
    console.log(resp,'getcurrentroleswithresources')
    if (resp['error'] == false) {
      for (let i = 0; i < resp.data.length; i++) {
        this.mainService.roleCodeToRoleDescription[resp.data[i]['role_cd']] = resp.data[i]['role_name'];
        this.mainService.ObjRoleCodeTOAccess[resp.data[i]['role_cd']] = resp.data[i]['access'];
      }
    }
    console.log(this.mainService.roleCodeToRoleDescription)
  }

  async getAllApprovalStatus(b_acct_id, user_id, role_cd, zone_cd) {
    let obj = {};
    obj['b_acct_id'] = b_acct_id;
    obj['status'] = ["UNDERAPPROVAL"];
    obj['role_cd'] = role_cd;
    obj['zone_cd'] = zone_cd;
    obj['user_id'] = user_id;

    var resp = await this.approveService.getApprbyuserid(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.mainService.taskcount = resp.data.length;
    }
  }

  zone_field_business_name = '';
  async getZoneFieldFieldName(b_acct_id) {
    let obj = {}
    obj['b_acct_id'] = b_acct_id;
    var resp = await this.refService.getAllFields(JSON.stringify(obj));
    if (resp['error'] == false) {
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['field_code'] == 'EMB003') {
          this.zone_field_business_name = resp.data[i]['field_business_name'];
        }
      }
    } 
  }
  BudgetCodeToValue={};
  async getAllBudgetInfo(b_acct_id) {
    this.BudgetCodeToValue={};

    var resp = await this.refService.getBudget(JSON.stringify({ b_acct_id: b_acct_id }));
    if (resp['error'] == false) {
      this.BudgetCodeToValue={};

      for(let i=0;i<resp.data.length;i++){
        this.BudgetCodeToValue[resp.data[i]['bud_cd']]=resp.data[i]['bud_amt']
      }

    } else {
      
    }
  }
  workidtonode = {}
  async getAllWorkInfo(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    var resp = await this.masterDataService.getWorkInfo(JSON.stringify(obj));
    if (resp['error'] == false) {
      var data = resp.data;
      console.log(data)
     for (let i = 0; i < data.length; i++) {
      this.workidtonode[data[i]['work_order_no']] =data[i]['id'] 
       
     }
      console.log(this.workidtonode)
     
    } else {
     
    }
  }
}
