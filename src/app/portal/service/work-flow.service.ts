import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class WorkFlowService {

  constructor(private http: HttpClient, private mainService: MainService) { }
  level_for_approval = []
  async getWorkflowlog(ebillUser,doc_type,module_cd){
    var obj =new Object()
    obj['b_acct_id'] = ebillUser.b_acct_id
    obj['status'] = 'ACTIVE'
    obj['doc_type'] =doc_type// 'EBILL'
    obj['module_cd'] = module_cd
    var resp = await this.mainService.getWorkflows(JSON.stringify(obj))
    if (resp['error'] == false) {
     // this.spinner.hide();
      console.log(resp['data'])
  
  this.level_for_approval = resp['data']
     
      //this.toastr.successToastr("Approval Forwarded Successfully!!")
    } else {
     // this.spinner.hide();
     // swal.fire("Error", resp['data'],'error');
    }
  
  }
  workflowuser = []
  async getWorkflowloguser(ebillUser,selectedTender){
    var obj =new Object()
    obj['b_acct_id'] = ebillUser.b_acct_id
    obj['module_cd'] = selectedTender['module_cd']
    obj['status'] = 'ACTIVE'
    obj['node_cd'] =selectedTender['node_cd'] //this.CommonDataService.workidtonode[this.selectedTender['work_id']]
    console.log(obj)
    var resp = await this.mainService.getUsersForModuleWorkflow(JSON.stringify(obj))
    if (resp['error'] == false) {
     // this.spinner.hide();
      console.log(resp['data'])
      this.workflowuser = resp['data']
      for (let i = 0; i < this.level_for_approval.length; i++) {
        for (let j = 0; j < this.workflowuser.length; j++) {

          if(this.level_for_approval[i]['role_cd'] == this.workflowuser[j]['role_cd']){
            if(this.level_for_approval[i]['users'] == undefined){
              this.level_for_approval[i]['users'] = this.workflowuser[j]['emp_name']
            }else if(this.level_for_approval[i]['all_user_approval_req'] == 1){
              this.level_for_approval[i]['users'] =this.level_for_approval[i]['users']+','+ this.workflowuser[j]['emp_name']
            }else if(this.level_for_approval[i]['all_user_approval_req'] == 0){
              this.level_for_approval[i]['users'] =this.level_for_approval[i]['users']+'/'+ this.workflowuser[j]['emp_name']
            }
            
          }
          
        }
        
      }
    }
  }
}
