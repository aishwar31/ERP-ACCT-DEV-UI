import { HttpClient, HttpEventType } from '@angular/common/http';

import { ApproveService } from '../../services/emb/service/approve.service';
import { CdPrintService } from '../../services/emb/common _services/cd-print.service';
import { EbillRunningBillPrintService } from '../../services/emb/common _services/ebill-running-bill-print.service';
import { EbillService } from '../../services/emb/service/ebill.service';
import { EmbPrintService } from '../../services/emb/common _services/emb-print.service';
import { EmbService } from '../../services/emb/service/emb.service'
import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import Swal from 'sweetalert2';
import { TenderService } from '../../services/emb/service/tender.service';

@Injectable({
  providedIn: 'root'
})
export class EbillPrintService {
  httpUrl;
  constructor(private CdPrintService: CdPrintService, private EmbPrintService: EmbPrintService, private embService: EmbService, private tenderService: TenderService, private ebillService: EbillService, private ApproveService: ApproveService, private http: HttpClient, private main: MainService, private EbillRunningBillPrintService: EbillRunningBillPrintService) {
    this.httpUrl = this.main.httpUrl
  }
  async printEbill(element, ebillUser) {
    let obj = {}
    obj['id'] = element['doc_local_no']
    obj['b_acct_id'] = ebillUser.b_acct_id;
    obj['work_id'] = element['node_cd'];
    var ebill = await this.ebillService.getBill(JSON.stringify(obj))
    var selectedTender = await this.tenderService.getBoq(JSON.stringify(obj));
    console.log(ebill, selectedTender)
    await this.EbillRunningBillPrintService.print_running_bill(ebill['data'][0], selectedTender['data'][0], 0)
    await this.EbillRunningBillPrintService.print_cb(ebill['data'][0], selectedTender['data'][0])
  }
  async getMultipleEventForModule(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/account/event/getMultipleEventForModule', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getactHierarchy(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/activity/getHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getBudgetHierarchy(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/budget/getHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getproductHierarchy(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/product/getHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  async getprojectHierarchy(obj) {
    const resp = this.http.post<any>(this.main.httpUrl + '/accounts/hierarchies/project/getHierarchy', obj).toPromise().then(res => {
      return res
    });
    return resp
  }
  act_hier = []
  async getacthier(b_acct_id) {
    let obj = Object()
    obj['b_acct_id'] = b_acct_id;
    obj['table_name'] = 'activity_hier';
    // this.spinner.show();
    var resp = await this.getactHierarchy(obj)
    if (resp['error'] == false) {
      //  this.spinner.hide();
      let data = resp['data']
      this.act_hier = []
      this.act_hier = data
      console.log(data)
    }
    else {
      // this.spinner.hide();
      // this.toastr.errorToastr(resp['data']);
    }
  }
  budhier = []
  async getbudhier(b_acct_id) {
    let obj = Object()
    obj['b_acct_id'] = b_acct_id;
    obj['table_name'] = 'bud_hier';
    //this.spinner.show();
    var resp = await this.getBudgetHierarchy(obj)
    if (resp['error'] == false) {
      //this.spinner.hide();
      let data = resp['data']
      this.budhier = []
      this.budhier = data
      console.log(data)
    }
    else {
      //this.spinner.hide();

    }

  }
  prodhier = []
  async getprodhier(b_acct_id) {
    let obj = Object()
    obj['b_acct_id'] = b_acct_id;
    obj['table_name'] = 'prod_hier';
    ////this.spinner.show();
    var resp = await this.getproductHierarchy(obj)
    if (resp['error'] == false) {
      // this.spinner.hide();
      let data = resp['data']
      this.prodhier = []
      this.prodhier = data
      console.log(data)
    }
    else {
      //this.spinner.hide();
      // this.toastr.errorToastr(resp['data']);
    }
  }
  projecthier = []
  async getproject(b_acct_id) {
    let obj = new Object()
    obj['b_acct_id'] = b_acct_id
    obj['module_cd'] = 'EMB'
    let resp = await this.getprojectHierarchy(obj)
    console.log(resp)
    for (let i = 0; i < resp.data.length; i++) {
      if (resp.data[i]['lvl1_value'] == "All Projects") {
        resp.data[i]['lvl1_value'] = 'EMB-root'
      }
    }
    if (resp['error'] == false) {
      // this.allcostcenters = []
      console.log(resp['data']);

      this.projecthier = resp['data']
      /*  for (let i = 0; i < resp['data'].length; i++) {
         for (let j = 1; j < 8; j++) {
         this.projhierobj[resp['data'][i]['lvl'+(j)+'_user_cd']] = resp['data'][i]['lvl'+(j)+'_value']
         this.projhierobjtype[resp['data'][i]['lvl'+(j)+'_user_cd']] = resp['data'][i]['lvl'+(j)+'_node_type']
         this.projhierobjtypecd[resp['data'][i]['lvl'+(j)+'_user_cd']] = resp['data'][i]['lvl'+(j)+'_cd']
           
         } */
      /*  if(resp['data'][i]['cc_func']=="EMB")
       {
         let obb = Object.assign({},resp['data'][i])
         obb['node_cd'] = obb['cc_code']
         obb['desc'] = obb['cc_code'] +'-'+obb['cc_name']
         obb['node_desc'] = obb['desc']
         this.allcostcenters.push(obb)
         
       } */

      // } 
      // this.allcostcenters = [...resp['data']]
      // console.log(this.allcostcenters)
      // this.planing_arr[1] = {existing_heirarchy_nodes:[...this.allcostcenters]} 
      /*  console.log(this.planing_arr);
       this.dataSource = new MatTableDataSource(resp['data'])
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
        */

    } else {
      // this.spinner.hide()
      Swal.fire('Error...', 'Error While Getting Cost Center', 'error')
    }
  }
  eventgroupdata = []
  processflag = false
  async processebill(element, ebillUser) {
    this.processflag = false
    let obj = {}
    await this.getproject(ebillUser.b_acct_id)
    await this.getacthier(ebillUser.b_acct_id)
    await this.getbudhier(ebillUser.b_acct_id)
    await this.getprodhier(ebillUser.b_acct_id)
    let ded = await this.EbillRunningBillPrintService.getDeductionsacc(ebillUser['b_acct_id'], element['doc_local_no'])
    obj['id'] = element['doc_local_no']
    obj['b_acct_id'] = ebillUser.b_acct_id;
    obj['work_id'] = element['node_cd'];
    var ebill = await this.ebillService.getBill(JSON.stringify(obj))
    var selectedTender = await this.tenderService.getBoq(JSON.stringify(obj));
    console.log(ebill, selectedTender)
    let runningbill = await this.EbillRunningBillPrintService.prcessebilltoaccount(ebill['data'][0], selectedTender['data'][0], 0)
    let party = await this.EbillRunningBillPrintService.getAllpartyacc(ebillUser['b_acct_id'])
    let tender = selectedTender['data'][0]
    console.log(tender)
    let hier = {}
    for (let i = 0; i < this.projecthier.length; i++) {
      if (this.projecthier[i]['leaf_cd'] == tender['project_cd']) {
        hier = this.projecthier[i]
      }

    }
    let budhierc = {}
    for (let i = 0; i < this.budhier.length; i++) {
      // if(this.budhier[i]['leaf_cd'] == tender['project_cd']){
      budhierc[this.budhier[i]['leaf_cd']] = this.budhier[i]['leaf_value']
      // }

    }
    let acthier = {}
    for (let i = 0; i < this.act_hier.length; i++) {
      //  if(this.act_hier[i]['leaf_cd'] == tender['budget_cd']){
      acthier[this.act_hier[i]['leaf_cd']] = this.act_hier[i]['leaf_value']

      //  }

    }
    let produhier = {}
    for (let i = 0; i < this.prodhier.length; i++) {
      // if(this.projecthier[i]['leaf_cd'] == tender['project_cd']){
      produhier[this.prodhier[i]['leaf_cd']] = this.prodhier[i]['leaf_value']

      // }

    }
    let dataarr = []
    let objdata = {}
    objdata['b_acct_id'] = ebillUser.b_acct_id
    let dedtech = await this.EbillRunningBillPrintService.getAllDedacc(ebillUser['b_acct_id'])
    let dedarr = dedtech['dedarr']
    console.log(tender);
    console.log(ded, dedarr);
    //   console.log(ded.map(function(e){return e.deduction_id}));

    //  for(let i=0;i<dedarr.length;i++)
    //  {
    //   if(dedarr[i]['ded_owner']=="USER" && ded.map(function(e){return e.deduction_id}).includes(parseInt(dedarr[i]['deduction_id'])) ){
    //     console.log(dedarr[i]['ded_bus_name']);

    //   }
    //  }

    for (let i = 0; i < dedarr.length; i++) {

      // ..............................................................................................................................................................
      if (acthier[dedarr[i]['act_cd']] == null || dedarr[i]['act_cd'] == null || acthier[dedarr[i]['act_cd']] == "" || dedarr[i]['act_cd'] == "") {
        this.processflag = true
        Swal.fire('Error...', 'Can not Find Activity Hier of Code ' + acthier[dedarr[i]['act_cd']] + ' in  Deduction ' + dedarr[i]['ded_bus_name'], 'error')
        return;
      }
      else if (produhier[tender['product_cd']] == null || produhier[tender['product_cd']] == "") {
        this.processflag = true

        Swal.fire('Error...', 'Can not Find Product Hier of Code ' + produhier[tender['product_cd']] + ' in Work ' + tender['work_order_name'], 'error')
        return;
      }
      else if (budhierc[dedarr[i]['budget_cd']] == null || dedarr[i]['budget_cd'] == null || budhierc[dedarr[i]['budget_cd']] == "" || dedarr[i]['budget_cd'] == "") {
        this.processflag = true
        Swal.fire('Error...', 'Can not Find Budget Hier of Code ' + budhierc[dedarr[i]['budget_cd']] + ' in Deduction ' + dedarr[i]['ded_bus_name'], 'error')

        return;

      }
      else if (tender['project_cd'] == null || tender['project_cd'] == "") {
        this.processflag = true
        Swal.fire('Error...', 'Can not Find Project Hier of Code ' + tender['project_cd'] + ' in Work ' + tender['work_order_name'], 'error')
        return;

      }

      // .............................................................................................................................................................
      if (dedarr[i]['ded_owner'] == "USER" && ded.map(function (e) { return e.deduction_id }).includes(parseInt(dedarr[i]['deduction_id']))) {
        console.log(dedarr[i]['ded_bus_name']);

        dataarr.push({ act_value: acthier[dedarr[i]['act_cd']], prod_value: produhier[tender['product_cd']], proj_value: dedarr[i]['ded_bus_name'], bud_value: budhierc[dedarr[i]['budget_cd']], act_cd: dedarr[i]['act_cd'], bud_cd: dedarr[i]['budget_cd'], prod_cd: tender['product_cd'], proj_cd: tender['project_cd'] })
      }
      else {
        dataarr.push({ act_value: acthier[dedarr[i]['act_cd']], prod_value: produhier[tender['product_cd']], proj_value: dedarr[i]['ded_bus_name'], bud_value: budhierc[dedarr[i]['budget_cd']], act_cd: dedarr[i]['act_cd'], bud_cd: dedarr[i]['budget_cd'], prod_cd: tender['product_cd'], proj_cd: tender['project_cd'] })

      }




    }

    if (acthier[tender['activity_cd']] == null || tender['activity_cd'] == null || acthier[tender['activity_cd']] == "" || tender['activity_cd'] == "") {
      this.processflag = true
      Swal.fire('Error...', 'Can not Find Activity Hier of Code ' + acthier[tender['activity_cd']] + ' in Work ' + tender['work_order_name'], 'error')
      return;
    }
    else if (produhier[tender['product_cd']] == null || tender['product_cd'] == null || produhier[tender['product_cd']] == "" || tender['product_cd'] == null) {
      this.processflag = true
      Swal.fire('Error...', 'Can not Find Product Hier of Code ' + produhier[tender['product_cd']] + ' in Work ' + tender['work_order_name'], 'error')
      return;
    }
    else if (budhierc[tender['budget_cd']] == null || tender['budget_cd'] == null || budhierc[tender['budget_cd']] == "" || tender['budget_cd'] == "") {
      this.processflag = true
      Swal.fire('Error...', 'Can not Find Budget Hier of Code ' + budhierc[tender['budget_cd']] + ' in Work ' + tender['work_order_name'], 'error')
      return;

    }
    else if (tender['project_cd'] == null || tender['project_cd'] == "") {
      this.processflag = true
      Swal.fire('Error...', 'Can not Find Project Hier of Code ' + tender['project_cd'] + ' in Work ' + tender['work_order_name'], 'error')
      return;

    }


    dataarr.push({ act_value: acthier[tender['activity_cd']], prod_value: produhier[tender['product_cd']], proj_value: tender['work_order_name'], bud_value: budhierc[tender['budget_cd']], act_cd: tender['activity_cd'], bud_cd: tender['budget_cd'], prod_cd: tender['product_cd'], proj_cd: tender['project_cd'] })
    objdata['data'] = dataarr
    console.log(objdata)
    let datae = await this.getMultipleEventForModule(objdata)
    console.log(datae)
    let eventcode = datae['data']
    //return
    let data = []
    let amt_before_overunder = 0
    /* for (let i = 0; i < runningbill.length; i++) {
      if(runningbill[i]['currbillamt'] == 0) continue;
      let obj = new Object()
      obj['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      obj['bus_event_type'] = 'EBILL'
      obj['demand_id'] = element['doc_local_no']
      obj['party_id'] = selectedTender['data'][0]['party_id']
      obj['event_code'] = selectedTender['data'][0]['event_code']
      obj['event_id'] = element['doc_local_no']
      obj['event_ln_id'] = runningbill[i]['sno']
      obj['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      obj['event_desc'] = runningbill[i]['item_desc']
      obj['txn_amt'] = Number((runningbill[i]['currbillamt']).toFixed(2))
      obj['invoice_id'] = element['doc_local_no']
      obj['create_user_id'] = ebillUser['user_id']
      obj['arr_num'] = selectedTender['data'][0]['agr_no']
  
      
  obj['ar_num_in_src']=selectedTender['data'][0]['agr_no']  
  obj['ar_instr_cd']=selectedTender['data'][0]['work_id']
  obj['cp_num_in_src']=selectedTender['data'][0]['work_id']
  obj['cp_nm']= party[selectedTender['data'][0]['party_id']]['party_leagal_name']
  obj['ev_grp_amt']=Number((runningbill[i]['currbillamt']).toFixed(2))
  obj['ev_grp_cts']=ebill['data'][0]['create_timestamp'].split("T")[0]
  obj['ev_grp_ets']= new Date().toISOString().split("T")[0]
  obj['ev_grp_id']=element['doc_local_no']
  obj['ev_grp_lcl_unq_num_in_src']=runningbill[i]['sno']
  obj['ev_grp_src_cd']='EBILL'
  obj['ev_grp_tcd']='EBILL'
  obj['ev_ln_amt']=Number((runningbill[i]['currbillamt']).toFixed(2))
  obj['ev_ln_cmnt']=0
  obj['ev_ln_dist_aff_cc_cd']=0
  obj['ev_ln_dist_bdgt_cd']=tender['budget_cd']
  if(eventcode[tender['activity_cd']+tender['budget_cd']+tender['product_cd']+tender['project_cd']] != undefined) obj['ev_ln_dist_bus_ev_cd']=eventcode[tender['activity_cd']+tender['budget_cd']+tender['product_cd']+tender['project_cd']]['event_code']
  else {
    Swal.fire('Error...', 'Can not Find Event Code in '+tender['activity_cd']+','+tender['budget_cd']+','+tender['product_cd']+','+tender['project_cd']+' this Combination', 'error')
    this.processflag = true
    return 'error';
  }
  obj['ev_ln_dist_cc_cd']=hier['lvl1_user_cd']
  obj['ev_ln_dist_pd_cd']=tender['product_cd']
  obj['ev_ln_dist_prj_cd']=tender['project_cd']
  obj['ev_ln_num']=runningbill[i]['sno']
  obj['ev_ln_org_cd']=ebillUser['account_short_name']
  obj['ev_ln_sku_desc']=0
  obj['ev_ln_sku_tcd']=0
  obj['ev_ln_bndl_qty']=0
  obj['ev_ln_calc_total_item_qty']=0
  obj['ev_ln_dist_amt']=Number((runningbill[i]['currbillamt']).toFixed(2))
  obj['ev_ln_dist_curr_cd']=0
  obj['ev_ln_dist_num']=0
  obj['ev_ln_dist_rt']=0
  obj['ev_ln_dscnt_amt']=Number((runningbill[i]['currbillamt']).toFixed(2))
  obj['ev_ln_dscnt_rt']=0
  obj['ev_ln_eff_calc_item_rate']=0
  obj['ev_ln_item_per_pkt_qty']=0
  obj['ev_ln_item_rt']=0
  obj['ev_ln_manual_override_item_rt']=0
  obj['ev_ln_pkt_per_bndl_qty']=0
  obj['ev_ln_tax_incl_rt']=0
  obj['pmt_txn_id']=0
  obj['ev_ln_dist_id']=0
  obj['ev_ln_dist_tcd']=0
  obj['ev_ln_id']=runningbill[i]['sno']
  obj['ev_ln_tcd']='RESOURCE'
  obj['pmt_cp_ar_src_cd']=0
  obj['pmt_cp_ar_num_in_src']=0
  obj['pmt_cp_ar_instr_cd']=0
  obj['pmt_cp_num_in_src']=0
  obj['pmt_cp_ev_grp_id']=0
  obj['pmt_cp_ev_grp_src_cd']=0
  obj['pmt_cp_ev_grp_tcd']=0
  obj['pmt_cp_ev_grp_lcl_unq_num_in_src']=0
  obj['pmt_cp_nm']=0
  obj['pmt_rp_bnk_acct_id']=0
  obj['pmt_cp_bnk_acct_id']=0
  obj['pmt_cp_txn_id']=0
  
      amt_before_overunder = amt_before_overunder + Number((runningbill[i]['currbillamt']).toFixed(2))
      data.push(Object.assign({},obj))
    } */
    // let ded = await this.EbillRunningBillPrintService.getDeductionsacc(ebillUser['b_acct_id'],element['doc_local_no'])

    let dedobj = dedtech['ded']
    let deddusname = dedtech['dedbusname']
    console.log(dedobj)
    console.log(deddusname)
    let ttl = 0

    for (let i = 0; i < ded.length; i++) {
      let obj = new Object()
      console.log(ded[i])
      if (ded[i]['deduction_id'] == -1) {
        continue
      }
      if (dedobj[ded[i]['deduction_id']] == undefined) {
        Swal.fire('Error...', 'Please Create  Deduction', 'error')
        this.processflag = true
        return
      }
      obj['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      obj['bus_event_type'] = 'EBILL'
      obj['demand_id'] = ded[i]['deduction_id']
      obj['party_id'] = selectedTender['data'][0]['party_id']
      obj['event_code'] = dedobj[ded[i]['deduction_id']]['event_code']
      obj['event_id'] = element['doc_local_no']
      obj['event_ln_id'] = ded[i]['deduction_id']
      obj['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      obj['event_desc'] = dedobj[ded[i]['deduction_id']]['ded_name']
      obj['txn_amt'] = - Number((ded[i]['amt']).toFixed(2))
      obj['invoice_id'] = ded[i]['deduction_id']
      obj['create_user_id'] = ebillUser['user_id']
      obj['arr_num'] = selectedTender['data'][0]['agr_no']
      obj['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      obj['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      obj['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      obj['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      obj['ev_grp_amt'] = Number((ded[i]['amt']).toFixed(2))
      obj['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      obj['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      obj['ev_grp_id'] = element['doc_local_no']
      obj['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      obj['ev_grp_src_cd'] = 'EBILL'
      obj['ev_grp_tcd'] = 'EBILL'
      obj['ev_ln_amt'] = Number((ded[i]['amt']).toFixed(2))
      obj['ev_ln_cmnt'] = 0
      obj['ev_ln_dist_aff_cc_cd'] = 0
      obj['ev_ln_dist_bdgt_cd'] = dedobj[ded[i]['deduction_id']]['budget_cd']
      if (eventcode[dedobj[ded[i]['deduction_id']]['act_cd'] + dedobj[ded[i]['deduction_id']]['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) obj['ev_ln_dist_bus_ev_cd'] = eventcode[dedobj[ded[i]['deduction_id']]['act_cd'] + dedobj[ded[i]['deduction_id']]['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + dedobj[ded[i]['deduction_id']]['act_cd'] + ',' + dedobj[ded[i]['deduction_id']]['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return;
      }
      obj['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      obj['ev_ln_dist_pd_cd'] = tender['product_cd']
      obj['ev_ln_dist_prj_cd'] = tender['project_cd']
      obj['ev_ln_num'] = ded[i]['deduction_id']
      obj['ev_ln_org_cd'] = ebillUser['account_short_name']
      obj['ev_ln_sku_desc'] = 0
      obj['ev_ln_sku_tcd'] = 0
      obj['ev_ln_bndl_qty'] = 0
      obj['ev_ln_calc_total_item_qty'] = 0
      obj['ev_ln_dist_amt'] = Number((ded[i]['amt']).toFixed(2))
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
      obj['ev_ln_id'] = ded[i]['deduction_id']
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


      data.push(Object.assign({}, obj))
      ttl = ttl + Number((ded[i]['amt']).toFixed(2))
    }
    let overunder_amt = Number(ebill['data'][0].bill_amt.toFixed(0)) + Number(ebill['data'][0].per_withheld.toFixed(0)) + Number(ebill['data'][0].temp_withheld.toFixed(0)) - Number(ebill['data'][0].rel_temp_withheld.toFixed(0))
    if (Number((overunder_amt).toFixed(0)) > 0) {
      let objgst = new Object()
      objgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objgst['bus_event_type'] = 'EBILL'
      objgst['demand_id'] = element['doc_local_no']
      objgst['party_id'] = selectedTender['data'][0]['party_id']
      objgst['event_code'] = selectedTender['data'][0]['event_code']
      objgst['event_id'] = element['doc_local_no']
      objgst['event_ln_id'] = element['doc_local_no']
      objgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objgst['event_desc'] = 'over under'
      objgst['txn_amt'] = Number((overunder_amt - amt_before_overunder).toFixed(0))
      objgst['invoice_id'] = element['doc_local_no']
      objgst['create_user_id'] = ebillUser['user_id']
      objgst['arr_num'] = selectedTender['data'][0]['agr_no']


      objgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objgst['ev_grp_amt'] = Number((overunder_amt).toFixed(0))
      objgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objgst['ev_grp_id'] = element['doc_local_no']
      objgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objgst['ev_grp_src_cd'] = 'EBILL'
      objgst['ev_grp_tcd'] = 'EBILL'
      objgst['ev_ln_amt'] = Number((overunder_amt).toFixed(0))
      objgst['ev_ln_cmnt'] = 0
      objgst['ev_ln_dist_aff_cc_cd'] = 0
      objgst['ev_ln_dist_bdgt_cd'] = tender['budget_cd']
      if (eventcode[tender['activity_cd'] + tender['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objgst['ev_ln_dist_bus_ev_cd'] = eventcode[tender['activity_cd'] + tender['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + tender['activity_cd'] + ',' + tender['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true

        return
      }
      objgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objgst['ev_ln_num'] = element['doc_local_no']
      objgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objgst['ev_ln_sku_desc'] = 0
      objgst['ev_ln_sku_tcd'] = 0
      objgst['ev_ln_bndl_qty'] = 0
      objgst['ev_ln_calc_total_item_qty'] = 0
      objgst['ev_ln_dist_amt'] = Number((overunder_amt).toFixed(0))
      objgst['ev_ln_dist_curr_cd'] = 'INR'
      objgst['ev_ln_dist_num'] = 0
      objgst['ev_ln_dist_rt'] = 0
      objgst['ev_ln_dscnt_amt'] = 0
      objgst['ev_ln_dscnt_rt'] = 0
      objgst['ev_ln_eff_calc_item_rate'] = 0
      objgst['ev_ln_item_per_pkt_qty'] = 0
      objgst['ev_ln_item_rt'] = 0
      objgst['ev_ln_manual_override_item_rt'] = 0
      objgst['ev_ln_pkt_per_bndl_qty'] = 0
      objgst['ev_ln_tax_incl_rt'] = 0
      objgst['pmt_txn_id'] = 0
      objgst['ev_ln_dist_id'] = 0
      objgst['ev_ln_dist_tcd'] = 'RESOURCE LINE'
      objgst['ev_ln_id'] = element['doc_local_no']
      objgst['ev_ln_tcd'] = 'RESOURCE LINE'
      objgst['pmt_cp_ar_src_cd'] = 0
      objgst['pmt_cp_ar_num_in_src'] = 0
      objgst['pmt_cp_ar_instr_cd'] = 0
      objgst['pmt_cp_num_in_src'] = 0
      objgst['pmt_cp_ev_grp_id'] = 0
      objgst['pmt_cp_ev_grp_src_cd'] = 0
      objgst['pmt_cp_ev_grp_tcd'] = 0
      objgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objgst['pmt_cp_nm'] = 0
      objgst['pmt_rp_bnk_acct_id'] = 0
      objgst['pmt_cp_bnk_acct_id'] = 0
      objgst['pmt_cp_txn_id'] = 0


      data.push(Object.assign({}, objgst))
    }
    if (ebill['data'][0].cgst > 0) {
      if (deddusname['cgst'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objgst = new Object()
      objgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objgst['bus_event_type'] = 'EBILL'
      objgst['demand_id'] = element['doc_local_no']
      objgst['party_id'] = selectedTender['data'][0]['party_id']
      objgst['event_code'] = 'CGSTINPUT'
      objgst['event_id'] = element['doc_local_no']
      objgst['event_ln_id'] = element['doc_local_no']
      objgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objgst['event_desc'] = 'CGST Input'
      objgst['txn_amt'] = Number((ebill['data'][0].cgst).toFixed(2))
      objgst['invoice_id'] = element['doc_local_no']
      objgst['create_user_id'] = ebillUser['user_id']
      objgst['arr_num'] = selectedTender['data'][0]['agr_no']
      objgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objgst['ev_grp_amt'] = Number((ebill['data'][0].cgst).toFixed(2))
      objgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objgst['ev_grp_id'] = element['doc_local_no']
      objgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objgst['ev_grp_src_cd'] = 'EBILL'
      objgst['ev_grp_tcd'] = 'EBILL'
      objgst['ev_ln_amt'] = Number((ebill['data'][0].cgst).toFixed(2))
      objgst['ev_ln_cmnt'] = 0
      objgst['ev_ln_dist_aff_cc_cd'] = 0
      objgst['ev_ln_dist_bdgt_cd'] = deddusname['cgst']['budget_cd']
      if (eventcode[deddusname['cgst']['act_cd'] + deddusname['cgst']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['cgst']['act_cd'] + deddusname['cgst']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['cgst']['act_cd'] + ',' + deddusname['cgst']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objgst['ev_ln_num'] = 0
      objgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objgst['ev_ln_sku_desc'] = 0
      objgst['ev_ln_sku_tcd'] = 0
      objgst['ev_ln_bndl_qty'] = 0
      objgst['ev_ln_calc_total_item_qty'] = 0
      objgst['ev_ln_dist_amt'] = Number((ebill['data'][0].cgst).toFixed(2))
      objgst['ev_ln_dist_curr_cd'] = 'INR'
      objgst['ev_ln_dist_num'] = 0
      objgst['ev_ln_dist_rt'] = 0
      objgst['ev_ln_dscnt_amt'] = 0 //Number((ebill['data'][0].cgst).toFixed(2))
      objgst['ev_ln_dscnt_rt'] = 0
      objgst['ev_ln_eff_calc_item_rate'] = 0
      objgst['ev_ln_item_per_pkt_qty'] = 0
      objgst['ev_ln_item_rt'] = 0
      objgst['ev_ln_manual_override_item_rt'] = 0
      objgst['ev_ln_pkt_per_bndl_qty'] = 0
      objgst['ev_ln_tax_incl_rt'] = 0
      objgst['pmt_txn_id'] = 0
      objgst['ev_ln_dist_id'] = 0
      objgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objgst['ev_ln_id'] = 0
      objgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objgst['pmt_cp_ar_src_cd'] = 0
      objgst['pmt_cp_ar_num_in_src'] = 0
      objgst['pmt_cp_ar_instr_cd'] = 0
      objgst['pmt_cp_num_in_src'] = 0
      objgst['pmt_cp_ev_grp_id'] = 0
      objgst['pmt_cp_ev_grp_src_cd'] = 0
      objgst['pmt_cp_ev_grp_tcd'] = 0
      objgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objgst['pmt_cp_nm'] = 0
      objgst['pmt_rp_bnk_acct_id'] = 0
      objgst['pmt_cp_bnk_acct_id'] = 0
      objgst['pmt_cp_txn_id'] = 0
      data.push(Object.assign({}, objgst))
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'SGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'SGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].sgst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].sgst).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].sgst).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['sgst']['budget_cd']
      if (eventcode[deddusname['sgst']['act_cd'] + deddusname['sgst']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['sgst']['act_cd'] + deddusname['sgst']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['sgst']['act_cd'] + ',' + deddusname['sgst']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].sgst).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = 0
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0
      data.push(Object.assign({}, objsgst))
    } else if (ebill['data'][0]['igst'] > 0) {
      if (deddusname['igst'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']


      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['igst']['budget_cd']
      if (eventcode[deddusname['igst']['act_cd'] + deddusname['igst']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['igst']['act_cd'] + deddusname['igst']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['igst']['act_cd'] + ',' + deddusname['igst']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = 0
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0
      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['withheldamount'] > 0) {
      if (deddusname['withheldamount'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].withheldamount).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].withheldamount).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['withheldamount']['budget_cd']
      if (eventcode[deddusname['withheldamount']['act_cd'] + deddusname['withheldamount']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['withheldamount']['act_cd'] + deddusname['withheldamount']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['withheldamount']['act_cd'] + ',' + deddusname['withheldamount']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].withheldamount).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = 0
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0
      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['add_security'] > 0) {
      if (deddusname['add_security'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']


      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].add_security).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].add_security).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['add_security']['budget_cd']
      if (eventcode[deddusname['add_security']['act_cd'] + deddusname['add_security']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['add_security']['act_cd'] + deddusname['add_security']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['add_security']['act_cd'] + ',' + deddusname['add_security']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].add_security).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = 0
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0

      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['add_with_held'] > 0) {
      if (deddusname['add_with_held'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']


      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].add_with_held).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].add_with_held).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['add_with_held']['budget_cd']
      if (eventcode[deddusname['add_with_held']['act_cd'] + deddusname['add_with_held']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['add_with_held']['act_cd'] + deddusname['add_with_held']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['add_with_held']['act_cd'] + ',' + deddusname['add_with_held']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].add_with_held).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = 0
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0
      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['rel_temp_withheld'] > 0) {
      if (deddusname['temp_withheld'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].rel_temp_withheld).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].rel_temp_withheld).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['rel_temp_withheld']['budget_cd']
      if (eventcode[deddusname['rel_temp_withheld']['act_cd'] + deddusname['rel_temp_withheld']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['rel_temp_withheld']['act_cd'] + deddusname['rel_temp_withheld']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['rel_temp_withheld']['act_cd'] + ',' + deddusname['rel_temp_withheld']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].rel_temp_withheld).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = 0
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0

      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['per_withheld'] > 0) {
      if (deddusname['temp_withheld'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].per_withheld).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].per_withheld).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['per_withheld']['budget_cd']
      if (eventcode[deddusname['per_withheld']['act_cd'] + deddusname['per_withheld']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['per_withheld']['act_cd'] + deddusname['per_withheld']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['per_withheld']['act_cd'] + ',' + deddusname['per_withheld']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].per_withheld).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = 0
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0

      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['temp_withheld'] > 0) {
      if (deddusname['temp_withheld'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }

      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']


      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].temp_withheld).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].temp_withheld).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['temp_withheld']['budget_cd']
      if (eventcode[deddusname['temp_withheld']['act_cd'] + deddusname['temp_withheld']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['temp_withheld']['act_cd'] + deddusname['temp_withheld']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['temp_withheld']['act_cd'] + ',' + deddusname['temp_withheld']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].temp_withheld).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = deddusname['temp_withheld']['deduction_id']
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0

      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['labuor_cess'] > 0) {
      if (deddusname['labuor_cess'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction Labour Cess', 'error')
        this.processflag = true
        return
      }

      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].labuor_cess).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].labuor_cess).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['labuor_cess']['budget_cd']
      if (eventcode[deddusname['labuor_cess']['act_cd'] + deddusname['labuor_cess']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['labuor_cess']['act_cd'] + deddusname['labuor_cess']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['labuor_cess']['act_cd'] + ',' + deddusname['labuor_cess']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].labuor_cess).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = deddusname['labuor_cess']['deduction_id']
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0

      data.push(Object.assign({}, objsgst))
    }
    if (ebill['data'][0]['labuor_cess'] > 0) {
      if (deddusname['labuor_cess_deduct'] == undefined) {
        Swal.fire('Error...', 'Please Create System Deduction', 'error')
        this.processflag = true
        return
      }
      let objsgst = new Object()
      objsgst['evt_grp_dt'] = new Date().toISOString().split("T")[0]
      objsgst['bus_event_type'] = 'EBILL'
      objsgst['demand_id'] = element['doc_local_no']
      objsgst['party_id'] = selectedTender['data'][0]['party_id']
      objsgst['event_code'] = 'IGSTINPUT'
      objsgst['event_id'] = element['doc_local_no']
      objsgst['event_ln_id'] = element['doc_local_no']
      objsgst['bank_acct_num'] = party[selectedTender['data'][0]['party_id']]['party_acct_no']
      objsgst['event_desc'] = 'IGST Input'
      objsgst['txn_amt'] = Number((ebill['data'][0].igst).toFixed(2))
      objsgst['invoice_id'] = element['doc_local_no']
      objsgst['create_user_id'] = ebillUser['user_id']
      objsgst['arr_num'] = selectedTender['data'][0]['agr_no']


      objsgst['ar_num_in_src'] = selectedTender['data'][0]['agr_no']
      objsgst['ar_instr_cd'] = selectedTender['data'][0]['work_id']
      objsgst['cp_num_in_src'] = selectedTender['data'][0]['work_id']
      objsgst['cp_nm'] = party[selectedTender['data'][0]['party_id']]['party_leagal_name']
      objsgst['ev_grp_amt'] = Number((ebill['data'][0].labuor_cess).toFixed(2))
      objsgst['ev_grp_cts'] = ebill['data'][0]['create_timestamp'].split("T")[0]
      objsgst['ev_grp_ets'] = new Date().toISOString().split("T")[0]
      objsgst['ev_grp_id'] = element['doc_local_no']
      objsgst['ev_grp_lcl_unq_num_in_src'] = element['doc_local_no']
      objsgst['ev_grp_src_cd'] = 'EBILL'
      objsgst['ev_grp_tcd'] = 'EBILL'
      objsgst['ev_ln_amt'] = Number((ebill['data'][0].labuor_cess).toFixed(2))
      objsgst['ev_ln_cmnt'] = 0
      objsgst['ev_ln_dist_aff_cc_cd'] = 0
      objsgst['ev_ln_dist_bdgt_cd'] = deddusname['labuor_cess_deduct']['budget_cd']
      if (eventcode[deddusname['labuor_cess_deduct']['act_cd'] + deddusname['labuor_cess_deduct']['budget_cd'] + tender['product_cd'] + tender['project_cd']] != undefined) objsgst['ev_ln_dist_bus_ev_cd'] = eventcode[deddusname['labuor_cess_deduct']['act_cd'] + deddusname['labuor_cess_deduct']['budget_cd'] + tender['product_cd'] + tender['project_cd']]['event_code']
      else {
        Swal.fire('Error...', 'Can not Find Event Code in ' + deddusname['labuor_cess_deduct']['act_cd'] + ',' + deddusname['labuor_cess_deduct']['budget_cd'] + ',' + tender['product_cd'] + ',' + tender['project_cd'] + ' this Combination', 'error')
        this.processflag = true
        return
      }
      objsgst['ev_ln_dist_cc_cd'] = hier['lvl2_user_cd']
      objsgst['ev_ln_dist_pd_cd'] = tender['product_cd']
      objsgst['ev_ln_dist_prj_cd'] = tender['project_cd']
      objsgst['ev_ln_num'] = 0
      objsgst['ev_ln_org_cd'] = ebillUser['account_short_name']
      objsgst['ev_ln_sku_desc'] = 0
      objsgst['ev_ln_sku_tcd'] = 0
      objsgst['ev_ln_bndl_qty'] = 0
      objsgst['ev_ln_calc_total_item_qty'] = 0
      objsgst['ev_ln_dist_amt'] = Number((ebill['data'][0].labuor_cess).toFixed(2))
      objsgst['ev_ln_dist_curr_cd'] = 'INR'
      objsgst['ev_ln_dist_num'] = 0
      objsgst['ev_ln_dist_rt'] = 0
      objsgst['ev_ln_dscnt_amt'] = 0
      objsgst['ev_ln_dscnt_rt'] = 0
      objsgst['ev_ln_eff_calc_item_rate'] = 0
      objsgst['ev_ln_item_per_pkt_qty'] = 0
      objsgst['ev_ln_item_rt'] = 0
      objsgst['ev_ln_manual_override_item_rt'] = 0
      objsgst['ev_ln_pkt_per_bndl_qty'] = 0
      objsgst['ev_ln_tax_incl_rt'] = 0
      objsgst['pmt_txn_id'] = 0
      objsgst['ev_ln_dist_id'] = 0
      objsgst['ev_ln_dist_tcd'] = 'DOCUMENT LINE'
      objsgst['ev_ln_id'] = deddusname['labuor_cess_deduct']['deduction_id']
      objsgst['ev_ln_tcd'] = 'DOCUMENT LINE'
      objsgst['pmt_cp_ar_src_cd'] = 0
      objsgst['pmt_cp_ar_num_in_src'] = 0
      objsgst['pmt_cp_ar_instr_cd'] = 0
      objsgst['pmt_cp_num_in_src'] = 0
      objsgst['pmt_cp_ev_grp_id'] = 0
      objsgst['pmt_cp_ev_grp_src_cd'] = 0
      objsgst['pmt_cp_ev_grp_tcd'] = 0
      objsgst['pmt_cp_ev_grp_lcl_unq_num_in_src'] = 0
      objsgst['pmt_cp_nm'] = 0
      objsgst['pmt_rp_bnk_acct_id'] = 0
      objsgst['pmt_cp_bnk_acct_id'] = 0
      objsgst['pmt_cp_txn_id'] = 0

      data.push(Object.assign({}, objsgst))
    }
    let eventgroupobj = new Object()

    let netPayable = Number(ebill['data'][0].bill_amt.toFixed(0)) + Number(ebill['data'][0].cgst) + Number(ebill['data'][0].sgst) + Number(ebill['data'][0]['igst']) + Number(ebill['data'][0].add_with_held) + Number(ebill['data'][0].add_security) - Number(ebill['data'][0].withheldamount) - Number(ttl.toFixed(0));
    eventgroupobj['is_rec_or_pay'] = 'PAYABLE'
    eventgroupobj['local_doc_no'] = element['doc_local_no']
    eventgroupobj['local_doc_desc'] = ebill['data'][0]['bill_desc']
    eventgroupobj['module_cd'] = 'EMB'
    eventgroupobj['module_doc_type'] = 'EBILL'
    eventgroupobj['status'] = 'APPROVED'
    eventgroupobj['total_amt'] = netPayable
    eventgroupobj['doc_type'] = 'BILL'
    eventgroupobj['data'] = data
    eventgroupobj['create_user_id'] = ebillUser['user_id']
    eventgroupobj['b_acct_id'] = ebillUser['b_acct_id']
    eventgroupobj['req_data'] = JSON.stringify({ doc_local_no: element['doc_local_no'], node_cd: element['node_cd'] })
    console.log(eventgroupobj)
    let resp = await this.main.createevent(eventgroupobj)
    console.log(resp)
    if (resp['error'] == false) {
      // this.spinner.hide();

      //this.toastr.successToastr("Approval Forwarded Successfully!!")
    } else {
      // this.spinner.hide();
      // swal.fire("Error", resp['data'], 'error');
    }
  }

  async printEmb(element, ebillUser) {
    let obj = {}
    obj['id'] = element['doc_local_no']
    obj['b_acct_id'] = ebillUser.b_acct_id;
    obj['work_id'] = element['node_cd'];
    var emb = await this.embService.getAllEmbList(JSON.stringify(obj))
    var selectedTender = await this.tenderService.getBoq(JSON.stringify(obj));
    console.log(emb, selectedTender)
    await this.EmbPrintService.print1(emb['data'][0], ebillUser, selectedTender['data'][0])
  }
  async printcb(element, ebillUser) {
    let obj = {}
    obj['cb_id'] = element['doc_local_no']
    obj['b_acct_id'] = ebillUser.b_acct_id;
    obj['work_id'] = element['node_cd'];
    var cb = await this.main.getGenCbById(JSON.stringify(obj))
    // var selectedTender = await this.tenderService.getBoq(JSON.stringify(obj));
    console.log(cb)
    await this.CdPrintService.print(cb['data'][0], ebillUser)
  }
}
