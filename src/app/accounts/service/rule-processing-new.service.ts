import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class RuleProcessingNewService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;

  }
  erpUser
  b_acct_id
  systemDate = ''
  syatemTimeSTamp = ''
  fin_year
  accountingPeriod
  org_short_name
  returnOBJ={}
  async startProcessing(events) {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    let eventCodes = []
    for (let i = 0; i < events.length; i++) {
      if (!eventCodes.includes(events[i]['ev_ln_dist_bus_ev_cd'])) {
        eventCodes.push(events[i]['ev_ln_dist_bus_ev_cd'])
      }
    }
    console.log(events);
    console.log(eventCodes);


    let obj = new Object();
    obj['b_acct_id'] = this.b_acct_id
    obj["event_code"] = eventCodes
    console.log("Helo1");
    console.log(obj);

    let rulesResp = await this.getRuleForEvents(obj)
    console.log("Helo2");
    console.log(rulesResp);


    if (rulesResp['error'] == true) {
        return  rulesResp
    }

    let rules = rulesResp['data']
    console.log(rules);
    let ruleObj = new Object

    for (let i = 0; i < rules.length; i++) {
      if(rules[i].length>0){
      ruleObj[rules[i][0]['event_code']] = rules[i][0]


      }
    }
    let eventsWithNoRule = []
    for (let i = 0; i < eventCodes.length; i++) {

      if (!Object.keys(ruleObj).includes(eventCodes[i])) {
        eventsWithNoRule.push(eventCodes[i])
      }
    }
    console.log(eventsWithNoRule)
    if (eventsWithNoRule.length > 0) {
      this.returnOBJ['error']=true
      this.returnOBJ['data']="No rules found for the event codes (" + eventsWithNoRule.join(", ") + ")"

      return  this.returnOBJ
       
    }
    console.log("Helo2");
    console.log(ruleObj);
    let journals = []
    // let eventLayoutFields = ['ar_instr_cd', 'ar_num_in_src', 'cp_nm', 'cp_num_in_src', 'ev_grp_amt', 'ev_grp_cts', 'ev_grp_ets', 'ev_grp_id'
    //   , 'ev_grp_lcl_unq_num_in_src', 'ev_grp_src_cd', 'ev_grp_tcd', 'ev_ln_amt', 'ev_ln_bndl_qty', 'ev_ln_calc_total_item_qty'
    //   , 'ev_ln_cmnt', 'ev_ln_dist_aff_cc_cd', 'ev_ln_dist_amt', 'ev_ln_dist_bdgt_cd', 'ev_ln_dist_bus_ev_cd', 'ev_ln_dist_cc_cd'
    //   , 'ev_ln_dist_curr_cd', 'ev_ln_dist_id', 'ev_ln_dist_num', 'ev_ln_dist_pd_cd', 'ev_ln_dist_prj_cd', 'ev_ln_dist_rt'
    //   , 'ev_ln_dist_tcd', 'ev_ln_dscnt_amt', 'ev_ln_dscnt_rt', 'ev_ln_eff_calc_item_rate', 'ev_ln_id', 'ev_ln_item_per_pkt_qty'
    //   , 'ev_ln_item_rt', 'ev_ln_manual_override_item_rt', 'ev_ln_num', 'ev_ln_org_cd', 'ev_ln_pkt_per_bndl_qty', 'ev_ln_sku_desc'
    //   , 'ev_ln_sku_tcd', 'ev_ln_tax_incl_rt', 'ev_ln_tcd', 'pmt_cp_ar_instr_cd', 'pmt_cp_ar_num_in_src', 'pmt_cp_ar_src_cd', 'pmt_cp_bnk_acct_id'
    //   , 'pmt_cp_ev_grp_id', 'pmt_cp_ev_grp_lcl_unq_num_in_src', 'pmt_cp_ev_grp_src_cd', 'pmt_cp_ev_grp_tcd', 'pmt_cp_nm', 'pmt_cp_num_in_src'
    //   , 'pmt_rp_bnk_acct_id', 'pmt_txn_id', 'pmt_cp_txn_id']


    let journalFields = ['arr_id', 'acct_dt', 'appr_id', 'ar_src_cd','ar_num_in_src', 'ar_actvty_tcd', 'ar_actvty_lcl_num', 'create_timestamp','chart_of_account', 
      'cp_bnk_acct_id', 'db_cd_ind', 'event_code','event_id', 'ev_cts','fin_year', 'jrnl_dtl_ln_id', 'jrnl_ln_id', 'jrnl_id', 'jrnl_desc','ledger_type', 
      'ld_jrnl_ref_num','ld_jrnl_lfcycl_st_cd','ld_jrnl_unpost_seq_num','ld_fm', 'ld_acct_per', 'ld_cat_cd', 'ld_jrnl_entry_cd', 'ld_tgt_cur_tcd', 'ld_jrnl_rvrsl_tcd',
      'ld_jrnl_rvrsl_dt', 'ld_parent_jrnl_id', 'ld_jrnl_ln_ksn', 'ld_jrnl_ln_desc','1','ld_bk_cd', 'ld_src_cd', 'ld_pd_cd','2','ld_prj_cd', 'ld_jrnl_dtl_ln_ksn',
      'ld_tech_comp_cd','ld_jrnl_dtln_desc','ld_bus_func_cd','ld_unadj_acct_dt','org_unit_cd','proc_dt','prep_id','pmt_bnk_acct_id','tgt_curr_cd', 'txn_amt',       
      'ld_cc_cd', 'ld_aff_cc_cd', 'ld_bugt_cd', 'ar_instr_cd', 'ar_cntr_ip_id', 'ar_cntr_ip_name']

    for (let i = 0; i < events.length; i++) {

      let rule1 = Object.assign({}, ruleObj[events[i]['ev_ln_dist_bus_ev_cd']])  //ev_ln_dist_bus_ev_cd = event_code
      console.log(rule1);
      console.log(events[i]['ev_ln_dist_bus_ev_cd']);


      var temp = Object.assign({}, JSON.parse(rule1['rule_data']))
      console.log(temp);

      var then = temp['then']
      console.log(then);

      for (let j = 0; j < then.length; j++) {
        var arr = then[j]['arr']
        let ob = new Object

        for (let k = 0; k < arr.length; k++) {
          if (arr[k]['type'] == 'field') {
            ob[arr[k]['key']] = arr[k]['value']
          }
        }


        //header


        ob['acct_dt'] = events[i]['ev_grp_ets'].split('T')[0] +' '+(events[i]['ev_grp_ets'].split('T')[1]).split('Z')[0];
        // ob['proc_dt'] = null
        //ob['create_timestamp'] = null
        ob['fin_year'] = 2021
        //   ob['ledger_type'] = null //arr['ledger_type']
        ob['tgt_curr_cd'] = 'INR'
        //ob['jrnl_id'] = null
        ob['jrnl_desc'] = events[i]['ev_grp_src_cd'] + "-" + events[i]['ev_grp_tcd'] + "-" + events[i]['ev_grp_lcl_unq_num_in_src'] + "-" + events[i]['cp_nm'] + "-" + events[i]['ar_num_in_src']
        ob['prep_id'] = events[i]['id']
        ob['appr_id'] = null
        ob['ld_jrnl_ref_num'] = events[i]['ev_grp_src_cd'] + "-" + events[i]['ev_grp_tcd'] + "-" + events[i]['ev_grp_lcl_unq_num_in_src']
        ob['ld_jrnl_lfcycl_st_cd'] = 'PROCESSED'
        ob['ld_jrnl_unpost_seq_num'] = 0
        ob['ld_fm'] = null
        ob['ld_acct_per'] = null
        ob['ld_cat_cd'] = 'FIN'
        ob['ld_jrnl_entry_cd'] = 'Auto'
        ob['ld_tgt_cur_tcd'] = 'FN'
        ob['ld_jrnl_rvrsl_tcd'] = 'I'
        ob['ld_jrnl_rvrsl_dt'] = null
        ob['ld_parent_jrnl_id'] = null


        //line

        ob['jrnl_ln_id'] = "_"+i
        //ob['db_cd_ind'] = null
        ob['org_unit_cd'] = this.b_acct_id
       // ob['chart_of_account'] = null
        ob['ld_jrnl_ln_ksn'] = events[i]['ev_ln_num'] + "-" + then[j]['db_cd_ind']
        ob['ld_jrnl_ln_desc'] = events[i]['ev_grp_src_cd'] + "-" + events[i]['ev_grp_tcd'] + "-" + events[i]['ev_grp_lcl_unq_num_in_src'] + "-" + events[i]['cp_nm'] + "-" + events[i]['ar_num_in_src'] + "-" + events[i]['ev_ln_num'] + "-" + events[i]['ev_ln_cmnt']
        ob['ld_bk_cd'] = null
        ob['ld_src_cd'] = events[i]['ev_grp_src_cd']
        ob['ld_pd_cd'] = events[i]['ev_ln_dist_pd_cd']
        ob['ld_prj_cd'] = events[i]['ev_ln_dist_prj_cd']
        ob['ld_cc_cd'] = events[i]['ev_ln_dist_cc_cd']
        ob['ld_aff_cc_cd'] = events[i]['ev_ln_dist_aff_cc_cd']
        ob['ld_bugt_cd'] = events[i]['ev_ln_dist_bdgt_cd']


        //detailLine

        ob['jrnl_dtl_ln_id'] = j
        if(ob['db_cd_ind']=='CR'){
          ob['txn_amt'] = events[i]['ev_ln_amt']

        }else{
          ob['txn_amt'] = events[i]['ev_ln_amt']* (-1)

        }
        ob['event_code'] = events[i]['ev_ln_dist_bus_ev_cd']
        ob['event_id'] = events[i]['ev_grp_id']
        ob['arr_id'] = events[i]['ar_num_in_src']
        ob['ld_jrnl_dtl_ln_ksn'] = "_"+i+"_"+j
        ob['ld_jrnl_dtln_desc'] = events[i]['ev_grp_src_cd'] + "-" + events[i]['ev_grp_tcd'] + "-" + events[i]['ev_grp_lcl_unq_num_in_src'] + "-" + events[i]['cp_nm'] + "-" + events[i]['ar_num_in_src'] + "-" + events[i]['ev_ln_num'] + "-" + events[i]['ev_ln_cmnt'] + "-" + events[i]['ev_ln_sku_desc']
        ob['ar_src_cd'] = events[i]['ev_grp_src_cd']
        ob['ar_num_in_src'] = null 
        ob['ar_actvty_tcd'] = events[i]['ev_grp_tcd']
        ob['ar_actvty_lcl_num'] = events[i]['ev_grp_lcl_unq_num_in_src']
        ob['pmt_bnk_acct_id'] = events[i]['pmt_rp_bnk_acct_id']
        ob['cp_bnk_acct_id'] = events[i]['pmt_cp_bnk_acct_id']
        ob['ld_tech_comp_cd'] = 'ARE'
        ob['ld_bus_func_cd'] = 'EV2JV'
        ob['ld_unadj_acct_dt'] = events[i]['ev_grp_cts'].split('T')[0] +' '+(events[i]['ev_grp_ets'].split('T')[1]).split('Z')[0];
        ob['ev_cts'] = events[i]['ev_grp_cts']        
        ob['ar_instr_cd'] = null
        ob['ar_cntr_ip_id'] = events[i]['cp_num_in_src']
        ob['ar_cntr_ip_name'] = events[i]['cp_nm']

        journals.push(ob)

      }
    }

    console.log(journals);

    this.returnOBJ['error']=false
    this.returnOBJ['data']=journals

    return  this.returnOBJ
   // return journals;
  }

  async getRuleForEvents(obj) {
    console.log(this.httpUrl+'/accounts/rule/getRuleForEvents');
    console.log(obj);
    

    const resp = await this.http.post<any>(this.httpUrl + '/accounts/rule/getRuleForEvents', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}