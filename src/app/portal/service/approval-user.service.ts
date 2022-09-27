import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ApprovalUserService {

  constructor(private http: HttpClient, private mainService: MainService) { }
  level1 = {}
  //workflow*********************************************//
  level_for_approval = []
  workflow_level1 = {}
  apprflag = false
  async getWorkflowlog(ebillUser, doc_type, module_cd) {
    this.level1 = {}
    //workflow*********************************************//
    this.level_for_approval = []
    this.workflow_level1 = {}
    this.apprflag = false
    var obj = new Object()
    obj['b_acct_id'] = ebillUser.b_acct_id
    obj['status'] = 'ACTIVE'
    obj['doc_type'] = doc_type// 'EBILL'
    obj['module_cd'] = module_cd
    console.log(obj)
    var resp = await this.mainService.getWorkflows(JSON.stringify(obj))
    if (resp['error'] == false) {
      // this.spinner.hide();
      console.log(resp['data'])
// <<<<<<< dev_suraj_workflow
//       this.workflow_level1 = resp['data'][0]
//       this.level_for_approval = resp['data']
//       var currentuser_role = ebillUser.role_cd
//       for (let i = 0; i < currentuser_role.length; i++) {
//         if (this.workflow_level1['role_cd'] == currentuser_role[i]) {
//           this.apprflag = true
//         }

// =======
  this.workflow_level1 = resp['data'][0]
  if(resp['data'].length>0){
    var currentuser_role = ebillUser.role_cd
    for (let i = 0; i < currentuser_role.length; i++) {
      if(this.workflow_level1['role_cd'] ==currentuser_role[i]){
        this.apprflag = true
      }
      
    }
  }
  this.level_for_approval = resp['data']
      
      //this.toastr.successToastr("Approval Forwarded Successfully!!")
    } else {
      // this.spinner.hide();
      // swal.fire("Error", resp['data'],'error');
    }

  }
  rolebyid = {}
  useridtoname = {}
  workflowuser = []
  workuser = []
  vendorflag = false
  rolecdtolevelobj = {}
  approvalflag = false
  async getWorkflowloguser(ebillUser, selectedTender) {
    var obj = new Object()
    this.useridtoname = {}
    this.workflowuser = []
    this.workuser = [...[]]
    this.vendorflag = false
    this.rolecdtolevelobj = {}
    this.approvalflag = false
    this.conditionflag = false
    obj['b_acct_id'] = ebillUser.b_acct_id
    obj['module_cd'] = selectedTender['module_cd']
    obj['status'] = 'ACTIVE'
    obj['node_cd'] = selectedTender['node_cd'] //this.CommonDataService.workidtonode[this.selectedTender['work_id']]
    console.log(obj)
    var resp = await this.mainService.getUsersForModuleWorkflow(JSON.stringify(obj))
    if (resp['error'] == false) {
      // this.spinner.hide();
      console.log(resp['data'])
      this.workflowuser = resp['data']
      var level2 = {}
      for (let i = 0; i < this.workflowuser.length; i++) {
        this.workflowuser[i]['desc'] = this.workflowuser[i]['user_id'] + '-' + this.workflowuser[i]['emp_name'] + '-' + this.workflowuser[i]['role_cd']
        this.useridtoname[this.workflowuser[i]['user_id']] = this.workflowuser[i]['emp_name']
      }
      var level = parseInt(selectedTender['level'])
      var levelarr = []
      for (let i = 0; i < this.workflowlog.length; i++) {
        if (level < this.workflowlog[i]['level'] && (this.workflowlog[i]['status'] == 'APPROVED' || this.workflowlog[i]['status'] == 'PENDING')) {
          levelarr.push(this.workflowlog[i]['level'])
        }

      }
      console.log(ebillUser, levelarr)

      var arr = []
      var appr_level = selectedTender['level']
      for (let i = 0; i < this.level_for_approval.length; i++) {
        if (this.level_for_approval[i]['sent_to_vendor'] == 1) {
          level2 = Object.assign({}, this.level_for_approval[i])
        }
        if (this.level_for_approval[i]['level'] == selectedTender['level'] && this.level_for_approval[i]['branch'] == selectedTender['branch']) {
          this.level1 = Object.assign({}, this.level_for_approval[i])
        }
        console.log(appr_level, level, this.level_for_approval[i]['level'])
        if ((level + 1) == this.level_for_approval[i]['level'] && this.level_for_approval[i]['level'] > selectedTender['level']) {
          console.log(appr_level, level)
          appr_level = this.level_for_approval[i]['level']
        }
      }
      if (this.level1['condition_exists'] == 1) await this.checkcondition(selectedTender)
      console.log(this.level1)
      if (this.conditionflag) level = parseInt(this.level1['level'])
      appr_level = level + 2
      var approveduser = []
      for (let i = 0; i < this.workflowlog.length; i++) {
        if (this.workflowlog[i]['level'] == selectedTender['level'] && this.workflowlog[i]['branch'] == selectedTender['branch'] && (this.workflowlog[i]['status'] == 'APPROVED' || this.workflowlog[i]['status'] == 'PENDING')) {
          approveduser.push(this.workflowlog[i]['user_id'])
        }
        for (let j = 0; j < this.workflowuser.length; j++) {
          if (this.workflowlog[i]['role_cd'] == this.workflowuser[j]['role_cd'] && this.workflowlog[i]['user_id'] == this.workflowuser[j]['user_id']) {
            if (this.workflowlog[i]['status'] == 'REVOKED') this.workflowuser.splice(j, 1)
          }
        }
      }
      if (selectedTender['level'] == 1) {
        approveduser.push(ebillUser['user_id'])
      }
      if (this.conditionflag) approveduser = []
      console.log(this.level_for_approval, level2, this.level1, level, approveduser, this.workflowlog)
      var flag = false
      var flagt = false
      var orflag = true
      this.vendorflag = false
      for (let j = 0; j < this.level_for_approval.length; j++) {
        //console.log(this.level_for_approval[j])
        for (let i = 0; i < this.workflowuser.length; i++) {
          // console.log(this.workflowuser[i],this.level_for_approval[j])
          if ((this.level_for_approval[j]['role_cd'] == this.workflowuser[i]['role_cd']) && this.level_for_approval[j]['level'] == this.level1['level'] && (this.level_for_approval[j]['branch'] > this.level1['branch'])) {
            this.workflowuser[i]['level'] = this.level_for_approval[j]['level']
            this.workflowuser[i]['branch'] = this.level_for_approval[j]['branch']
            this.workflowuser[i]['branch_logical_condition'] = this.level_for_approval[j]['branch_logical_condition']
            var desc1 = this.workflowuser[i]['desc']
            this.workflowuser[i]['desc'] = this.workflowuser[i]['desc'] + '-' + this.level_for_approval[j]['level'] + '-' + this.level_for_approval[j]['branch']
            arr.push(Object.assign({}, this.workflowuser[i]))
            this.workflowuser[i]['desc'] = desc1
            this.rolecdtolevelobj[this.level_for_approval[j]['role_cd']] = this.level_for_approval[j]
            // console.log(this.workflowuser[i])
          } else if ((this.level_for_approval[j]['role_cd'] == this.workflowuser[i]['role_cd']) && this.level_for_approval[j]['level'] == this.level1['level'] && (this.level_for_approval[j]['branch'] == this.level1['branch'])) {
            if (!approveduser.includes(this.workflowuser[i]['user_id'])) {
              this.workflowuser[i]['level'] = this.level_for_approval[j]['level']
              this.workflowuser[i]['branch'] = this.level_for_approval[j]['branch']
              this.workflowuser[i]['branch_logical_condition'] = this.level_for_approval[j]['branch_logical_condition']
              var desc = this.workflowuser[i]['desc']
              this.workflowuser[i]['desc'] = this.workflowuser[i]['desc'] + '-' + this.level_for_approval[j]['level'] + '-' + this.level_for_approval[j]['branch']
              arr.push(Object.assign({}, this.workflowuser[i]))
              this.workflowuser[i]['desc'] = desc
              this.rolecdtolevelobj[this.level_for_approval[j]['role_cd']] = this.level_for_approval[j]
              // console.log(this.workflowuser[i])
            }
          }
        }

        if (this.level_for_approval[j]['all_user_approval_req'] == 0 && flagt == false) {
          if (this.level_for_approval[j]['branch'] > this.level1['branch']) {
            flag = false
          } else {
            flag = true
          }

          flagt = true
          //console.log(this.level_for_approval[j])
        }
        if (this.level_for_approval[j]['all_user_approval_req'] == 0 && this.level_for_approval[j]['level'] < this.level_for_approval[this.level_for_approval.length - 1]['level']) {
          if (this.level_for_approval[j]['branch'] > this.level1['branch']) {
            flag = false
          } else {
            flag = true
          }

          flagt = true
          console.log(this.level_for_approval[j])
        }
        if (arr.length > 0 && this.level_for_approval[j]['branch_logical_condition'] == 'AND' && flag == false) {
          orflag = false
          break;
        }
        // flag = false
      }
      if (arr.length > 0) {
        if (arr[arr.length - 1]['branch_logical_condition'] == 'OR' && arr[arr.length - 1]['level'] < this.level_for_approval[this.level_for_approval.length - 1]['level']) {
          orflag = true
        }
      }
      //flag == false
      console.log(appr_level, level, levelarr)
      var andflag = false
      if (arr.length == 0 || orflag || flag) {
        for (let j = 0; j < this.level_for_approval.length; j++) {
          console.log(this.level_for_approval[j])
          if (!levelarr.includes(this.level_for_approval[j]['level'])) {
            if (arr.length > 0 && andflag == true && (parseInt(arr[arr.length - 1]['level']) + 1) <= this.level_for_approval[j]['level']) {
              break;
            }
            for (let i = 0; i < this.workflowuser.length; i++) {
              // console.log(this.workflowuser[i],this.level_for_approval[j])

              if ((this.level_for_approval[j]['role_cd'] == this.workflowuser[i]['role_cd']) && this.level_for_approval[j]['level'] > level && (this.level_for_approval[j]['branch'] == 1)) {
                this.workflowuser[i]['level'] = this.level_for_approval[j]['level']
                this.workflowuser[i]['branch'] = this.level_for_approval[j]['branch']
                var desc2 = this.workflowuser[i]['desc']
                this.workflowuser[i]['branch_logical_condition'] = this.level_for_approval[j]['branch_logical_condition']
                this.workflowuser[i]['desc'] = this.workflowuser[i]['desc'] + '-' + this.level_for_approval[j]['level'] + '-' + this.level_for_approval[j]['branch']
                arr.push(Object.assign({}, this.workflowuser[i]))
                this.workflowuser[i]['desc'] = desc2
                this.rolecdtolevelobj[this.level_for_approval[j]['role_cd']] = this.level_for_approval[j]
                console.log(this.workflowuser[i])
                if (this.level_for_approval[j]['branch_logical_condition'] == 'OR') {
                  console.log('OK')
                  arr = await this.sameleveluser(arr, approveduser, this.level_for_approval[j])
                  console.log(arr)

                }
                if (this.level_for_approval[j]['branch_logical_condition'] == 'AND') andflag = true
              }/* else if ((this.level_for_approval[j]['role_cd'] == this.workflowuser[i]['role_cd']) && this.level_for_approval[j]['level'] == this.level1['level'] && ( this.level_for_approval[j]['branch'] == this.level1['branch'])){
              if(!approveduser.includes(this.workflowuser[i]['user_id'])){
                this.workflowuser[i]['level'] = this.level_for_approval[j]['level'] 
                this.workflowuser[i]['branch'] = this.level_for_approval[j]['branch'] 
                arr.push(this.workflowuser[i])
                this.rolecdtolevelobj[this.level_for_approval[j]['role_cd']] = this.level_for_approval[j]
              }
            } */
            }
          }
          if (this.level_for_approval[j]['all_user_approval_req'] == 0 && flagt == false) {
            flag = true
            flagt = true
          }
          if (!levelarr.includes(this.level_for_approval[j]['level'])) {
            console.log(arr.length, this.level_for_approval[j]['branch_logical_condition'], this.level_for_approval[j]['level'])
            if (arr.length > 0 && this.level_for_approval[j]['branch_logical_condition'] == 'AND' && flag == false && appr_level <= this.level_for_approval[j]['level']) {
              break;
            }
          }

          flag = false
        }
      }
      //(this.level_for_approval[j]['level'] > this.level1['level'] && this.level_for_approval[j]['branch'] == this.level1['branch']) ||
      this.workuser = arr
      //console.log(arr)

      if (this.level1['sent_to_vendor'] == 1 && selectedTender['user_id'] != -1) {
        for (let i = 0; i < this.workuser.length; i++) {

          if (this.level1['level'] == this.workuser[i]['level'] && this.level1['branch'] == this.workuser[i]['branch']) {
            //console.log(this.level1)
            this.vendorflag = false
            break;
          }
          if ((this.workuser.length - 1) == i) {
            //console.log(this.level1)
            this.vendorflag = true

          }
        }
      }
      //console.log(this.vendorflag)
      this.rolebyid = []
      for (let i = 0; i < this.workuser.length; i++) {
        if (this.workuser[i]['role_cd'] != undefined) {
          this.workuser[i]['user_id_appr'] = i + 1
          this.rolebyid[this.workuser[i]['user_id_appr']] = this.workuser[i]
        }

      }
      this.approvalflag = false
      if (this.workuser.length == 0) {
        this.approvalflag = true
      }
      /* this.workflow_level1 = resp['data'][0]
      this.level_for_approval = resp['data']
          var currentuser_role = this.ebillUser.role_cd
          for (let i = 0; i < currentuser_role.length; i++) {
            if(this.workflow_level1['role_cd'] ==currentuser_role[i]){
              this.apprflag = true
            }
            
          } */
      //this.toastr.successToastr("Approval Forwarded Successfully!!")
    } else {

      // this.spinner.hide();
      // swal.fire("Error", resp['data'],'error');
    }

  }
  conditionflag = false
  async checkcondition(wokflowdata) {
    this.conditionflag = false
    console.log(JSON.parse(this.level1['data']), wokflowdata)
    var data = JSON.parse(this.level1['data'])
    for (let i = 0; i < data.length; i++) {
      if (data[i]['selected_oprater'] == '<') {
        if (wokflowdata['field_value'] < data[i]['value']) {
          this.level1 = this.level_for_approval[this.level_for_approval.length - 1]
          this.conditionflag = true
        }
      }
      if (data[i]['selected_oprater'] == '<=') {
        if (wokflowdata['field_value'] <= data[i]['value']) {
          this.level1 = this.level_for_approval[this.level_for_approval.length - 1]
          this.conditionflag = true
        }
      }
      if (data[i]['selected_oprater'] == '==') {
        if (wokflowdata['field_value'] == data[i]['value']) {
          this.level1 = this.level_for_approval[this.level_for_approval.length - 1]
          this.conditionflag = true
        }
      }
      if (data[i]['selected_oprater'] == '>=') {
        if (wokflowdata['field_value'] >= data[i]['value']) {
          this.level1 = this.level_for_approval[this.level_for_approval.length - 1]
          this.conditionflag = true
        }
      }
      console.log(data[i]['selected_oprater'], data[i]['selected_oprater'] == '<', wokflowdata['field_value'] < data[i]['value'])
      if (data[i]['selected_oprater'] == '>') {
        if (wokflowdata['field_value'] > data[i]['value']) {
          this.level1 = this.level_for_approval[this.level_for_approval.length - 1]
          this.conditionflag = true
        }
      }
    }
    console.log(this.level1 = this.level_for_approval[this.level_for_approval.length - 1]
    )

  }
  async sameleveluser(arr, approveduser, level1) {
    var flag = false
    var flagt = false
    console.log(arr, approveduser, level1)
    for (let j = 0; j < this.level_for_approval.length; j++) {
      //console.log(this.level_for_approval[j])
      for (let i = 0; i < this.workflowuser.length; i++) {
        console.log(this.workflowuser[i], this.level_for_approval[j])
        if ((this.level_for_approval[j]['role_cd'] == this.workflowuser[i]['role_cd']) && this.level_for_approval[j]['level'] == level1['level'] && (this.level_for_approval[j]['branch'] > level1['branch'])) {
          this.workflowuser[i]['level'] = this.level_for_approval[j]['level']
          this.workflowuser[i]['branch'] = this.level_for_approval[j]['branch']
          var desc2 = this.workflowuser[i]['desc']
          this.workflowuser[i]['branch_logical_condition'] = this.level_for_approval[j]['branch_logical_condition']
          this.workflowuser[i]['desc'] = this.workflowuser[i]['desc'] + '-' + this.level_for_approval[j]['level'] + '-' + this.level_for_approval[j]['branch']
          arr.push(Object.assign({}, this.workflowuser[i]))
          this.workflowuser[i]['desc'] = desc2
          this.rolecdtolevelobj[this.level_for_approval[j]['role_cd']] = this.level_for_approval[j]
          console.log(this.workflowuser[i])
        } else if ((this.level_for_approval[j]['role_cd'] == this.workflowuser[i]['role_cd']) && this.level_for_approval[j]['level'] == level1['level'] && (this.level_for_approval[j]['branch'] > level1['branch'])) {
          /// if(!approveduser.includes(this.workflowuser[i]['user_id'])){
          this.workflowuser[i]['level'] = this.level_for_approval[j]['level']
          this.workflowuser[i]['branch'] = this.level_for_approval[j]['branch']
          this.workflowuser[i]['branch_logical_condition'] = this.level_for_approval[j]['branch_logical_condition']
          var desc3 = this.workflowuser[i]['desc']
          this.workflowuser[i]['desc'] = this.workflowuser[i]['desc'] + '-' + this.level_for_approval[j]['level'] + '-' + this.level_for_approval[j]['branch']
          arr.push(Object.assign({}, this.workflowuser[i]))
          this.workflowuser[i]['desc'] = desc3
          this.rolecdtolevelobj[this.level_for_approval[j]['role_cd']] = this.level_for_approval[j]
          console.log(this.workflowuser[i])
          // }
        }
      }

      if (this.level_for_approval[j]['all_user_approval_req'] == 0 && flagt == false) {
        flag = true
        flagt = true
      }
      if (this.level_for_approval[j]['level'] >= level1['level']) {
        if (arr.length > 0 && this.level_for_approval[j]['branch_logical_condition'] == 'AND' && flag == false) {
          //orflag = false
          break;
        }
      }
      flag = false
    }
    return arr
  }
  workflowlog = []
  workflowlogall = []

  async getWorkflowlogbydocno(ebillUser,selectedline){
   
  this.workflowlogall = []
var resp = await this.mainService.getWorkflowlog(JSON.stringify({b_acct_id:ebillUser['b_acct_id'],module_cd:selectedline['module_cd'],doc_type:selectedline['doc_type'],doc_local_no:selectedline['doc_local_no']}))
console.log(resp)
if (resp['error'] == false) {
  this.workflowlogall = resp['data']
}

  }
  async getMostLatestWorkflowlog(ebillUser, selectedline) {
    this.workflowlog = []

    var resp =  await this.mainService.getMostLatestWorkflowlog(JSON.stringify({b_acct_id:ebillUser['b_acct_id'],module_cd:selectedline['module_cd'],doc_type:selectedline['doc_type'],doc_local_no:selectedline['doc_local_no']}))

    if (resp['error'] == false) {
      this.workflowlog = resp['data']
      console.log(this.workflowlog)
    }
  }
}
