import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
import { AdministrationService } from './administration.service';
import { HrHierService } from './hr-hier.service';
import { EstablishService } from './establish.service';
import { AllEmpService } from './all-emp.service';
@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  httpUrl;

  employee_id;

  constructor(private allEmpService: AllEmpService, private establishService: EstablishService, private http: HttpClient, private main: MainService, private hrHierService: HrHierService) {
    this.httpUrl = this.main.httpUrl + "/hr";
  }


  async filterEmployeeData(allEmplyees){
    var data = [];
    var assignedEmp = this.assignedEmp;
    console.log(assignedEmp)
    for (let i = 0; i < allEmplyees.length; i++) {
      if (assignedEmp[allEmplyees[i]['arr_id']] != undefined) {
        data.push(allEmplyees[i])
      }
    }
    return data
  }

  
  async filterEmployeeDataByUserId(allEmplyees){
    var data = [];
    var assignedEmp = this.assignedEmp;
    console.log(assignedEmp)
    for (let i = 0; i < allEmplyees.length; i++) {
      if (assignedEmp[this.UserIdToArrIdObj[allEmplyees[i]['user_id']]] != undefined) {
        data.push(allEmplyees[i])
      }
    }
    return data
  }
 
  async getAccountProjectHier(b_acct_id,user_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    var resp = await this.allEmpService.getAccountProjectHier(obj);
    console.log(resp)
    if (resp['error'] == false) {
      console.log(resp)
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i]['lvl1_value'] == "All Projects") {
          resp.data[i]['lvl1_value'] = 'HR-root'
        }
      }
      var data = [];
      // var level=0;
      // var assigned_node=[]
      // for(let j=0;j<this.data_assigment.length;j++){
      //   assigned_node.push(this.data_assigment[j]['node_cd'])
      // }
      
      for (let i = 0; i < resp.data.length; i++) {
        var tt=[]
        for (let k = 1; k < 8; k++) {
          if (resp.data[i]['lvl' + k + '_cd']!=null) {
            tt.push(resp.data[i]['lvl' + k + '_cd'])
          }
        }
        var exit_flag=false;
        this.data_assigment=this.data_assigment.filter(x=>x.user_id==user_id)
        for(let j=0;j<this.data_assigment.length;j++){
          if(tt.includes(parseInt(this.data_assigment[j]['node_cd']))){
            exit_flag=true;
          }
        }
        if(tt.length==1){
          exit_flag=true;
        }
        
        if (((resp.data[i]['lvl1_cd'] == resp.data[i]['leaf_cd']) || (resp.data[i]['lvl2_cd'] == resp.data[i]['leaf_cd']) || (resp.data[i]['module_cd'] == "HR"))
          && (resp.data[i]['module_cd'] != null || resp.data[i]['module_cd'] != undefined) && exit_flag) {
          data.push(resp.data[i])
        }
      }


    

      console.log(data)

    } else {
      console.log("Error in getting all project hier")
    }
  }
  async getCurrentDataAccess(b_acct_id, user_id){
    await this.getArrIdInfo(b_acct_id);
    await this.getAssignedEmpInfo(b_acct_id, user_id);
    await this.getAccountProjectHier(b_acct_id,user_id);
  }

  ArrIdToWOrkIDObj = {}
  UserIdToArrIdObj = {}
  async getArrIdInfo(b_acct_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    this.ArrIdToWOrkIDObj = {}
    this.UserIdToArrIdObj = {}
    var resp = await this.establishService.getAllArrangment(JSON.stringify(obj));
    console.log(resp, 'getArrInfo')
    console.log(resp)
    if (resp['error'] == false) {
      for (let i = 0; i < resp.data.length; i++) {
        this.ArrIdToWOrkIDObj['HRARR' + resp.data[i]['arr_id']] = resp.data[i]['arr_id']
        this.UserIdToArrIdObj[resp.data[i]['cp_le_id']] = resp.data[i]['arr_id']
      }
    }
    console.log(this.ArrIdToWOrkIDObj)
  }


  assignedEmp = {};

  data_assigment=[]
  async getAssignedEmpInfo(b_acct_id, user_id) {
    var obj = new Object();
    obj['b_acct_id'] = b_acct_id;
    obj['user_id'] = user_id;
    console.log(obj, 'getuserAssigneddata')
    var resp = await this.hrHierService.getAllHrdataAssigned(JSON.stringify(obj));


    console.log(resp, 'getuserAssigneddata')
    if (resp['error'] == false) {
      console.log(resp.data);
      this.data_assigment=resp.data;
      this.data_assigment=this.data_assigment.filter(x=>x.user_id==user_id)
      this.assignedEmp = {};
      let work = await this.allEmpService.getAccountProjectHier(obj);
      let node = work['data']
      console.log(node)
      for (let i = 0; i < resp.data.length; i++) {
        if (resp['data'][i]['user_id'] == user_id) {
          let level = 0
          for (let j = 0; j < node.length; j++) {
            if (node[j]['leaf_cd'] == resp.data[i]['node_cd']) {
              console.log(node[j])
              for (let k = 1; k < 8; k++) {
                if (node[j]['lvl' + k + '_cd'] == resp.data[i]['node_cd']) {
                  level = k
                }
              }
            }
          }
          for (let j = 0; j < node.length; j++) {
            if (node[j]['is_leaf'] == 1 && node[j]['lvl' + level + '_cd'] == resp.data[i]['node_cd']) {
              if (this.ArrIdToWOrkIDObj[node[j]['leaf_user_cd']] != undefined) {
                this.assignedEmp[this.ArrIdToWOrkIDObj[node[j]['leaf_user_cd']]] = this.ArrIdToWOrkIDObj[node[j]['leaf_user_cd']]
              }
            }
          }
        }
      }
    }
    console.log(this.assignedEmp);
  }
}
