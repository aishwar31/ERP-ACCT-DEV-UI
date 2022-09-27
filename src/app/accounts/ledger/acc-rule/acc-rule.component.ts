import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartOfAccountService } from '../../service/chart-of-account.service'
import { EventsService } from '../../service/events.service';
import { HierarchyService } from '../../service/hierarchy.service';
import { JournalService } from '../../service/journal.service';
import { MainService } from '../../service/main.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { RuleService } from '../../service/rule.service';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import Swal from 'sweetalert2';
import { element } from 'protractor';

declare var $: any

 
 
@Component({
  selector: 'app-acc-rule',
  templateUrl: './acc-rule.component.html',
  styleUrls: ['./acc-rule.component.css'],
  
})
export class AccRuleComponent implements OnInit {


  constructor(private chartOfAccountService: ChartOfAccountService, private hierarchyService: HierarchyService, private journalService: JournalService,
    private EventsService: EventsService, private ruleService: RuleService, private router: Router,
    private spinner: NgxSpinnerService, private snackBar: MatSnackBar, public mainService: MainService) {

  }
  erpUser;
  b_acct_id;

  obj = {
    id: '',
    ruleDesc: '',
    rulePriority: 0,
    when: [{ condition: 'AND', key: "event_code", value: '', operator: '==' }],
    journals: [{}, {}]
  };
  ledgerTypeArr = [{ code: 'ACT', value: 'Actual' }]
  allRule = [];
  allEvents = []
  fieldTechnicalNames = {}
  fieldBusinessNames = {}
  allFields = [];
  journalFieldsCodes = []
  journalObjArray = []
  allEventLayouts = []
  selectedJournal = []
  allDBIND = [{ code: 'CR', value: 'CREDIT' }, { code: "DB", value: 'DEBIT' }]
  cRdBObj = { CR: 'CREDIT', DB: 'DEBIT' }
  defaultObj = {
    jrnl_desc: 'evt_grp_desc', amount: 'evt_grp_ln_dist_amt', arr_id: 'evt_grp_cp_arr_id', accounting_dt: 'evt_grp_dt',
    event_code: 'event_code', fin_year: 'evt_grp_dt', event_id: 'evt_grp_ln_dist_id', arr_num: 'evt_grp_cp_arr_id',
    fiscal_period: 'evt_grp_dt', curr_cd: 'evt_grp_curr_cd'
  }
  askFields = ['ledger_type', 'chart_of_account', 'db_cd_ind']

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("stepper") stepper: MatStepper;
  type = [{ code: 'field', value: 'FIELD' }, { code: 'static', value: 'STATIC' }];

  displayedColumns = ['id', 'rule_name', 'priority', 'action'];
  datasource;
  allChartOfAccount = [];
  selectLayoutFields = []
  index = 0;
  fieldTechNameTOBusinessName = {};
  allOperator = [{ code: "==", value: "EQUAL TO" }, { code: "!=", value: "NOT EQUAL TO" }, { code: "<", value: "GRATER THEN" }, { code: ">", value: "LESS THEN" }]
  create_flag=false;
  list_flag=true;
  update_flag=false;
  test_flag=false;

  async ngOnInit() {
    this.spinner.show();
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    //await this.getAllEvent();
    await this.getallFields();
    await this.getallChartOfAccount();
    await this.getJouranlDetals();
    await this.getAllRuleList();
    await this.makeJournalObj()
    await this.getAllEventLayouts();
    




    await this.getAllBudget();
    await this.getAllProject();
    await this.getAllProduct();
    await this.getAllActivity();
 

    // await this.setData();
    // this.spinner.hide();

  }
async testRule(){
 this.create_flag=false;
 this.list_flag=false;
 this.update_flag=false;
 this.test_flag=true;
 this.DBTESTCOA=[]
 this.CRTESTCOA=[]
}
DBTESTCOA=[]
CRTESTCOA=[]
async checkRuleForthisCombination(){
console.log(this.obj)
this.DBTESTCOA=[]
this.CRTESTCOA=[]
this.obj['b_acct_id']=this.b_acct_id
var resp = await this.ruleService.getRuleForTest(this.obj);
console.log(resp)
    if (resp['error'] == false) {
      if(resp['data'].length>0){
        this.DBTESTCOA=JSON.parse(resp['data'][0]['coa_debit'])
        this.CRTESTCOA=JSON.parse(resp['data'][0]['coa_credit'])
   
      }
     console.log(this.DBTESTCOA)
      this.spinner.hide()
    
    }
}
  ////////////////////////////COA Levels/////////////////////////////////////
  async listfunc(){
    this.create_flag=false;
    this.list_flag=true;
    this.update_flag=false
 this.test_flag=false;

    await this.refresh1()
    await this.getAllRuleList();
    await this.makeJournalObj()
  
    }
   async createNew(){
      this.create_flag=true;
      this.list_flag=false;
      this.update_flag=false
 this.test_flag=false;

      this.refresh1()
   }
  coaLevel1 = []
  coaLevel2 = []
  coaLevel3 = []
  coaLevel4 = []
  coaLevel5 = []
  coaLevel6 = []
  coaLevel7 = []
  CoaHierSelectObj = {}
  COAHier = []
  selectedCOAIndex = -1
  async SelectCOA(i) {
    $('#selectCOA').modal('show');
    this.selectedCOAIndex = i
    this.COAHier = this.allChartOfAccount;
    let ob={}
    if(this.obj['journals'][i]['chart_of_account']!=null && this.obj['journals'][i]['chart_of_account']!='' && this.obj['journals'][i]['chart_of_account']!=undefined){
      ob=this.COA_obj1['db_cd_ind'][this.obj['journals'][i]['chart_of_account']]
      console.log(ob)
    }else{
      ob== Object.assign({},{})
    }
    this.CoaHierSelectObj = Object.assign({},{})
    await this.getCOALevel1();
    if(Object.keys(ob).length!=0){
      this.CoaHierSelectObj=Object.assign({},ob)
      await this.onChangeCOALvl1()
      this.CoaHierSelectObj=Object.assign({},ob)

      await   this.onChangeCOALvl2()
      this.CoaHierSelectObj=Object.assign({},ob)

      await this.onChangeCOALvl3()
      this.CoaHierSelectObj=Object.assign({},ob)

      await   this.onChangeCOALvl4()
      this.CoaHierSelectObj=Object.assign({},ob)

      await this.onChangeCOALvl5()
      this.CoaHierSelectObj=Object.assign({},ob)

      await this.onChangeCOALvl6()
      this.CoaHierSelectObj=Object.assign({},ob)

      await  this.onChangeCOALvl7()


        }
  }
 async getCOALevel1() {
    this.coaLevel1 = []
    for (let i = 0; i < this.COAHier.length; i++) {
      if (this.COAHier[i]['lvl1_code'] == this.COAHier[i]['leaf_code']) {
        let ob = new Object();
        ob['lvl1_code'] = this.COAHier[i]['lvl1_code']
        ob['lvl1_value'] = this.COAHier[i]['lvl1_value']
        ob['is_leaf'] = this.COAHier[i]['is_leaf']

        this.coaLevel1.push(ob)
      }
    }

    this.coaLevel2 = []
    this.coaLevel3 = []
    this.coaLevel4 = []
    this.coaLevel5 = []
    this.coaLevel6 = []
    this.coaLevel7 = []
    console.log(this.coaLevel1)
  }

  async onChangeCOALvl1() {
    if (this.CoaHierSelectObj['lvl1_code'] == '' || this.CoaHierSelectObj['lvl1_code'] == null) {
      this.CoaHierSelectObj['leaf_code'] = ""
      this.CoaHierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.coaLevel1.length; i++) {
      if (this.coaLevel1[i]['lvl1_code'] == this.CoaHierSelectObj['lvl1_code']) {
        this.CoaHierSelectObj['lvl1_value'] = this.coaLevel1[i]['lvl1_value']
        if (this.coaLevel1[i]['is_leaf'] == 1) {
          await this.makingCOALeafValues()
        } else {
          this.CoaHierSelectObj['leaf_code'] = ""
          this.CoaHierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.coaLevel2 = []
    for (let i = 0; i < this.COAHier.length; i++) {
      if (this.COAHier[i]['lvl1_code'] == this.CoaHierSelectObj['lvl1_code'] && this.COAHier[i]['lvl2_code'] != null) {
        if (this.COAHier[i]['lvl2_code'] == this.COAHier[i]['leaf_code']) {
          let ob = new Object();
          ob['lvl2_code'] = this.COAHier[i]['lvl2_code']
          ob['lvl2_value'] = this.COAHier[i]['lvl2_value']
          ob['is_leaf'] = this.COAHier[i]['is_leaf']

          this.coaLevel2.push(ob)
        }
      }

    }
    console.log(this.coaLevel2)
    this.coaLevel3 = []
    this.coaLevel4 = []
    this.coaLevel5 = []
    this.coaLevel6 = []
    this.coaLevel7 = []

    for (let i = 2; i < 8; i++) {
      this.CoaHierSelectObj['lvl' + i + '_code'] = null
      this.CoaHierSelectObj['lvl' + i + '_value'] = null
    }


  }
  async onChangeCOALvl2() {
    if (this.CoaHierSelectObj['lvl2_code'] == '' || this.CoaHierSelectObj['lvl2_code'] == null) {
      this.CoaHierSelectObj['leaf_code'] = ""
      this.CoaHierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.coaLevel2.length; i++) {
      if (this.coaLevel2[i]['lvl2_code'] == this.CoaHierSelectObj['lvl2_code']) {
        this.CoaHierSelectObj['lvl2_value'] = this.coaLevel2[i]['lvl2_value']
        if (this.coaLevel2[i]['is_leaf'] == 1) {
          await this.makingCOALeafValues()
        } else {
          this.CoaHierSelectObj['leaf_code'] = ""
          this.CoaHierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.coaLevel3 = []
    for (let i = 0; i < this.COAHier.length; i++) {
      if (this.COAHier[i]['lvl2_code'] == this.CoaHierSelectObj['lvl2_code'] && this.COAHier[i]['lvl3_code'] != null) {
        if (this.COAHier[i]['lvl3_code'] == this.COAHier[i]['leaf_code']) {

          let ob = new Object()
          ob['lvl3_code'] = this.COAHier[i]['lvl3_code']
          ob['lvl3_value'] = this.COAHier[i]['lvl3_value']
          ob['is_leaf'] = this.COAHier[i]['is_leaf']

          this.coaLevel3.push(ob)
        }
      }
    }

    this.coaLevel4 = []
    this.coaLevel5 = []
    this.coaLevel6 = []
    this.coaLevel7 = []

    for (let i = 3; i < 8; i++) {
      this.CoaHierSelectObj['lvl' + i + '_code'] = null
      this.CoaHierSelectObj['lvl' + i + '_value'] = null

    }



  }

  async onChangeCOALvl3() {
    if (this.CoaHierSelectObj['lvl3_code'] == '' || this.CoaHierSelectObj['lvl3_code'] == null) {
      this.CoaHierSelectObj['leaf_code'] = ""
      this.CoaHierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.coaLevel3.length; i++) {
      if (this.coaLevel3[i]['lvl3_code'] == this.CoaHierSelectObj['lvl3_code']) {
        this.CoaHierSelectObj['lvl3_value'] = this.coaLevel3[i]['lvl3_value']
        if (this.coaLevel3[i]['is_leaf'] == 1) {
          await this.makingCOALeafValues()
        } else {
          this.CoaHierSelectObj['leaf_code'] = ""
          this.CoaHierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.coaLevel4 = []
    for (let i = 0; i < this.COAHier.length; i++) {
      if (this.COAHier[i]['lvl3_code'] == this.CoaHierSelectObj['lvl3_code'] && this.COAHier[i]['lvl4_code'] != null) {
        if (this.COAHier[i]['lvl4_code'] == this.COAHier[i]['leaf_code']) {

          let ob = new Object()
          ob['lvl4_code'] = this.COAHier[i]['lvl4_code']
          ob['lvl4_value'] = this.COAHier[i]['lvl4_value']
          ob['is_leaf'] = this.COAHier[i]['is_leaf']

          this.coaLevel4.push(ob)
        }
      }

    }

    this.coaLevel5 = []
    this.coaLevel6 = []
    this.coaLevel7 = []

    for (let i = 4; i < 8; i++) {
      this.CoaHierSelectObj['lvl' + i + '_code'] = null
      this.CoaHierSelectObj['lvl' + i + '_value'] = null

    }


  }

  async onChangeCOALvl4() {
    if (this.CoaHierSelectObj['lvl4_code'] == '' || this.CoaHierSelectObj['lvl4_code'] == null) {
      this.CoaHierSelectObj['leaf_code'] = ""
      this.CoaHierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.coaLevel4.length; i++) {
      if (this.coaLevel4[i]['lvl4_code'] == this.CoaHierSelectObj['lvl4_code']) {
        this.CoaHierSelectObj['lvl4_value'] = this.coaLevel4[i]['lvl4_value']
        if (this.coaLevel4[i]['is_leaf'] == 1) {
          await this.makingCOALeafValues()
        } else {
          this.CoaHierSelectObj['leaf_code'] = ""
          this.CoaHierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.coaLevel5 = []
    for (let i = 0; i < this.COAHier.length; i++) {
      if (this.COAHier[i]['lvl4_code'] == this.CoaHierSelectObj['lvl4_code'] && this.COAHier[i]['lvl5_code'] != null) {
        if (this.COAHier[i]['lvl5_code'] == this.COAHier[i]['leaf_code']) {

          let ob = new Object()
          ob['lvl5_code'] = this.COAHier[i]['lvl5_code']
          ob['lvl5_value'] = this.COAHier[i]['lvl5_value']
          ob['is_leaf'] = this.COAHier[i]['is_leaf']

          this.coaLevel5.push(ob)
        }
      }

    }
    this.coaLevel6 = []
    this.coaLevel7 = []

    for (let i = 5; i < 8; i++) {
      this.CoaHierSelectObj['lvl' + i + '_code'] = null
      this.CoaHierSelectObj['lvl' + i + '_value'] = null

    }


  }

  async onChangeCOALvl5() {
    if (this.CoaHierSelectObj['lvl5_code'] == '' || this.CoaHierSelectObj['lvl5_code'] == null) {
      this.CoaHierSelectObj['leaf_code'] = ""
      this.CoaHierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.coaLevel5.length; i++) {
      if (this.coaLevel5[i]['lvl5_code'] == this.CoaHierSelectObj['lvl5_code']) {
        this.CoaHierSelectObj['lvl5_value'] = this.coaLevel5[i]['lvl5_value']
        if (this.coaLevel5[i]['is_leaf'] == 1) {
          await this.makingCOALeafValues()
        } else {
          this.CoaHierSelectObj['leaf_code'] = ""
          this.CoaHierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.coaLevel6 = []
    for (let i = 0; i < this.COAHier.length; i++) {
      if (this.COAHier[i]['lvl5_code'] == this.CoaHierSelectObj['lvl5_code'] && this.COAHier[i]['lvl6_code'] != null) {
        if (this.COAHier[i]['lvl6_code'] == this.COAHier[i]['leaf_code']) {

          let ob = new Object()
          ob['lvl6_code'] = this.COAHier[i]['lvl6_code']
          ob['lvl6_value'] = this.COAHier[i]['lvl6_value']
          ob['is_leaf'] = this.COAHier[i]['is_leaf']

          this.coaLevel6.push(ob)
        }
      }

    }
    this.coaLevel7 = []

    for (let i = 6; i < 8; i++) {
      this.CoaHierSelectObj['lvl' + i + '_code'] = null
      this.CoaHierSelectObj['lvl' + i + '_value'] = null

    }




  }

  async onChangeCOALvl6() {
    if (this.CoaHierSelectObj['lvl7_code'] == '' || this.CoaHierSelectObj['lvl7_code'] == null) {
      this.CoaHierSelectObj['leaf_code'] = ""
      this.CoaHierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.coaLevel6.length; i++) {
      if (this.coaLevel6[i]['lvl6_code'] == this.CoaHierSelectObj['lvl6_code']) {
        this.CoaHierSelectObj['lvl6_value'] = this.coaLevel6[i]['lvl6_value']
        if (this.coaLevel6[i]['is_leaf'] == 1) {
          await this.makingCOALeafValues()
        } else {
          this.CoaHierSelectObj['leaf_code'] = ""
          this.CoaHierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.coaLevel7 = []
    for (let i = 0; i < this.COAHier.length; i++) {
      if (this.COAHier[i]['lvl6_code'] == this.CoaHierSelectObj['lvl6_code'] && this.COAHier[i]['lvl7_code'] != null) {
        if (this.COAHier[i]['lvl7_code'] == this.COAHier[i]['leaf_code']) {

          let ob = new Object()
          ob['lvl7_code'] = this.COAHier[i]['lvl7_code']
          ob['lvl7_value'] = this.COAHier[i]['lvl7_value']
          ob['is_leaf'] = this.COAHier[i]['is_leaf']

          this.coaLevel7.push(ob)
        }
      }

    }

    for (let i = 7; i < 8; i++) {
      this.CoaHierSelectObj['lvl' + i + '_code'] = null
      this.CoaHierSelectObj['lvl' + i + '_value'] = null

    }


  }

  async onChangeCOALvl7() {

    for (let i = 0; i < this.coaLevel7.length; i++) {
      if (this.coaLevel7[i]['lvl7_code'] == this.CoaHierSelectObj['lvl7_code']) {
        this.CoaHierSelectObj['lvl7_value'] = this.coaLevel7[i]['lvl7_value']
      }
    }

    await this.makingCOALeafValues()



  }
  async makingCOALeafValues() {
    if (this.CoaHierSelectObj['lvl7_code'] != undefined && this.CoaHierSelectObj['lvl7_code'] != '' && this.CoaHierSelectObj['lvl7_code'] != null) {
      this.CoaHierSelectObj['leaf_code'] = this.CoaHierSelectObj['lvl7_code']
      this.CoaHierSelectObj['leaf_value'] = this.CoaHierSelectObj['lvl7_value']
    } else if (this.CoaHierSelectObj['lvl6_code'] != undefined && this.CoaHierSelectObj['lvl6_code'] != '' && this.CoaHierSelectObj['lvl6_code'] != null) {
      this.CoaHierSelectObj['leaf_code'] = this.CoaHierSelectObj['lvl6_code']
      this.CoaHierSelectObj['leaf_value'] = this.CoaHierSelectObj['lvl6_value']
    } else if (this.CoaHierSelectObj['lvl5_code'] != undefined && this.CoaHierSelectObj['lvl5_code'] != '' && this.CoaHierSelectObj['lvl5_code'] != null) {
      this.CoaHierSelectObj['leaf_code'] = this.CoaHierSelectObj['lvl5_code']
      this.CoaHierSelectObj['leaf_value'] = this.CoaHierSelectObj['lvl5_value']
    } else if (this.CoaHierSelectObj['lvl4_code'] != undefined && this.CoaHierSelectObj['lvl4_code'] != '' && this.CoaHierSelectObj['lvl4_code'] != null) {
      this.CoaHierSelectObj['leaf_code'] = this.CoaHierSelectObj['lvl4_code']
      this.CoaHierSelectObj['leaf_value'] = this.CoaHierSelectObj['lvl4_value']
    } else if (this.CoaHierSelectObj['lvl3_code'] != undefined && this.CoaHierSelectObj['lvl3_code'] != '' && this.CoaHierSelectObj['lvl3_code'] != null) {
      this.CoaHierSelectObj['leaf_code'] = this.CoaHierSelectObj['lvl3_code']
      this.CoaHierSelectObj['leaf_value'] = this.CoaHierSelectObj['lvl3_value']
    } else if (this.CoaHierSelectObj['lvl2_code'] != undefined && this.CoaHierSelectObj['lvl2_code'] != '' && this.CoaHierSelectObj['lvl2_code'] != null) {
      this.CoaHierSelectObj['leaf_code'] = this.CoaHierSelectObj['lvl2_code']
      this.CoaHierSelectObj['leaf_value'] = this.CoaHierSelectObj['lvl2_value']
    } else if (this.CoaHierSelectObj['lvl1_code'] != undefined && this.CoaHierSelectObj['lvl1_code'] != '' && this.CoaHierSelectObj['lvl1_code'] != null) {
      this.CoaHierSelectObj['leaf_code'] = this.CoaHierSelectObj['lvl1_code']
      this.CoaHierSelectObj['leaf_value'] = this.CoaHierSelectObj['lvl1_value']
    }

  }

  SubmitListHierforCOA() {
    if (this.CoaHierSelectObj['leaf_code'] == "" || this.CoaHierSelectObj['leaf_code'] == null) {
      Swal.fire("Error", "Please select till leaf.")
      return;
    }

    for (let i = 0; i < this.allChartOfAccount.length; i++) {
      if (this.allChartOfAccount[i]['leaf_code'] == this.CoaHierSelectObj['leaf_code']) {

        this.obj['journals'][this.selectedCOAIndex]['chart_of_account'] = this.CoaHierSelectObj['leaf_code']
        this.changeChartOfAccount(this.selectedCOAIndex)
      }
    }

    $('#selectCOA').modal('hide');


  }
  //////////////////////////////////////COA Level End/////////////////////////////////////////





  ///***************************************Select Event New  Code**************************************///


  allProjectHier = []
  allProductHier = []
  allActivityHier = [];
  allBudgetHier = [];


  displayedColumns1 = ['event_code', 'event_desc', 'action'];
  dataSource1;

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sortCol2') sortCol2: MatSort;

  level1 = [];
  level2 = [];
  level3 = [];
  level4 = [];
  level5 = [];
  level6 = [];
  level7 = [];
  selectObj = {}
  Chartobj = {};
  HierSelectObj = {}
  Hier = [];
  hier_type;
  getLevel1() {
    this.level1 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl1_cd'] == this.Hier[i]['leaf_cd']) {
        let ob = new Object();
        ob['lvl1_cd'] = this.Hier[i]['lvl1_cd']
        ob['lvl1_value'] = this.Hier[i]['lvl1_value']
        ob['is_leaf'] = this.Hier[i]['is_leaf']

        this.level1.push(ob)
      }
    }

    this.level2 = []
    this.level3 = []
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []
    console.log(this.level1)
  }

  async onChangeLvl1() {
    if (this.HierSelectObj['lvl1_cd'] == '' || this.HierSelectObj['lvl1_cd'] == null) {
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level1.length; i++) {
      if (this.level1[i]['lvl1_cd'] == this.HierSelectObj['lvl1_cd']) {
        this.HierSelectObj['lvl1_value'] = this.level1[i]['lvl1_value']
        if (this.level1[i]['is_leaf'] == 1) {
          console.log(this.level1[i])
          await this.makingLeafValues()
        } else {
          this.HierSelectObj['leaf_cd'] = ""
          this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level2 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl1_cd'] == this.HierSelectObj['lvl1_cd'] && this.Hier[i]['lvl2_cd'] != null) {
        if (this.Hier[i]['lvl2_cd'] == this.Hier[i]['leaf_cd']) {
          let ob = new Object();
          ob['lvl2_cd'] = this.Hier[i]['lvl2_cd']
          ob['lvl2_value'] = this.Hier[i]['lvl2_value']
          ob['is_leaf'] = this.Hier[i]['is_leaf']

          this.level2.push(ob)
        }
      }

    }
    this.level3 = []
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []

    for (let i = 2; i < 8; i++) {
      this.HierSelectObj['lvl' + i + '_cd'] = null
      this.HierSelectObj['lvl' + i + '_value'] = null
    }


  }
  async onChangeLvl2() {
    if (this.HierSelectObj['lvl2_cd'] == '' || this.HierSelectObj['lvl2_cd'] == null) {
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level2.length; i++) {
      if (this.level2[i]['lvl2_cd'] == this.HierSelectObj['lvl2_cd']) {
        this.HierSelectObj['lvl2_value'] = this.level2[i]['lvl2_value']
        if (this.level2[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        } else {
          this.HierSelectObj['leaf_cd'] = ""
          this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level3 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl2_cd'] == this.HierSelectObj['lvl2_cd'] && this.Hier[i]['lvl3_cd'] != null) {
        if (this.Hier[i]['lvl3_cd'] == this.Hier[i]['leaf_cd']) {

          let ob = new Object()
          ob['lvl3_cd'] = this.Hier[i]['lvl3_cd']
          ob['lvl3_value'] = this.Hier[i]['lvl3_value']
          ob['is_leaf'] = this.Hier[i]['is_leaf']

          this.level3.push(ob)
        }
      }
    }

    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []

    for (let i = 3; i < 8; i++) {
      this.HierSelectObj['lvl' + i + '_cd'] = null
      this.HierSelectObj['lvl' + i + '_value'] = null

    }



  }

  async onChangeLvl3() {
    if (this.HierSelectObj['lvl3_cd'] == '' || this.HierSelectObj['lvl3_cd'] == null) {
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level3.length; i++) {
      if (this.level3[i]['lvl3_cd'] == this.HierSelectObj['lvl3_cd']) {
        this.HierSelectObj['lvl3_value'] = this.level3[i]['lvl3_value']
        if (this.level3[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        } else {
          this.HierSelectObj['leaf_cd'] = ""
          this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level4 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl3_cd'] == this.HierSelectObj['lvl3_cd'] && this.Hier[i]['lvl4_cd'] != null) {
        if (this.Hier[i]['lvl4_cd'] == this.Hier[i]['leaf_cd']) {

          let ob = new Object()
          ob['lvl4_cd'] = this.Hier[i]['lvl4_cd']
          ob['lvl4_value'] = this.Hier[i]['lvl4_value']
          ob['is_leaf'] = this.Hier[i]['is_leaf']

          this.level4.push(ob)
        }
      }

    }

    this.level5 = []
    this.level6 = []
    this.level7 = []

    for (let i = 4; i < 8; i++) {
      this.HierSelectObj['lvl' + i + '_cd'] = null
      this.HierSelectObj['lvl' + i + '_value'] = null

    }


  }

  async onChangeLvl4() {
    if (this.HierSelectObj['lvl4_cd'] == '' || this.HierSelectObj['lvl4_cd'] == null) {
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level4.length; i++) {
      if (this.level4[i]['lvl4_cd'] == this.HierSelectObj['lvl4_cd']) {
        this.HierSelectObj['lvl4_value'] = this.level4[i]['lvl4_value']
        if (this.level4[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        } else {
          this.HierSelectObj['leaf_cd'] = ""
          this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level5 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl4_cd'] == this.HierSelectObj['lvl4_cd'] && this.Hier[i]['lvl5_cd'] != null) {
        if (this.Hier[i]['lvl5_cd'] == this.Hier[i]['leaf_cd']) {

          let ob = new Object()
          ob['lvl5_cd'] = this.Hier[i]['lvl5_cd']
          ob['lvl5_value'] = this.Hier[i]['lvl5_value']
          ob['is_leaf'] = this.Hier[i]['is_leaf']

          this.level5.push(ob)
        }
      }

    }
    this.level6 = []
    this.level7 = []

    for (let i = 5; i < 8; i++) {
      this.HierSelectObj['lvl' + i + '_cd'] = null
      this.HierSelectObj['lvl' + i + '_value'] = null

    }


  }

  async onChangeLvl5() {
    if (this.HierSelectObj['lvl5_cd'] == '' || this.HierSelectObj['lvl5_cd'] == null) {
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level5.length; i++) {
      if (this.level5[i]['lvl5_cd'] == this.HierSelectObj['lvl5_cd']) {
        this.HierSelectObj['lvl5_value'] = this.level5[i]['lvl5_value']
        if (this.level5[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        } else {
          this.HierSelectObj['leaf_cd'] = ""
          this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level6 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl5_cd'] == this.HierSelectObj['lvl5_cd'] && this.Hier[i]['lvl6_cd'] != null) {
        if (this.Hier[i]['lvl6_cd'] == this.Hier[i]['leaf_cd']) {

          let ob = new Object()
          ob['lvl6_cd'] = this.Hier[i]['lvl6_cd']
          ob['lvl6_value'] = this.Hier[i]['lvl6_value']
          ob['is_leaf'] = this.Hier[i]['is_leaf']

          this.level6.push(ob)
        }
      }

    }
    this.level7 = []

    for (let i = 6; i < 8; i++) {
      this.HierSelectObj['lvl' + i + '_cd'] = null
      this.HierSelectObj['lvl' + i + '_value'] = null

    }




  }

  async onChangeLvl6() {
    if (this.HierSelectObj['lvl7_cd'] == '' || this.HierSelectObj['lvl7_cd'] == null) {
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level6.length; i++) {
      if (this.level6[i]['lvl6_cd'] == this.HierSelectObj['lvl6_cd']) {
        this.HierSelectObj['lvl6_value'] = this.level6[i]['lvl6_value']
        if (this.level6[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        } else {
          this.HierSelectObj['leaf_cd'] = ""
          this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level7 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl6_cd'] == this.HierSelectObj['lvl6_cd'] && this.Hier[i]['lvl7_cd'] != null) {
        if (this.Hier[i]['lvl7_cd'] == this.Hier[i]['leaf_cd']) {

          let ob = new Object()
          ob['lvl7_cd'] = this.Hier[i]['lvl7_cd']
          ob['lvl7_value'] = this.Hier[i]['lvl7_value']
          ob['is_leaf'] = this.Hier[i]['is_leaf']

          this.level7.push(ob)
        }
      }

    }

    for (let i = 7; i < 8; i++) {
      this.HierSelectObj['lvl' + i + '_cd'] = null
      this.HierSelectObj['lvl' + i + '_value'] = null

    }


  }

  async onChangeLvl7() {

    for (let i = 0; i < this.level7.length; i++) {
      if (this.level7[i]['lvl7_cd'] == this.HierSelectObj['lvl7_cd']) {
        this.HierSelectObj['lvl7_value'] = this.level7[i]['lvl7_value']
      }
    }

    await this.makingLeafValues()



  }

  async makingLeafValues() {

    if (this.HierSelectObj['lvl7_cd'] != undefined && this.HierSelectObj['lvl7_cd'] != '' && this.HierSelectObj['lvl7_cd'] != null) {
      this.HierSelectObj['leaf_cd'] = this.HierSelectObj['lvl7_cd']
      this.HierSelectObj['leaf_value'] = this.HierSelectObj['lvl7_value']
    } else if (this.HierSelectObj['lvl6_cd'] != undefined && this.HierSelectObj['lvl6_cd'] != '' && this.HierSelectObj['lvl6_cd'] != null) {
      this.HierSelectObj['leaf_cd'] = this.HierSelectObj['lvl6_cd']
      this.HierSelectObj['leaf_value'] = this.HierSelectObj['lvl6_value']
    } else if (this.HierSelectObj['lvl5_cd'] != undefined && this.HierSelectObj['lvl5_cd'] != '' && this.HierSelectObj['lvl5_cd'] != null) {
      this.HierSelectObj['leaf_cd'] = this.HierSelectObj['lvl5_cd']
      this.HierSelectObj['leaf_value'] = this.HierSelectObj['lvl5_value']
    } else if (this.HierSelectObj['lvl4_cd'] != undefined && this.HierSelectObj['lvl4_cd'] != '' && this.HierSelectObj['lvl4_cd'] != null) {
      this.HierSelectObj['leaf_cd'] = this.HierSelectObj['lvl4_cd']
      this.HierSelectObj['leaf_value'] = this.HierSelectObj['lvl4_value']
    } else if (this.HierSelectObj['lvl3_cd'] != undefined && this.HierSelectObj['lvl3_cd'] != '' && this.HierSelectObj['lvl3_cd'] != null) {
      this.HierSelectObj['leaf_cd'] = this.HierSelectObj['lvl3_cd']
      this.HierSelectObj['leaf_value'] = this.HierSelectObj['lvl3_value']
    } else if (this.HierSelectObj['lvl2_cd'] != undefined && this.HierSelectObj['lvl2_cd'] != '' && this.HierSelectObj['lvl2_cd'] != null) {
      this.HierSelectObj['leaf_cd'] = this.HierSelectObj['lvl2_cd']
      this.HierSelectObj['leaf_value'] = this.HierSelectObj['lvl2_value']
    } else if (this.HierSelectObj['lvl1_cd'] != undefined && this.HierSelectObj['lvl1_cd'] != '' && this.HierSelectObj['lvl1_cd'] != null) {
      this.HierSelectObj['leaf_cd'] = this.HierSelectObj['lvl1_cd']
      this.HierSelectObj['leaf_value'] = this.HierSelectObj['lvl1_value']
    }

  }



  SubmitSelectedListHier() {
    let levelnum = 0
    for (let i = 1; i < 8; i++) {
      if (this.HierSelectObj['lvl' + i + "_cd"] != null && this.HierSelectObj['lvl' + i + "_cd"] != '') {
        levelnum = i
      }
    }
    if (this.hier_type == 'budget') {
      for (let i = 0; i < this.allBudgetHier.length; i++) {
        if (this.allBudgetHier[i]['leaf_cd'] == this.HierSelectObj['lvl' + levelnum + '_cd']) {
          this.obj['bud_desc'] = this.allBudgetHier[i]['desc'];
          this.obj['bud_cd'] = this.allBudgetHier[i]['leaf_cd'];
          this.obj['bud_lvl'] = this.allBudgetHier[i]['level'];
          this.obj['bud_obj'] = this.allBudgetHier[i]
        }
      }
    } else if (this.hier_type == 'activity') {
      for (let i = 0; i < this.allActivityHier.length; i++) {
        if (this.allActivityHier[i]['leaf_cd'] == this.HierSelectObj['lvl' + levelnum + '_cd']) {
          this.obj['act_desc'] = this.allActivityHier[i]['desc'];
          this.obj['act_cd'] = this.allActivityHier[i]['leaf_cd'];
          this.obj['act_lvl'] = this.allActivityHier[i]['level'];
          this.obj['act_obj'] = this.allActivityHier[i]

        }
      }
    } else if (this.hier_type == 'project') {
      for (let i = 0; i < this.allProjectHier.length; i++) {
        if (this.allProjectHier[i]['leaf_cd'] == this.HierSelectObj['lvl' + levelnum + '_cd']) {
          this.obj['proj_desc'] = this.allProjectHier[i]['desc'];
          this.obj['proj_cd'] = this.allProjectHier[i]['leaf_cd'];
          this.obj['proj_lvl'] = this.allProjectHier[i]['level'];
          this.obj['proj_obj'] = this.allProjectHier[i]

        }
      }
    } else if (this.hier_type == 'product') {
      for (let i = 0; i < this.allProductHier.length; i++) {
        if (this.allProductHier[i]['leaf_cd'] == this.HierSelectObj['lvl' + levelnum + '_cd']) {
          this.obj['prod_cd'] = this.allProductHier[i]['leaf_cd'];
          this.obj['prod_desc'] = this.allProductHier[i]['desc'];
          this.obj['prod_lvl'] = this.allProductHier[i]['level'];
          this.obj['prod_obj'] = this.allProductHier[i]

        }
      }
    }
    $('#select').modal('hide');

  }



  // async Select(type) {
  //   $('#select').modal('show');
  //   this.hier_type = type;
  //   if (type == 'budget') {
  //     this.Hier = this.allBudgetHier;
  //   } else if (type == 'activity') {
  //     this.Hier = this.allActivityHier;
  //   } else if (type == 'project') {
  //     this.Hier = this.allProjectHier;
  //   } else if (type == 'product') {
  //     this.Hier = this.allProductHier;
  //   }
  //   this.HierSelectObj = {}
  //   await this.getLevel1();
  // }

  async Select(type) {
    $('#select').modal('show');
    this.hier_type = type;
    let ob={}
    if (type == 'budget') {
      this.Hier = this.allBudgetHier; 
      if(this.obj['bud_cd']!=null && this.obj['bud_cd']!='' && this.obj['bud_cd']!=undefined){

        ob=this.hierobj['budget'][this.obj['bud_cd']]
      
        console.log(ob)

      } 
    } else if (type == 'activity') {
      this.Hier = this.allActivityHier;
      if(this.obj['act_cd']!=null && this.obj['act_cd']!=''){

        ob=this.hierobj['activity'][this.obj['act_cd']]}

    } else if (type == 'project') {
      this.Hier = this.allProjectHier;
      if(this.obj['proj_cd']!=null && this.obj['proj_cd']!=''){

        ob=this.hierobj['project'][this.obj['proj_cd']]}
    } else if (type == 'product') {
      this.Hier = this.allProductHier;
      if(this.obj['prod_cd']!=null && this.obj['prod_cd']!=''){

        ob=this.hierobj['product'][this.obj['prod_cd']]}
    }
    this.HierSelectObj = {}
    await this.getLevel1();
    if(Object.keys(ob).length!=0){
      this.HierSelectObj=Object.assign({},ob)
      await  this.onChangeLvl1()
      this.HierSelectObj=Object.assign({},ob)

      await    this.onChangeLvl2()
      this.HierSelectObj=Object.assign({},ob)

      await   this.onChangeLvl3()
      this.HierSelectObj=Object.assign({},ob)

      await  this.onChangeLvl4()
      this.HierSelectObj=Object.assign({},ob)

      await   this.onChangeLvl5()
      this.HierSelectObj=Object.assign({},ob)

      await  this.onChangeLvl6()
      this.HierSelectObj=Object.assign({},ob)

      await   this.onChangeLvl7()


        }
  }

  allBudget = [];
  allProject = [];
  allProduct = [];
  allActivity = [];

  // setData() {

  //   this.allBudget = [];
  //   var temp = [];
  //   for (let i = 0; i < this.allBudgetHier.length; i++) {
  //     for (let j = 1; j <= 7; j++) {
  //       var obj = new Object();
  //       obj['code'] = this.allBudgetHier[i]['lvl' + j + "_cd"]
  //       obj['value'] = this.allBudgetHier[i]['lvl' + j + "_value"]
  //       obj['level'] = j
  //       obj['desc'] = this.allBudgetHier[i]['lvl' + j + "_cd"] + " - " + this.allBudgetHier[i]['lvl' + j + "_value"] + " - " + 'Level ' + j;
  //       if ((temp.indexOf(this.allBudgetHier[i]['lvl' + j + "_cd"]) < 0) && this.allBudgetHier[i]['lvl' + j + "_cd"] != null) {
  //         this.allBudget.push(obj);
  //         temp.push(this.allBudgetHier[i]['lvl' + j + "_cd"])
  //       }
  //     }

  //     var obj = new Object();
  //     obj['code'] = this.allBudgetHier[i]['leaf_cd']
  //     obj['value'] = this.allBudgetHier[i]['leaf_value']
  //     obj['level'] = 'L'
  //     obj['desc'] = this.allBudgetHier[i]['leaf_cd'] + " - " + this.allBudgetHier[i]['leaf_value'] + " - Leaf";
  //     var p = temp.indexOf(this.allBudgetHier[i]['leaf_cd'])
  //     this.allBudget.splice(p, 1)
  //     this.allBudget.push(obj)
  //   }

  //   temp = []
  //   this.allProduct = [];
  //   for (let i = 0; i < this.allProductHier.length; i++) {
  //     for (let j = 1; j <= 7; j++) {
  //       var obj = new Object();
  //       obj['code'] = this.allProductHier[i]['lvl' + j + "_cd"]
  //       obj['value'] = this.allProductHier[i]['lvl' + j + "_value"]
  //       obj['level'] = j
  //       obj['desc'] = this.allProductHier[i]['lvl' + j + "_cd"] + " - " + this.allProductHier[i]['lvl' + j + "_value"] + " - " + 'Level ' + j;
  //       if ((temp.indexOf(this.allProductHier[i]['lvl' + j + "_cd"]) < 0) && this.allProductHier[i]['lvl' + j + "_cd"] != null) {
  //         this.allProduct.push(obj);
  //         temp.push(this.allProductHier[i]['lvl' + j + "_cd"])
  //       }
  //     }
  //     var obj = new Object();
  //     obj['code'] = this.allProductHier[i]['leaf_cd']
  //     obj['value'] = this.allProductHier[i]['leaf_value']
  //     obj['level'] = 'L'
  //     obj['desc'] = this.allProductHier[i]['leaf_cd'] + " - " + this.allProductHier[i]['leaf_value'] + " - Leaf";
  //     var p = temp.indexOf(this.allProductHier[i]['leaf_cd'])
  //     this.allProduct.splice(p, 1)
  //     this.allProduct.push(obj);
  //   }

  //   temp = [];
  //   this.allProject = [];
  //   for (let i = 0; i < this.allProjectHier.length; i++) {
  //     for (let j = 1; j <= 7; j++) {
  //       var obj = new Object();
  //       obj['code'] = this.allProjectHier[i]['lvl' + j + "_cd"]
  //       obj['value'] = this.allProjectHier[i]['lvl' + j + "_value"]
  //       obj['level'] = j
  //       obj['desc'] = this.allProjectHier[i]['lvl' + j + "_cd"] + " - " + this.allProjectHier[i]['lvl' + j + "_value"] + " - " + 'Level ' + j;
  //       if ((temp.indexOf(this.allProjectHier[i]['lvl' + j + "_cd"]) < 0) && this.allProjectHier[i]['lvl' + j + "_cd"] != null) {
  //         this.allProject.push(obj);
  //         temp.push(this.allProjectHier[i]['lvl' + j + "_cd"])
  //       }
  //     }
  //     var obj = new Object();
  //     obj['code'] = this.allProjectHier[i]['leaf_cd']
  //     obj['value'] = this.allProjectHier[i]['leaf_value']
  //     obj['level'] = 'L'
  //     obj['desc'] = this.allProjectHier[i]['leaf_cd'] + " - " + this.allProjectHier[i]['leaf_value'] + " - Leaf";
  //     var p = temp.indexOf(this.allProjectHier[i]['leaf_cd'])
  //     this.allProject.splice(p, 1)
  //     this.allProject.push(obj);

  //   }

  //   temp = [];
  //   this.allActivity = [];
  //   for (let i = 0; i < this.allActivityHier.length; i++) {
  //     for (let j = 1; j <= 7; j++) {
  //       var obj = new Object();
  //       obj['code'] = this.allActivityHier[i]['lvl' + j + "_cd"]
  //       obj['value'] = this.allActivityHier[i]['lvl' + j + "_value"]
  //       obj['level'] = j
  //       obj['desc'] = this.allActivityHier[i]['lvl' + j + "_cd"] + " - " + this.allActivityHier[i]['lvl' + j + "_value"] + " - " + 'Level ' + j;
  //       if ((temp.indexOf(this.allActivityHier[i]['lvl' + j + "_cd"]) < 0) && this.allActivityHier[i]['lvl' + j + "_cd"] != null) {
  //         this.allActivity.push(obj);
  //         temp.push(this.allActivityHier[i]['lvl' + j + "_cd"])
  //       }
  //     }
  //     var obj = new Object();
  //     obj['code'] = this.allActivityHier[i]['leaf_cd']
  //     obj['value'] = this.allActivityHier[i]['leaf_value']
  //     obj['level'] = 'L'
  //     obj['desc'] = this.allActivityHier[i]['leaf_cd'] + " - " + this.allActivityHier[i]['leaf_value'] + " - Leaf";
  //     var p = temp.indexOf(this.allActivityHier[i]['leaf_cd'])
  //     this.allActivity.splice(p, 1)
  //     this.allActivity.push(obj)

  //   }

  // }






  open_event_popup() {
    $('#myModal').modal('show');

  }
  hierobj = {budget:{},activity:{},product:{},project:{}}

  budgetObj = {}
  async getAllBudget() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name'] = 'bud_hier';
    var resp = await this.hierarchyService.getBudgetHierarchy(obj);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.allBudgetHier = resp.data;

      for (let i = 0; i < this.allBudgetHier.length; i++) {
        console.log(this.allBudgetHier[i])
        let str = ""
        for (let j = 1; j < 8; j++) {
          if (this.allBudgetHier[i]['lvl' + j + "_cd"] != null && this.allBudgetHier[i]['lvl' + j + "_cd"] != "") {
            str += this.allBudgetHier[i]['lvl' + j + "_value"] + " > "

          }
        }

        str = str.substring(0, str.length - 2)
        this.allBudgetHier[i]['desc'] = str;
        this.budgetObj[this.allBudgetHier[i]['leaf_cd']] = str
        this.hierobj['budget'][this.allBudgetHier[i]['leaf_cd']]=this.allBudgetHier[i]

      }
    } else {
      this.spinner.hide()

    }
  }
  activityObj = {}
  async getAllActivity() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name'] = 'activity_hier';
    var resp = await this.hierarchyService.getActivityHierarchy(obj);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.allActivityHier = resp.data;
      for (let i = 0; i < this.allActivityHier.length; i++) {
        console.log(this.allActivityHier[i])
        let str = ""
        for (let j = 1; j < 8; j++) {
          if (this.allActivityHier[i]['lvl' + j + "_cd"] != null && this.allActivityHier[i]['lvl' + j + "_cd"] != "") {
            str += this.allActivityHier[i]['lvl' + j + "_value"] + " > "

          }
        }

        str = str.substring(0, str.length - 2)
        this.allActivityHier[i]['desc'] = str;
        this.activityObj[this.allActivityHier[i]['leaf_cd']] = str
        this.hierobj['activity'][this.allActivityHier[i]['leaf_cd']]=this.allActivityHier[i]

      }
    } else {
      this.spinner.hide()
    }
  }

  projectObj = {}
  async getAllProject() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name'] = 'proj_hier';
    var resp = await this.hierarchyService.getProjectHierarchy(obj);
    if (resp['error'] == false) {
      this.allProjectHier = resp.data;
      for (let i = 0; i < this.allProjectHier.length; i++) {
        console.log(this.allProjectHier[i])
        let str = ""
        for (let j = 1; j < 8; j++) {
          if (this.allProjectHier[i]['lvl' + j + "_cd"] != null && this.allProjectHier[i]['lvl' + j + "_cd"] != "") {
            str += this.allProjectHier[i]['lvl' + j + "_value"] + " > "

          }
        }

        str = str.substring(0, str.length - 2)
        this.allProjectHier[i]['desc'] = str;
        this.projectObj[this.allProjectHier[i]['leaf_cd']] = str
        this.hierobj['project'][this.allProjectHier[i]['leaf_cd']]=this.allProjectHier[i]

      }
    } else {
    }
  }

  productObj = {}
  async getAllProduct() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name'] = 'prod_hier';
    var resp = await this.hierarchyService.getProductHierarchy(obj);
    if (resp['error'] == false) {
      this.allProductHier = resp.data;
      for (let i = 0; i < this.allProductHier.length; i++) {
        console.log(this.allProductHier[i])
        let str = ""
        for (let j = 1; j < 8; j++) {
          if (this.allProductHier[i]['lvl' + j + "_cd"] != null && this.allProductHier[i]['lvl' + j + "_cd"] != "") {
            str += this.allProductHier[i]['lvl' + j + "_value"] + " > "

          }
        }

        str = str.substring(0, str.length - 2)
        this.allProductHier[i]['desc'] = str;
        this.productObj[this.allProductHier[i]['leaf_cd']] = str
        this.hierobj['product'][this.allProductHier[i]['leaf_cd']]=this.allProductHier[i]

      }
    } else {
    }
  }

  ///***************************************Select Event New  Code**************************************///


  async getAllEventLayouts() {
    this.spinner.show()
    var resp = await this.EventsService.getEventLayoutss(this.b_acct_id);
    if (resp['error'] == false) {
      this.allEventLayouts = resp.data;
      this.spinner.hide()
    } else {
      this.spinner.hide()
      this.snackBar.open("Error while getting Event Records", 'Error', {
        duration: 5000
      });
    }
  }

  async getallFields() {
    var obj = new Object();
    obj['domain_code'] = 'ACCOUNT';
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.journalService.getFields(obj);
    this.allFields = [];
    if (resp['error'] == false) {
      this.allFields = resp.data;
      this.fieldTechNameTOBusinessName = {};

      for (let i = 0; i < this.allFields.length; i++) {
        this.fieldTechnicalNames[this.allFields[i]['field_code']] = this.allFields[i]['field_technical_name']
        this.fieldBusinessNames[this.allFields[i]['field_code']] = this.allFields[i]['field_business_name'];
        this.fieldTechNameTOBusinessName[this.allFields[i]['field_technical_name']] = this.allFields[i]['field_business_name']

      }
    } else {
      this.snackBar.open("Error while getting Fields", "Error", {
        duration: 5000,
      });
    }
  }


  async getJouranlDetals() {
    var resp = await this.journalService.getJournal(this.b_acct_id);
    if (resp['error'] == false) {
      var journal_dtl = resp.data[0];

      var jrnl_fileds_code = [];
      jrnl_fileds_code = journal_dtl.field_code.split(",");
      this.journalFieldsCodes = [];
      for (let i = 0; i < jrnl_fileds_code.length; i++) {
        this.journalFieldsCodes.push(jrnl_fileds_code[i]);
      }


    } else {
      this.snackBar.open("Error while getting Journal Records", "Error", {
        duration: 5000,
      });
    }
  }
  tempObj = new Object;
  async makeJournalObj() {
    this.journalObjArray = [];
    //var journalObjArray1 = [];
    for (let i = 0; i < this.journalFieldsCodes.length; i++) {
      if (this.askFields.includes(this.fieldTechnicalNames[this.journalFieldsCodes[i]])) {
        var obj = new Object();
        obj['value'] = this.defaultObj[this.fieldTechnicalNames[this.journalFieldsCodes[i]]];
        obj['type'] = 'field';
        obj['key'] = this.fieldTechnicalNames[this.journalFieldsCodes[i]]
        this.journalObjArray.push(Object.assign({}, obj));

      } else {
        var obj = new Object();
        obj['value'] = '';
        obj['type'] = 'static';
        obj['key'] = this.fieldTechnicalNames[this.journalFieldsCodes[i]]
        this.journalObjArray.push(Object.assign({}, obj));

      }
    }


    var arr = [];
    var arr1 = []
    for (var i = 0; i < this.journalObjArray.length; i++) {
      var obj = new Object();
      obj = Object.assign({}, this.journalObjArray[i]);
      var objx = Object.assign({}, this.journalObjArray[i]);

      if (this.journalObjArray[i]['key'] == 'db_cd_ind') {
        obj['value'] = 'CR'
        objx['value'] = 'DB'

      }
      if (this.journalObjArray[i]['key'] == 'ledger_type') {
        obj['value'] = 'ACT'
        objx['value'] = 'ACT'

      }
      arr.push(obj);
      arr1.push(objx)
    }
    var obj1 = new Object();
    obj1['db_cd_ind'] = 'CR';
    obj1['chart_of_account'] = null;
    obj1['arr'] = arr
    var obj2 = new Object();
    obj2['db_cd_ind'] = 'DB';
    obj2['chart_of_account'] = null;
    obj2['arr'] = arr1
    this.obj.journals[0] = obj1;
    this.obj.journals[1] = obj2;
    console.log(this.obj.journals)

  }
  changeChartOfAccount(j) {
    this.selectedJournal = []
    var chart_of_account = this.obj.journals[j]['chart_of_account'];


    for (let i = 0; i < this.obj.journals[j]['arr'].length; i++) {
      if (this.obj.journals[j]['arr'][i]['key'] == 'chart_of_account') {
        this.obj.journals[j]['arr'][i]['value'] = chart_of_account;
      }


    }
  }
  changeDebitCreditIndicator(j) {
    this.selectedJournal = []
    var db_cr_ind = this.obj.journals[j]['db_cd_ind'];


    for (let i = 0; i < this.obj.journals[j]['arr'].length; i++) {
      if (this.obj.journals[j]['arr'][i]['key'] == 'db_cd_ind') {
        this.obj.journals[j]['arr'][i]['value'] = db_cr_ind;
      }


    }
  }

  changeJournal(i) {
    this.index = i
    this.selectedJournal = []
    console.log(this.obj.journals[i])
    var chart_of_account = this.obj.journals[i]['chart_of_account'];
    var db_cd_ind = this.obj.journals[i]['db_cd_ind'];

    var temp = this.obj.journals[i]['arr']
    this.selectedJournal = temp;
    console.log(this.selectedJournal)
    $('#myModal2').modal('show');
  }

  saveJournal() {
    this.obj.journals[this.index]['arr'] = [];
    for (let i = 0; i < this.selectedJournal.length; i++) {
      this.obj.journals[this.index]['arr'].push(Object.assign({}, this.selectedJournal[i]))
    }
  }
  COA_obj = {}
  COA_obj1={'db_cd_ind':{}}
  async getallChartOfAccount() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.chartOfAccountService.getChartOfAccountHierarchy(obj);
    if (resp['error'] == false) {
      this.allChartOfAccount = resp.data;

      for (let i = 0; i < this.allChartOfAccount.length; i++) {

        let str = ""
        for (let j = 1; j < 8; j++) {
          if (this.allChartOfAccount[i]['lvl' + j + "_code"] != null && this.allChartOfAccount[i]['lvl' + j + "_code"] != "") {
            str += this.allChartOfAccount[i]['lvl' + j + "_value"] + " > "

          }
        }

        str = str.substring(0, str.length - 2)
        this.allChartOfAccount[i]['desc'] = str;
        this.COA_obj[this.allChartOfAccount[i]['leaf_code']] = str
        this.COA_obj1['db_cd_ind'][this.allChartOfAccount[i]['leaf_code']]=this.allChartOfAccount[i]

      }
      this.spinner.hide();
    } else {
      this.spinner.hide()
      this.snackBar.open("Error while getting  all chart of account info", 'Error', {
        duration: 5000
      });
    }
  }

  async getAllEvent() {
    this.spinner.show()
    var obj = Object.assign({}, this.obj);
    obj['b_acct_id'] = this.b_acct_id
    this.spinner.show();
    var resp = await this.EventsService.getevents(obj);
    if (resp['error'] == false) {
      this.allEvents = resp.data;
      this.spinner.hide();
    } else {
      this.spinner.hide();
      this.snackBar.open("Error occured while getting Events", 'Error', {
        duration: 5000,
      });
    }
  }

  addRow() {

    var arr = [];
    var arr1 = []
    for (var i = 0; i < this.journalObjArray.length; i++) {
      var obj = new Object();
      obj = Object.assign({}, this.journalObjArray[i]);
      var objx = Object.assign({}, this.journalObjArray[i]);

      if (this.journalObjArray[i]['key'] == 'db_cd_ind') {
        obj['value'] = 'CR'
        objx['value'] = 'DB'

      }
      if (this.journalObjArray[i]['key'] == 'ledger_type') {
        obj['value'] = 'ACT'
        objx['value'] = 'ACT'

      }
      arr.push(obj);
      arr1.push(objx)
    }
    var obj1 = new Object();
    obj1['db_cd_ind'] = 'CR';
    obj1['chart_of_account'] = null;
    obj1['arr'] = arr
    var obj2 = new Object();
    obj2['db_cd_ind'] = 'DB';
    obj2['chart_of_account'] = null;
    obj2['arr'] = arr1
    this.obj.journals.push(obj1)
    this.obj.journals.push(obj2)
  }

  deleteRow(i) {
    this.obj.journals.splice(i, 2)
  }

  async getAllRuleList() {
    this.spinner.show()
    console.log(this.obj);
    var resp = await this.ruleService.getAllRules(this.b_acct_id);
    if (resp['error'] == false) {
      this.allRule = resp.data;
      this.datasource = new MatTableDataSource(this.allRule)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
      this.spinner.hide();
    } else {
      this.spinner.hide()
      this.snackBar.open("Error while getting  all rule list", 'Error', {
        duration: 5000
      });
    }
  }

  refresh() {
    this.obj = {
      id: '',
      ruleDesc: '',
      rulePriority: 0,
      when: [{ condition: 'AND', key: "event_code", value: '', operator: '==' }],
      journals: [{}, {}],
    };
  };


  refresh1() {
    this.obj = {
      id: '',
      ruleDesc: '',
      rulePriority: 0,
      when: [{ condition: 'AND', key: "event_code", value: '', operator: '==' }],
      journals: [{}, {}],
     
    };
   
    var arr = [];
    var arr1 = []
    for (var i = 0; i < this.journalObjArray.length; i++) {
      var obj = new Object();

      obj = Object.assign({}, this.journalObjArray[i]);
      var objx = Object.assign({}, this.journalObjArray[i]);

      if (this.journalObjArray[i]['key'] == 'db_cd_ind') {
        obj['value'] = 'CR'
        objx['value'] = 'DB'

      }

      if (this.journalObjArray[i]['key'] == 'ledger_type') {
        obj['value'] = 'ACT'
        objx['value'] = 'ACT'

      }
      arr.push(obj);
      arr1.push(objx)
    }
    var obj1 = new Object();
    obj1['db_cd_ind'] = 'CR';
    obj1['chart_of_account'] = null;
    obj1['arr'] = arr
    var obj2 = new Object();
    obj2['db_cd_ind'] = 'DB';
    obj2['chart_of_account'] = null;
    obj2['arr'] = arr1
    this.obj.journals[0] = obj1;
    this.obj.journals[1] = obj2;


  }

 

  condition = [{ code: 'OR', value: 'OR' }, { code: 'AND', value: 'AND' }]

  async refresh2() {
    this.stepper.selectedIndex=0;
  };

  async save() {
    this.spinner.show();
    var obj1 = new Object();
    console.log(this.obj);
    
    obj1['b_acct_id'] = this.b_acct_id;
    obj1['rule_name'] = this.obj['ruleDesc'];
    obj1['priority'] = this.obj['rulePriority'];
    obj1["debit"] = []
    obj1["credit"] = []
    for (let i = 0; i < this.obj['journals'].length; i++) {
      if (this.obj['journals'][i]['db_cd_ind'] == 'DB') {
        obj1["debit"].push(this.obj['journals'][i]['chart_of_account'])
      } else {
        obj1["credit"].push(this.obj['journals'][i]['chart_of_account'])

      }
    }
    obj1["coa_debit"] = JSON.stringify(obj1["debit"])
    obj1["coa_credit"] = JSON.stringify(obj1["credit"])
    obj1['rule_data'] = JSON.stringify({ event_desc: this.obj['event_desc'], when: this.obj['when'], then: this.obj['journals'] });
    obj1['event_code'] = this.obj['act_cd'] + this.obj['bud_cd'] + this.obj['prod_cd'] + this.obj['proj_cd'];
    obj1['create_user_id'] = this.erpUser.user_id;
    obj1['proj_cd'] = this.obj['proj_cd'];
    obj1['prod_cd'] = this.obj['prod_cd'];
    obj1['act_cd'] = this.obj['act_cd'];
    obj1['bud_cd'] = this.obj['bud_cd'];

    if(this.obj['journals'][0]['arr'].length==0){
      this.snackBar.open("Some error occured. Please refresh the page.", 'Error', {
        duration: 5000
      });
      return;
    }
    var resp = await this.ruleService.createRule(obj1);
    console.log('respppp',resp)

    if (resp['error'] == false) {
      await this.getAllRuleList();
      this.spinner.hide();
      this.snackBar.open("Rule Created Successfully!!", 'Success!', {
        duration: 5000
      });
      await this.refresh2();
      await this.refresh1();

     
    } else {
      
      this.spinner.hide()
      this.snackBar.open("Error while creating rule", 'Error', {
        duration: 5000
      });
      await this.refresh2();
    }

  }



  async open_update(element) {
    this.create_flag=false;
    this.list_flag=false;
    this.update_flag=true
    this.test_flag=false;

    this.obj['ruleDesc'] = element['rule_name'];
    this.obj['rulePriority'] = element['priority'];
    this.obj['id'] = element['id'];
    this.obj['event_code'] = element['event_code'];
    var data = JSON.parse(element['rule_data']);
    this.obj['journals'] = data['then'];
    this.obj['when'] = data['when'];
    this.obj['event_desc'] = data['event_desc'];
    this.obj['proj_cd'] = element['proj_cd'];
    this.obj['prod_cd'] = element['prod_cd'];
    this.obj['act_cd'] = element['act_cd'];
    this.obj['bud_cd'] = element['bud_cd'];
    this.eventChange();
   
    $('.nav-tabs a[href="#tab-3"]').tab('show');
  }

  async update() {
    this.spinner.show();
    var obj1 = new Object();
    obj1['b_acct_id'] = this.b_acct_id;
    obj1['rule_name'] = this.obj['ruleDesc'];
    obj1['priority'] = this.obj['rulePriority'];
    obj1['id'] = this.obj['id'];
    obj1['rule_data'] = JSON.stringify({ event_desc: this.obj['event_desc'], when: this.obj['when'], then: this.obj['journals'] });
    obj1['event_code'] = this.obj['event_code'];
    obj1['update_user_id'] = this.erpUser.user_id;
    obj1["debit"] = []
    obj1["credit"] = []
    for (let i = 0; i < this.obj['journals'].length; i++) {
      if (this.obj['journals'][i]['db_cd_ind'] == 'DB') {
        obj1["debit"].push(this.obj['journals'][i]['chart_of_account'])
      } else {
        obj1["credit"].push(this.obj['journals'][i]['chart_of_account'])

      }
    }
    obj1["coa_debit"] = JSON.stringify(obj1["debit"])
    obj1["coa_credit"] = JSON.stringify(obj1["credit"])
    obj1['proj_cd'] = this.obj['proj_cd'];
    obj1['prod_cd'] = this.obj['prod_cd'];
    obj1['act_cd'] = this.obj['act_cd'];
    obj1['bud_cd'] = this.obj['bud_cd'];
    var resp = await this.ruleService.updateRule(obj1);

    if (resp['error'] == false) {
      await this.getAllRuleList();
      this.spinner.hide();
      this.snackBar.open("Rule Update Successfully!!", 'Success!', {
        duration: 5000
      });
      await this.refresh2();
    } else {
    
      this.spinner.hide();
      this.snackBar.open("Error while updating rule", 'Error', {
        duration: 5000
      });
      await this.refresh2();
    }
  }



  async delete(element) {
    this.spinner.show();
    var obj1 = new Object();
    obj1['b_acct_id'] = this.b_acct_id;
    obj1['id'] = element['id'];
    var resp = await this.ruleService.deleteRule(JSON.stringify(obj1));
    if (resp['error'] == false) {
      await this.getAllRuleList();
      this.snackBar.open("Rule Delete Successfully!!", 'Success!', {
        duration: 5000
      });
      this.spinner.hide();
    } else {
      this.spinner.hide()
      this.snackBar.open("Error while deleting rule", 'Error', {
        duration: 5000
      });
    }

  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  eventChange() {
    var selectedLayout = 'R101'
    this.selectLayoutFields = []

    // for (let i = 0; i < this.allEvents.length; i++) {

    //   if (this.allEvents[i]['event_code'] == this.obj['event_code']) {
    //     
    //   }
    // }
    for (let j = 0; j < this.allEventLayouts.length; j++) {
      if ("R101" == this.allEventLayouts[j]['record_code']) {
        selectedLayout = this.allEventLayouts[j]
      }
    }
    let fieldsCodes = selectedLayout['field_code'].split(",")

    for (let i = 0; i < fieldsCodes.length; i++) {
      let ob = new Object
      ob['code'] = this.fieldTechnicalNames[fieldsCodes[i]]
      ob['value'] = fieldsCodes[i] + " - " + this.fieldBusinessNames[fieldsCodes[i]] + " - " + this.fieldTechnicalNames[fieldsCodes[i]]
      this.selectLayoutFields.push(ob)
    }
    this.obj['when'][0]['value'] = this.obj['event_code'];
  }

  changeEvent() {
    $('#myModal1').modal('show');
  }


  addwhenCondition() {
    this.obj['when'].push({ condition: '', key: '', value: '', operator: '' })
  }
  deletewhenCondition(i) {
    this.obj['when'].splice(i, 1)
  }

  async show(){

    var obj2 = new Object();
    obj2["debit"] = []
    obj2["credit"] = []
    for (let i = 0; i < this.obj['journals'].length; i++) {
      if (this.obj['journals'][i]['db_cd_ind'] == 'DB') {
        obj2["debit"].push(this.obj['journals'][i]['chart_of_account'])
      } else {
        obj2["credit"].push(this.obj['journals'][i]['chart_of_account'])

      }
    }

  }

}
function resetStepper(stepper: any) {
  throw new Error('Function not implemented.');
}

