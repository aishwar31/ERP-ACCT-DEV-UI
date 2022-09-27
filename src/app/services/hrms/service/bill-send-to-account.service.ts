import * as moment from 'moment';

import { HttpClient, HttpEventType } from '@angular/common/http';

import { AllEmpService } from './all-emp.service';
import { ApprService } from './appr.service';
import { EstablishService } from './establish.service';
import { EstablishmentService } from './establishment.service';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { PayrollService } from './payroll.service';

@Injectable({
  providedIn: 'root'
})
export class BillSendToAccountService {
  b_acct_id;
  erpUser;
  httpUrl
  constructor(private http: HttpClient, private allEmpService: AllEmpService, private payableService: PayrollService, private mainService: MainService) {
    this.httpUrl = this.mainService.httpUrl
  }
  allBudget = [];
  budgetHier = {};
  async getAllBudget() {
    let obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    let resp = await this.allEmpService.getAllBugdet(obj);
    console.log(resp);
    if (resp['error'] == false) {
      this.allBudget = resp.data;
      for (let i = 0; i < this.allBudget.length; i++) {
        this.budgetHier[this.allBudget[i]['budget_cd']] = this.allBudget[i]['budget_desc']
      }
    }
  }
  allProduct = [];
  productHier = {};
  async getAllProduct() {
    let obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    let resp = await this.allEmpService.getAllProduct(obj);
    console.log(resp);
    if (resp['error'] == false) {
      this.allProduct = resp.data;
      for (let i = 0; i < this.allProduct.length; i++) {
        this.productHier[this.allProduct[i]['product_cd']] = this.allProduct[i]['product_desc']
      }
    }
  }
  allActivity = []
  activityHier = {};
  async getAllActivity() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.allEmpService.getPayComponent(JSON.stringify(obj));
    console.log(resp)
    this.allActivity = resp.data;
    for (let i = 0; i < this.allActivity.length; i++) {
      this.activityHier[this.allActivity[i]['code']] = this.allActivity[i]['activity_code']
    }
  }


  act_hier = [];
  acthier = {}
  async getacthier(b_acct_id) {
    let obj = Object()
    obj['b_acct_id'] = b_acct_id;
    obj['table_name'] = 'activity_hier';
    var resp = await this.getactHierarchy(obj)
    if (resp['error'] == false) {
      let data = resp['data']
      this.act_hier = []
      this.act_hier = data;
      this.acthier = {}
      for (let i = 0; i < this.act_hier.length; i++) {
        this.acthier[this.act_hier[i]['leaf_cd']] = this.act_hier[i]['leaf_value']
      }
      console.log(data)
    }
    else {

    }
  }

  projectHierObj = {}
  projectHierCostCenter = {}
  projecthier = []
  async getproject(b_acct_id) {
    let obj = new Object()
    obj['b_acct_id'] = b_acct_id
    obj['module_cd'] = 'HR'
    let resp = await this.getprojectHierarchy(obj)
    console.log(resp)
    for (let i = 0; i < resp.data.length; i++) {
      if (resp.data[i]['lvl1_value'] == "All Projects") {
        resp.data[i]['lvl1_value'] = 'HR-root'
      }
    }
    if (resp['error'] == false) {
      console.log(resp['data']);
      this.projecthier = resp['data'];
      this.projectHierObj = {}
      this.projectHierCostCenter = {}

      for (let i = 0; i < this.projecthier.length; i++) {
        if (this.projecthier[i]['leaf_node_type'] == 'HREMP') {
          this.projectHierObj[this.projecthier[i]['leaf_user_cd']] = this.projecthier[i]['leaf_cd']
          this.projectHierCostCenter[this.projecthier[i]['leaf_user_cd']] = this.projecthier[i]['lvl2_user_cd']
        }
      }
    } else {

    }

    console.log(this.projectHierObj)
  }
  async sendToAccountbill(element) {

    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;


    await this.getAllBudget();
    await this.getAllProduct();
    await this.getAllActivity();
    await this.getacthier(this.b_acct_id);
    await this.getproject(this.b_acct_id);

    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['bill_id'] = element['bill_id'];
    var resp = await this.payableService.getAllBill(JSON.stringify(obj));
    if (resp['error'] == false) {
      var dt = resp['data'];
      console.log(dt);
      var group_data = this.group_concat(dt, ['bill_desc', 'arr_id', 'emp_name', 'pay_component_code', 'pay_code'], ['pay_component_amt']);
      console.table(group_data);
      let event_code_data = [];
      for (let i = 0; i < group_data.length; i++) {
        event_code_data.push({
          act_value: this.acthier[this.activityHier[group_data[i]['pay_component_code']]], prod_value: this.productHier[this.allProduct[0]['product_cd']], proj_value: group_data[i]['emp_name'], bud_value: this.budgetHier[this.allBudget[0]['budget_cd']],
          act_cd: this.activityHier[group_data[i]['pay_component_code']], bud_cd: this.allBudget[0]['budget_cd'], prod_cd: this.allProduct[0]['product_cd'], proj_cd: this.projectHierObj['HRARR' + group_data[i]['arr_id']]
        })
      }

      console.log(event_code_data);
      let objdata = new Object();

      objdata['b_acct_id'] = this.b_acct_id;
      objdata['data'] = event_code_data
      console.log(objdata)
      let datae = await this.getMultipleEventForModule(objdata)
      console.log(datae);

      let event_group_data=[];
      for (let i = 0; i < group_data.length; i++) {
        let obj = new Object()
        console.log(group_data[i])


        obj['evt_grp_dt'] = new Date().toISOString().split("T")[0]
        obj['bus_event_type'] = 'SAL_BILL'
        obj['demand_id'] = element['bill_id']
        obj['party_id'] = group_data[i]['emp_id']
        obj['ev_ln_dist_bus_ev_cd'] = datae['data'][this.activityHier[group_data[i]['pay_component_code']] + this.allBudget[0]['budget_cd'] + this.allProduct[0]['product_cd'] + this.projectHierObj['HRARR' + group_data[i]['arr_id']]]['event_code']
        obj['event_code'] = datae['data'][this.activityHier[group_data[i]['pay_component_code']] + this.allBudget[0]['budget_cd'] + this.allProduct[0]['product_cd'] + this.projectHierObj['HRARR' + group_data[i]['arr_id']]]['event_code']
        obj['event_id'] = element['bill_id']
        obj['event_ln_id'] = element['bill_id']
        obj['bank_acct_num'] = null;
        // obj['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
        obj['event_desc'] = datae['data'][this.activityHier[group_data[i]['pay_component_code']] + this.allBudget[0]['budget_cd'] + this.allProduct[0]['product_cd'] + this.projectHierObj['HRARR' + group_data[i]['arr_id']]]['event_desc']
        obj['txn_amt'] = Number((group_data[i]['pay_component_amt']).toFixed(2))
        obj['invoice_id'] = element['bill_id']
        obj['create_user_id'] = this.erpUser['user_id']
        obj['arr_num'] = group_data[i]['arr_id']
        obj['ar_num_in_src'] = group_data[i]['arr_id']
        obj['ar_instr_cd'] = group_data[i]['arr_id']
        obj['cp_num_in_src'] = group_data[i]['arr_id']
        obj['cp_nm'] = group_data[i]['emp_name']
        obj['ev_grp_amt'] = Number((group_data[i]['pay_component_amt']).toFixed(2))
        obj['ev_grp_cts'] = dt[0]['accrual_date'].split("T")[0]
        obj['ev_grp_ets'] = new Date().toISOString().split("T")[0]
        obj['ev_grp_id'] = element['bill_id']
        obj['ev_grp_lcl_unq_num_in_src'] = element['bill_id']
        obj['ev_grp_src_cd'] = 'SAL_BILL'
        obj['ev_grp_tcd'] = 'SAL_BILL'
        obj['ev_ln_amt'] = Number((group_data[i]['pay_component_amt']).toFixed(2))
        obj['ev_ln_cmnt'] = 0
        obj['ev_ln_dist_aff_cc_cd'] = 0
        obj['ev_ln_dist_bdgt_cd'] = this.allBudget[0]['budget_cd']
        obj['ev_ln_dist_cc_cd'] = this.projectHierCostCenter['HRARR' + group_data[i]['arr_id']]//cost center
        obj['ev_ln_dist_pd_cd'] = this.allProduct[0]['product_cd']
        obj['ev_ln_dist_prj_cd'] = this.projectHierObj['HRARR' + group_data[i]['arr_id']]
        obj['ev_ln_num'] = element['bill_id']
        obj['ev_ln_org_cd'] = this.erpUser['account_short_name']
        obj['ev_ln_sku_desc'] = 0
        obj['ev_ln_sku_tcd'] = 0
        obj['ev_ln_bndl_qty'] = 0
        obj['ev_ln_calc_total_item_qty'] = 0
        obj['ev_ln_dist_amt'] = Number((group_data[i]['pay_component_amt']).toFixed(2))
        obj['ev_ln_dist_curr_cd'] = 'INR'
        obj['ev_ln_dist_num'] = 0
        obj['ev_ln_dist_rt'] = 0
        obj['ev_ln_dscnt_amt'] = 0
        obj['ev_ln_dscnt_rt'] = 0
        obj['ev_ln_eff_calc_item_rate'] = 0
        obj['ev_ln_item_per_pkt_qty'] = 0
        obj['ev_ln_item_rt'] = 0
        obj['ev_ln_manual_override_item_rt'] = 0
        obj['ev_ln_pkt_per_bndl_qty'] = 0
        obj['ev_ln_tax_incl_rt'] = 0
        obj['pmt_txn_id'] = 0
        obj['ev_ln_dist_id'] = 0
        obj['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
        obj['ev_ln_id'] = element['bill_id']
        obj['ev_ln_tcd'] = 'DOCUMENT LINE'
        obj['pmt_cp_ar_src_cd'] = 0
        obj['pmt_cp_ar_num_in_src'] = 0
        obj['pmt_cp_ar_instr_cd'] = 0
        obj['pmt_cp_num_in_src'] = 0
        obj['pmt_cp_ev_grp_id'] = 0
        obj['pmt_cp_ev_grp_src_cd'] = 0
        obj['pmt_cp_ev_grp_tcd'] = 0
        obj['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
        obj['pmt_cp_nm'] = 0
        obj['pmt_rp_bnk_acct_id'] = 0
        obj['pmt_cp_bnk_acct_id'] = 0
        obj['pmt_cp_txn_id'] = 0


        event_group_data.push(Object.assign({}, obj));

      }

      console.log(event_group_data)
      let eventgroupobj = new Object()

      let netPayable = Number(dt[0]['bill_amount'].toFixed(0))
      eventgroupobj['is_rec_or_pay'] = 'PAYABLE'
      eventgroupobj['local_doc_no'] = element['bill_id']
      eventgroupobj['local_doc_desc'] = element['bill_desc']
      eventgroupobj['module_cd'] = 'HR'
      eventgroupobj['module_doc_type'] = 'SAL_BILL'
      eventgroupobj['status'] = 'APPROVED';
      eventgroupobj['total_amt'] = netPayable
      eventgroupobj['doc_type'] = 'BILL'
      eventgroupobj['data'] = event_group_data
      eventgroupobj['create_user_id'] = this.erpUser['user_id']
      eventgroupobj['b_acct_id'] = this.erpUser['b_acct_id']
      eventgroupobj['req_data'] = JSON.stringify({bill_id : element['bill_id'],node_cd: element['node_cd']})
      console.log(eventgroupobj)
      let resp1 = await this.createevent(eventgroupobj)
      console.log(resp)
      if (resp1['error'] == false) {
        // this.spinner.hide();
       console.log("Send To Account Done....");
       await this.changeBillStatus(element['bill_id'], 'PAID')
        //this.toastr.successToastr("Approval Forwarded Successfully!!")
      } else {
        // this.spinner.hide();
       // swal.fire("Error", resp['data'], 'error');
      }
      
      // for (let i = 0; i < dt.length; i++) {
      //   var ob = new Object();
      //   ob['evt_grp_dt'] = dt[i]['accrual_date']
      //   ob['event_id'] = dt[i]['bill_id']
      //   ob['party_id'] = dt[i]['emp_id']
      //   ob['demand_id'] = dt[i]['bill_id']
      //   ob['event_ln_id'] = i + 1

      //   // if (this.empIdToBankAccountNumber[dt[i]['emp_id']] != null) {
      //   //   ob['bank_acct_num'] = this.empIdToBankAccountNumber[dt[i]['emp_id']];
      //   // } else {
      //   //   ob['bank_acct_num'] = '000000000000';
      //   // }
      //   ob['event_desc'] = dt[i]['pay_component_code']
      //   ob['create_user_id'] = this.erpUser.user_id;
      //   // ob['arr_num'] = this.salaryObj.employement_info[dt[i]['emp_id']]['id']
      //   ob['invoic_id'] = dt[i]['bill_id']
      //   ob['bus_event_type'] = 'SALBILL';



      //   if (dt[i]['pay_code'] == 'PAY') {
      //     ob['event_code'] = 'EMPSALPAY'
      //   } else {
      //     ob['event_code'] = 'HRSALIT'
      //   }

      //   if (dt[i]['pay_code'] == 'PAY') {
      //     ob['txn_amt'] = dt[i]['pay_component_amt']
      //     total_bill_amount = total_bill_amount + dt[i]['pay_component_amt']
      //   } else {
      //     ob['txn_amt'] = dt[i]['pay_component_amt'] * (-1);
      //     total_bill_amount = total_bill_amount - dt[i]['pay_component_amt']
      //   }

      //   event_data.push(ob)
      // }

      // var obj_2 = new Object();
      // obj_2['b_acct_id'] = this.erpUser.b_acct_id;
      // obj_2['local_doc_no'] = dt[0]['bill_id'];
      // obj_2['local_doc_desc'] = dt[0]['bill_desc'];
      // obj_2['is_rec_or_pay'] = 'PAYABLE';
      // obj_2['module_cd'] = 'HR';
      // obj_2['module_doc_type'] = 'SALBILL';
      // obj_2['status'] = 'APPROVED';
      // obj_2['total_amt'] = total_bill_amount;
      // obj_2['doc_type'] = 'BILL';
      // obj_2['req_data'] = '{}';
      // obj_2['create_user_id'] = this.erpUser.user_id;
      // obj_2['data'] = event_data;
      // console.log(obj_2);

      // var resp = await this.payableService.sendToAccount(obj_2);
      // console.log(resp);
      // if (resp['error'] == false) {
      //   await this.changeBillStatus(element['bill_id'], 'PAID')
      // } else {
      // }
    } else {
    }

  }

  async changeBillStatus(bill_id, bill_status_code) {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['update_user_id'] = this.erpUser.user_id;
    obj['bill_id'] = bill_id;
    obj['bill_status_code'] = bill_status_code;
    var resp = await this.payableService.changeStatusOfBill(obj);
    if (resp['error'] == false) {
      console.log('processed............');
    } else {
      console.log('Error', 'Error in Bill Generation', 'error');
    }
  }


  group_concat(data, group_key, concatKey) {

    let result = {}

    for (let i = 0; i < data.length; i++) {
      let key = ""
      let temp = {}
      for (let j = 0; j < group_key.length; j++) {
        key += "_" + data[i][group_key[j]]
        temp[group_key[j]] = data[i][group_key[j]]
      }

      if (result[key] == undefined) {
        result[key] = temp
        for (let j = 0; j < concatKey.length; j++) {
          result[key][concatKey[j]] = data[i][concatKey[j]]
        }

      } else {
        for (let j = 0; j < concatKey.length; j++) {
          result[key][concatKey[j]] += data[i][concatKey[j]]
          // result[key][concatKey[j]] += "+" + data[i][concatKey[j]]
        }
      }


    }
    var ret_data = Object.values(result);
    // for (let i = 0; i < ret_data.length; i++) {
    //   ret_data[i]['pay_component_amt'] = ret_data[i]['pay_component_amt'].toFixed(0)
    // }
    return ret_data
  }


  async getactHierarchy(obj) {
    const resp = this.http.post<any>(this.mainService.httpUrl + '/accounts/hierarchies/activity/getHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getMultipleEventForModule(obj) {
    const resp = await this.http.post<any>(this.mainService.httpUrl + '/account/event/getMultipleEventForModule', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async getprojectHierarchy(obj) {
    const resp = this.http.post<any>(this.mainService.httpUrl + '/accounts/hierarchies/project/getHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }

  async createevent(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/accounts/eventgroup/addEventGroup', obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
}
