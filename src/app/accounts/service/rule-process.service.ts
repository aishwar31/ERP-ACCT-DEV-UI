import { HttpClient, HttpEventType } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RuleProcessService {

    constructor(private http: HttpClient) { }
    profileImageUrl;
    codeValueTechObj = {};
    codeValueShowObj = {}
    //httpUrl="http://localhost:30001";
    httpUrl = "http://139.59.61.84:3001";
    accountImageUrl;
    accInfo = {};



    journalArr = [];
    unknownEvents = [];
    systemDate;
    fin_year
    party_name;
    org_short_name
    async startProcessing(events, allRule, systemDate, finYear, orgShortName) {
        console.log(events);
        console.log(finYear);
        console.log(allRule);
        console.log(systemDate);
        console.log(orgShortName);

        this.unknownEvents = [];
        this.journalArr = [];

        if (events.length > 0) {
            this.party_name = events[0]['cp_nm']
        }

        console.log(this.party_name)

        this.systemDate = systemDate

        this.fin_year = finYear
        this.org_short_name = orgShortName
        // let events = [{ "evt_grp_ln_dist_cd": 'EV1', "evt_grp_acct_id": '110', "evt_grp_ln_dist_id": 200, "evt_grp_dt": '2018-20-15' },
        // { "evt_grp_ln_dist_cd": 'EVW1', "evt_grp_acct_id": '110', "evt_grp_ln_dist_id": 200, "evt_grp_dt": '2018-20-15' }]
        for (let i = 0; i < events.length; i++) {
            console.log(events, allRule)
            let rule = await this.getRuleForEvent(events[i], allRule)
            console.log(rule, allRule)
            if (rule.length == 1) {
                await this.generateJournals(events[i], rule[0])
            } else {
                this.unknownEvents.push(events[i])
            }
        }

        var obj = new Object();
        obj['jrnl'] = this.journalArr;
        obj['event'] = this.unknownEvents;

        return obj;

    }
    async generateJournals(event, rule) {
        var temp = Object.assign({}, JSON.parse(rule['rule_data']))
        var then = temp['then']
        console.log(event);
        console.log(rule);
        console.log(then);
        console.log(then.length);
        var journalArr = []
        for (let i = 0; i < then.length; i++) {
            var arr = then[i]['arr']
            let obj = new Object();

            for (let j = 0; j < arr.length; j++) {
                // if (arr[j]['type'] == 'static') {
                if (arr[j]['value'] == "") {
                    arr[j]['value'] = null
                }
                if (arr[j]['key'] != 'id') {
                    obj[arr[j]['key']] = arr[j]['value']

                }
            }
            obj['jrnl_dtl_ln_id'] = i + 1;
            console.log(obj);

            var obj1 = new Object
            if (event['ev_grp_tcd'] == 'CHLN') {
                console.log("inside challan");
                obj1 = await this.assignValuesForChallan(event, obj)
            }
            if (event['ev_grp_tcd'] == 'FLFL') {
                console.log("inside payment");
                obj1 = await this.assignValuesForPayment(event, obj)
            }
            if (event['bus_event_type'] == 'BILL') {
                obj1 = await this.assignValuesForBill(event, obj)
            }
            if (event['bus_event_type'] == 'DEMAND') {
                obj1 = await this.assignValuesForDemand(event, obj)
            }
            if (event['bus_event_type'] == 'EBILL' || event['bus_event_type'] == 'BOOKLETPURCHASE' || event['bus_event_type'] == 'APPLICATION' || event['bus_event_type'] == 'CB' || event['bus_event_type'] == 'SALBILL') {
                obj1 = await this.assignValuesForModules(event, obj)
            }
            console.log(obj1);
            this.journalArr.push(obj1)
        }
    }


    async assignValuesForModules(event, obj) {
        obj['org_unit_cd'] = this.org_short_name   //need 
        obj['tgt_curr_cd'] = 'INR'
        obj['jrnl_id'] = event['event_id']
        obj['prep_id'] = event['create_user_id']
        obj['appr_id'] = event['create_user_id']
        obj['acct_dt'] = event['evt_grp_dt']
        obj['jrnl_desc'] = event['event_desc']
        obj['txn_amt'] = event['txn_amt']
        obj['jrnl_ln_id'] = event['event_ln_id']
        //obj['jrnl_dtl_ln_id'] = event['event_ln_id']
        obj['event_code'] = event['event_code']
        // obj['event_desc'] = event['event_desc']
        obj['proc_dt'] = this.systemDate //need
        obj['event_id'] = event['event_id']
        obj['fin_year'] = this.fin_year  // need
        obj['arr_id'] = event['arr_num']
        obj['event_ln_id'] = event['event_ln_id']
        // ---
        obj['jrnl_desc'] = event['local_doc_desc']
        obj['jrnl_line_desc'] = event['event_desc']
        obj['jrnl_type'] = event['bus_event_type']
        obj['status'] = 'UNPOSTED'
        console.log(obj)
        return obj;
    }

    async assignValuesForDemand(event, obj) {
        obj['org_unit_cd'] = this.org_short_name   //need 
        obj['tgt_curr_cd'] = 'INR'
        obj['jrnl_id'] = event['event_id']
        obj['prep_id'] = event['create_user_id']
        obj['appr_id'] = event['create_user_id']
        obj['acct_dt'] = event['evt_grp_dt']
        obj['jrnl_desc'] = event['event_desc']
        obj['txn_amt'] = event['txn_amt']
        obj['jrnl_ln_id'] = event['event_ln_id']
        //obj['jrnl_dtl_ln_id'] = event['event_ln_id']
        obj['event_code'] = event['event_code']
        // obj['event_desc'] = event['event_desc']
        obj['proc_dt'] = this.systemDate //need
        obj['event_id'] = event['event_id']
        obj['fin_year'] = this.fin_year  // need
        obj['arr_id'] = event['arr_num']
        obj['event_ln_id'] = event['event_ln_id']
        // ---
        obj['jrnl_desc'] = 'Demand Id  ' + event['event_id'] + ' of ' + this.party_name + ' for ' + event['remark']
        obj['jrnl_line_desc'] = event['event_desc']
        obj['jrnl_type'] = event['bus_event_type']
        obj['status'] = 'UNPOSTED'
        console.log(obj)
        return obj;
    }

    async assignValuesForBill(event, obj) {
        obj['org_unit_cd'] = this.org_short_name   //need 
        obj['tgt_curr_cd'] = 'INR'
        obj['jrnl_id'] = event['event_id']
        obj['prep_id'] = event['create_user_id']
        obj['appr_id'] = event['create_user_id']
        obj['acct_dt'] = event['evt_grp_dt']
        obj['jrnl_desc'] = 'Bill Id  ' + event['event_id'] + ' of ' + this.party_name + ' for ' + event['event_desc']
        obj['txn_amt'] = event['txn_amt']
        obj['jrnl_ln_id'] = event['event_ln_id']
        obj['event_code'] = event['event_code']
        obj['proc_dt'] = this.systemDate //need
        obj['event_id'] = event['event_id']
        obj['fin_year'] = this.fin_year  //need
        obj['arr_id'] = event['arr_num']
        obj['event_ln_id'] = event['event_ln_id']
        obj['jrnl_type'] = event['bus_event_type']
        obj['jrnl_line_desc'] = event['ev_desc']
        obj['status'] = 'UNPOSTED'

        console.log(obj)
        return obj;
    }

    async assignValuesForChallan(event, obj) {
        console.log(obj);

        obj['org_unit_cd'] = this.org_short_name   //need 
        obj['ar_instr_cd'] = event['ar_instr_cd']
        obj['ar_num_in_src'] = 
        obj['tgt_curr_cd'] = 'INR'
        obj['jrnl_id'] = event['event_id']
        obj['prep_id'] = event['create_user_id']
        obj['appr_id'] = event['create_user_id']
        // console.log((event['ev_grp_ets'].split('T')[0] + ' ' + (event['ev_grp_ets'].split('T')[1]).split('Z')[0]));
        obj['acct_dt'] = event['ev_grp_ets'].split('T')[0];
        obj['jrnl_desc'] = "Challan ID " + event['event_id'] + " of " + event['party_name'] + " for " + event['event_desc']
        obj['txn_amt'] = event['txn_amt']
        obj['jrnl_ln_id'] = event['event_ln_id']
        //obj['jrnl_dtl_ln_id'] = event['event_ln_id']
        obj['event_code'] = event['event_code']
        obj['proc_dt'] = this.systemDate //need
        obj['event_id'] = event['event_id']
        obj['fin_year'] = this.fin_year  //need
        obj['arr_id'] = event['arr_num']
        // obj['event_ln_id'] = event['event_ln_id']
        // obj['jrnl_line_desc'] = event['ev_desc']
        obj['status'] = 'PROCESSED'
        // obj['jrnl_type'] = event['bus_event_type']
        obj['ld_jrnl_lfcycl_st_cd'] = 'PROCESSED'
        obj['ar_instr_cd'] = event['ar_instr_cd'];
        obj['ar_num_in_src'] = event['ar_num_in_src'];
        obj['ar_cntr_ip_name'] = event['cp_nm'];
        obj['ar_cntr_ip_id'] = event['cp_num_in_src'];
        // obj['ld_unadj_acct_dt'] = event['ev_grp_cts'].split('T')[0];;
        obj['ar_actvty_lcl_num'] = event['ev_grp_lcl_unq_num_in_src'];
        obj['ar_actvty_tcd'] = event['ev_grp_tcd'];
        obj['ld_jrnl_ln_desc'] = event['ev_ln_cmnt'];
        obj['ld_aff_cc_cd'] = event['ev_ln_dist_aff_cc_cd'];
        obj['txn_amt'] = event['ev_ln_amt'];
        obj['ld_bugt_cd'] = event['ev_ln_dist_bdgt_cd'];
        obj['event_code'] = event['ev_ln_dist_bus_ev_cd'];
        obj['ld_cc_cd'] = event['ev_ln_dist_cc_cd'];
        obj['tgt_curr_cd'] = event['ev_ln_dist_curr_cd'];
        obj['ld_jrnl_dtl_ln_ksn'] = event['ev_ln_dist_num'];
        obj['ld_pd_cd'] = event['ev_ln_dist_pd_cd'];
        obj['ld_prj_cd'] = event['ev_ln_dist_prj_cd'];
        obj['ld_jrnl_ln_ksn'] = event['ev_ln_num'];
        obj['org_unit_cd'] = event['ev_ln_org_cd'];
        obj['ld_jrnl_dtln_desc'] = event['ev_ln_sku_desc'];
        obj['cp_bnk_acct_id'] = event['pmt_cp_bnk_acct_id'];
        obj['pmt_bnk_acct_id'] = event['pmt_rp_bnk_acct_id'];

        console.log(obj)
        return obj;
    }

    async assignValuesForPayment(event, obj) {
        console.log(obj);

        obj['arr_id'] = event['ar_num_in_src']
        obj['acct_dt'] = event['ev_grp_ets'].split('T')[0];
        obj['appr_id'] = event['create_user_id']
        obj['ar_src_cd'] = event['ev_grp_src_cd'];
        obj['ar_num_in_src'] = event['ar_num_in_src']
        obj['ar_actvty_tcd'] = event['ev_grp_tcd'];
        obj['ar_actvty_lcl_num'] = event['ev_grp_lcl_unq_num_in_src'];
        obj['ar_instr_cd'] = event['ar_instr_cd']
        obj['ar_cntr_ip_id'] = event['cp_num_in_src'];
        obj['ar_cntr_ip_name'] = event['cp_nm'];
        obj['cp_bnk_acct_id'] = event['pmt_cp_bnk_acct_id'];
        obj['event_code'] = event['ev_ln_dist_bus_ev_cd'];
        obj['event_id'] = event['id']
        obj['ev_cts'] = event['ev_grp_cts'].split('T')[0] + ' ' + (event['ev_grp_cts'].split('T')[1]).split('Z')[0];
        // console.log((event['ev_cts'].split('T')[0] + ' ' + (event['ev_cts'].split('T')[1]).split('Z')[0]));
        obj['fin_year'] = this.fin_year  //need
        obj['jrnl_dtl_ln_id'] = event['event_ln_id']
        obj['jrnl_ln_id'] = event['ev_ln_id']
        obj['jrnl_id'] = event['id']
        obj['jrnl_desc'] = "Payment ID " + event['id'] + " of " + event['cp_nm'] + " for " + event['ev_grp_lcl_unq_num_in_src']
        obj['ld_jrnl_ref_num'] = event['ev_grp_src_cd'] + '-' + event['ev_grp_tcd'] + '-' + event['ev_grp_lcl_unq_num_in_src'];
        obj['ld_jrnl_lfcycl_st_cd'] = 'PROCESSED'
        obj['ld_jrnl_unpost_seq_num'] = 0;
        obj['ld_cat_cd'] = 'FIN';
        obj['ld_jrnl_entry_cd'] = 'Auto';
        obj['ld_tgt_cur_tcd'] = 'TX';
        // obj['ld_jrnl_rvrsl_tcd'] = ''
        // obj['ld_jrnl_rvrsl_dt'] = ''
        // obj['ld_parent_jrnl_id'] = ''
        obj['ld_jrnl_ln_ksn'] = event['ev_ln_id']
        obj['ld_jrnl_ln_desc'] = event['ev_ln_cmnt'];
        obj['ld_bk_cd'] = ''
        obj['ld_src_cd'] = event['ev_grp_src_cd'];
        obj['ld_pd_cd'] = event['ev_ln_dist_pd_cd'];
        obj['ld_prj_cd'] = event['ev_ln_dist_prj_cd'];
        obj['ld_jrnl_dtl_ln_ksn'] = event['ev_ln_dist_num'];
        obj['ld_tech_comp_cd'] = ''
        obj['ld_jrnl_dtln_desc'] = event['ev_ln_sku_desc'];
        obj['ld_bus_func_cd'] = ''
        obj['ld_unadj_acct_dt'] = event['ev_grp_cts'].split('T')[0];
        obj['org_unit_cd'] = this.org_short_name   //need 
        obj['proc_dt'] = this.systemDate //need
        obj['prep_id'] = event['create_user_id']
        obj['pmt_bnk_acct_id'] = event['pmt_rp_bnk_acct_id'];
        obj['tgt_curr_cd'] = event['ev_ln_dist_curr_cd']
        obj['txn_amt'] = event['ev_grp_amt']
        obj['ld_cc_cd'] = event['ev_ln_dist_cc_cd'];
        obj['ld_aff_cc_cd'] = event['ev_ln_dist_aff_cc_cd'];
        obj['ld_bugt_cd'] = event['ev_ln_dist_bdgt_cd'];

        // console.log((event['ev_grp_ets'].split('T')[0] + ' ' + (event['ev_grp_ets'].split('T')[1]).split('Z')[0]));
        // obj['event_ln_id'] = event['event_ln_id']
        // obj['jrnl_line_desc'] = event['ev_desc']
        obj['status'] = 'PROCESSED'
        // obj['jrnl_type'] = event['bus_event_type']

        console.log(obj)
        return obj;
    }


    async getRuleForEvent(event, allRule) {
        console.log(event);
        console.log(allRule);
        var eventRules = []
        for (let i = 0; i < allRule.length; i++) {
            console.log(event['ev_ln_dist_bus_ev_cd']);
            console.log(allRule[i]['event_code']);
            if (event['ev_ln_dist_bus_ev_cd'] == allRule[i]['event_code']) {
                eventRules.push(allRule[i])
            }
        }
        console.log(eventRules)
        var validRules = []
        for (let i = 0; i < eventRules.length; i++) {
            var temp = Object.assign({}, JSON.parse(eventRules[i]['rule_data']))
            var when = temp['when']
            console.log(temp)
            console.log(when)
            if (when.length == 1) {
                validRules.push(eventRules[i])
            }
            if (when.length > 1) {
                var flag = true
                for (let j = 1; j < when.length; j++) {
                    if (flag == true) {
                        var local = false
                        if (when[j]['operator'] == '==') {
                            if (event[when[j]['key']] == when[j]['value']) {
                                local = true
                            }
                        } else if (when[j]['operator'] == '!=') {
                            if (event[when[j]['key']] != when[j]['value']) {
                                local = true
                            }
                        } else if (when[j]['operator'] == '<') {
                            if (event[when[j]['key']] < when[j]['value']) {
                                local = true
                            }
                        } else if (when[j]['operator'] == '>') {
                            if (event[when[j]['key']] > when[j]['value']) {
                                local = true
                            }
                        }
                        if (local == false && when[j]['condition'] == 'AND') {
                            flag = false
                        }
                    }
                }
                if (flag == true) {
                    validRules.push(eventRules[i])
                }
            }

        }
        var returnArr = []

        for (let i = 0; i < validRules.length; i++) {
            if (i == 0) {
                returnArr.push(validRules[i])
            } else if (returnArr[0]['priority'] < validRules[i]['priority']) {
                returnArr[0] = Object.assign({}, validRules[i])
            }
        }
        console.log(returnArr)
        return returnArr;
    }
}

