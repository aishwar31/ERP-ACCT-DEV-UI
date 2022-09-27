import { Component, OnInit, ViewChild } from '@angular/core';

import { ExcelService } from '../../../service/file-export.service';
import { HierarchyService } from '../../../service/hierarchy.service';
import { LedgerService } from '../../../service/ledger.service';
import { MainService } from '../../../service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { OrgHierService } from '../../../service/org-hier.service'
import { Router } from '@angular/router';
import { bindCallback } from 'rxjs';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import swal from 'sweetalert2';

declare var $: any

 
 
@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {


  constructor( private orgHierService: OrgHierService,private hierarchyService: HierarchyService, private excel: ExcelService, public mainService: MainService, private ledgerService: LedgerService, private router: Router, private spinner: NgxSpinnerService, private snackBar: MatSnackBar) { }
  erpUser;
  b_acct_id;
  obj = {};

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  displayedColumns = ['id', 'lvl1_code', 'lvl1_value', 'lvl2_code', 'lvl2_value', 'lvl3_code',
    'lvl3_value', 'lvl4_code', 'lvl4_value', 'lvl5_code', 'lvl5_value', 'lvl6_code', 'lvl6_value',
    'lvl7_code', 'lvl7_value', 'cr', 'db'];
  datasource;

  Obj = {}

  keysArr = ['lvl1_code', 'lvl1_value', 'lvl2_code', 'lvl2_value', 'lvl3_code',
    'lvl3_value', 'lvl4_code', 'lvl4_value', 'lvl5_code', 'lvl5_value', 'lvl6_code', 'lvl6_value',
    'lvl7_code', 'lvl7_value', 'leaf_code', 'leaf_value'];


  TrailBalance
  ledger = [{ code: 'A', value: 'A' }, { code: 'B', value: 'B' }]

  reportData = [];

  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    await this.getOrgHier()
  }
  amounttoINRConvert(amount) {
    var negative = false;
    if (amount < 0) {
      amount = amount * (-1);
      negative = true;
    }

    var y = amount.toFixed(2);
    var x = y.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
      afterPoint = x.substring(x.indexOf('.'), x.length);
    var x1 = Math.floor(y);
    var x2 = x1.toString();
    var lastThree = x2.substring(x2.length - 3);
    var otherNumbers = x2.substring(0, x2.length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    if (negative == true) {
      res = "-" + res
    }
    return res;
  }
  orgObj={};
  orgHierarchy=[];
  async getOrgHier() {
    
    var ob = new Object;
    ob['b_acct_id'] = this.b_acct_id
    ob['org_hier_code'] = 'FIN'

    var resp = await this.orgHierService.getHierarchy(ob);
    console.log(resp);

    if (resp['error'] == false) {
      let orghier = resp['data']
       let costCenter=[]
       let lvlcodes=[]
       for(let i=0;i<orghier.length;i++){
        // console.log(orghier[i])
         let str=""
         for(let j=1;j<8;j++){
           if(orghier[i]['lvl'+j+"_cd"]!=null && orghier[i]['lvl'+j+"_cd"]!=""){
             str +=orghier[i]['lvl'+j+"_value"]+" > "
   
           }
           if(orghier[i]['is_cc']==1){
           //  console.log("inside")
             if(orghier[i]['lvl'+j+"_cd"]!=null && orghier[i]['lvl'+j+"_cd"]!=""){
              // console.log(orghier[i]['lvl'+j+"_cd"])
               if(!lvlcodes.includes(orghier[i]['lvl'+j+"_cd"])){
                 lvlcodes.push(orghier[i]['lvl'+j+"_cd"])
   
               }
             }
           }
         }
         
         str=str.substring(0,str.length-2)
         orghier[i]['desc']=str;
         this.orgObj[orghier[i]['leaf_cd']]=str
   
   
       }
       for(let i=0;i<orghier.length;i++){
         if(lvlcodes.includes(orghier[i]['leaf_cd'])){
           costCenter.push(orghier[i])
         }
       }
      // console.log(costCenter)
       this.orgHierarchy=costCenter
       this.spinner.hide()

     }
    else {
      console.log('ERROR')
      this.spinner.hide()
      swal.fire("Error", "...", resp['data']);

    }

  }
  Hier=[]
  HierSelectObj={}
  async selectorg(){

    $('#selectOrg').modal('show');
    let ob={}

    this.Hier = this.orgHierarchy;
    if(this.obj['org_cd']!=null && this.obj['org_cd']!=''){

      ob=this.orgObj['org_cd']
    
 

    }
    this.HierSelectObj={}
    await this.getLevel1();
    if(Object.keys(ob).length!=0){
      this.HierSelectObj=Object.assign({},ob)
      await   this.onChangeLvl1()
      this.HierSelectObj=Object.assign({},ob)

      await  this.onChangeLvl2()
      this.HierSelectObj=Object.assign({},ob)

      await   this.onChangeLvl3()
      this.HierSelectObj=Object.assign({},ob)

      await this.onChangeLvl4()
      this.HierSelectObj=Object.assign({},ob)

      await  this.onChangeLvl5()
      this.HierSelectObj=Object.assign({},ob)

      await  this.onChangeLvl6()
      this.HierSelectObj=Object.assign({},ob)

      await this.onChangeLvl7()


        }
  }
  level1 = [];
  level2 = [];
  level3 = [];
  level4 = [];
  level5 = [];
  level6 = [];
  level7 = [];
  hier_type;
  async getLevel1() {
    this.level1 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl1_cd']==this.Hier[i]['leaf_cd']) {
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
    if(this.HierSelectObj['lvl1_cd']=='' || this.HierSelectObj['lvl1_cd']==null){
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level1.length; i++) {
      if (this.level1[i]['lvl1_cd'] == this.HierSelectObj['lvl1_cd']) {
        this.HierSelectObj['lvl1_value'] = this.level1[i]['lvl1_value']
        if (this.level1[i]['is_leaf'] == 1) {
          console.log(this.level1[i])
          await this.makingLeafValues()
        }else{
          this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level2 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl1_cd'] == this.HierSelectObj['lvl1_cd'] && this.Hier[i]['lvl2_cd'] != null) {
        if (this.Hier[i]['lvl2_cd']==this.Hier[i]['leaf_cd']) {
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
  async  onChangeLvl2() {
    if(this.HierSelectObj['lvl2_cd']=='' || this.HierSelectObj['lvl2_cd']==null){
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level2.length; i++) {
      if (this.level2[i]['lvl2_cd'] == this.HierSelectObj['lvl2_cd']) {
        this.HierSelectObj['lvl2_value'] = this.level2[i]['lvl2_value']
        if (this.level2[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        }else{
          this.HierSelectObj['leaf_cd'] = ""
           this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level3 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl2_cd'] == this.HierSelectObj['lvl2_cd'] && this.Hier[i]['lvl3_cd'] != null) {
        if (this.Hier[i]['lvl3_cd']==this.Hier[i]['leaf_cd']) {
        
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

  async  onChangeLvl3() {
    if(this.HierSelectObj['lvl3_cd']=='' || this.HierSelectObj['lvl3_cd']==null){
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level3.length; i++) {
      if (this.level3[i]['lvl3_cd'] == this.HierSelectObj['lvl3_cd']) {
        this.HierSelectObj['lvl3_value'] = this.level3[i]['lvl3_value']
        if (this.level3[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        }else{
          this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level4 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl3_cd'] == this.HierSelectObj['lvl3_cd'] && this.Hier[i]['lvl4_cd'] != null) {
        if (this.Hier[i]['lvl4_cd']==this.Hier[i]['leaf_cd']) {
          
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

  async   onChangeLvl4() {
    if(this.HierSelectObj['lvl4_cd']=='' || this.HierSelectObj['lvl4_cd']==null){
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level4.length; i++) {
      if (this.level4[i]['lvl4_cd'] == this.HierSelectObj['lvl4_cd']) {
        this.HierSelectObj['lvl4_value'] = this.level4[i]['lvl4_value']
        if (this.level4[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        }else{
          this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level5 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl4_cd'] == this.HierSelectObj['lvl4_cd'] && this.Hier[i]['lvl5_cd'] != null) {
        if (this.Hier[i]['lvl5_cd']==this.Hier[i]['leaf_cd']) {
        
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

  async   onChangeLvl5() {
    if(this.HierSelectObj['lvl5_cd']=='' || this.HierSelectObj['lvl5_cd']==null){
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level5.length; i++) {
      if (this.level5[i]['lvl5_cd'] == this.HierSelectObj['lvl5_cd']) {
        this.HierSelectObj['lvl5_value'] = this.level5[i]['lvl5_value']
        if (this.level5[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        }else{
          this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level6 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl5_cd'] == this.HierSelectObj['lvl5_cd'] && this.Hier[i]['lvl6_cd'] != null) {
        if (this.Hier[i]['lvl6_cd']==this.Hier[i]['leaf_cd']) {
          
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

  async  onChangeLvl6() {
    if(this.HierSelectObj['lvl7_cd']=='' || this.HierSelectObj['lvl7_cd']==null){
      this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
    }
    for (let i = 0; i < this.level6.length; i++) {
      if (this.level6[i]['lvl6_cd'] == this.HierSelectObj['lvl6_cd']) {
        this.HierSelectObj['lvl6_value'] = this.level6[i]['lvl6_value']
        if (this.level6[i]['is_leaf'] == 1) {
          await this.makingLeafValues()
        }else{
          this.HierSelectObj['leaf_cd'] = ""
      this.HierSelectObj['leaf_value'] = ""
        }
      }
    }
    let temp = []
    this.level7 = []
    for (let i = 0; i < this.Hier.length; i++) {
      if (this.Hier[i]['lvl6_cd'] == this.HierSelectObj['lvl6_cd'] && this.Hier[i]['lvl7_cd'] != null) {
        if (this.Hier[i]['lvl7_cd']==this.Hier[i]['leaf_cd']) {
          
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

  async  onChangeLvl7() {
   
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
  async SubmitSelectedListHier() {
    console.log(this.HierSelectObj)
    let levelnum=0
    for(let i=1;i<8;i++){
      if(this.HierSelectObj['lvl'+i+"_cd"]!=null && this.HierSelectObj['lvl'+i+"_cd"]!='' ){
        levelnum=i
      }
    }
    let cc_codes=[]
   
      for (let i = 0; i < this.orgHierarchy.length; i++) {
        if (this.orgHierarchy[i]['leaf_cd'] == this.HierSelectObj['lvl'+levelnum+'_cd']) {
          this.Obj['org_desc'] = this.orgHierarchy[i]['desc'];
          this.Obj['org_cd'] = this.orgHierarchy[i]['leaf_cd'];
          this.Obj['org_lvl'] =levelnum
          this.Obj['org_obj']=this.orgHierarchy[i]
        }
        if(this.HierSelectObj['lvl'+levelnum+'_cd']==this.orgHierarchy[i]['lvl'+levelnum+'_cd'] &&this.orgHierarchy[i]['is_cc'] ==1){
          cc_codes.push(this.orgHierarchy[i]['leaf_cd'])
        }
      }
      
console.log(this.obj)
console.log(cc_codes)
this.Obj['cc_arr']=cc_codes

    $('#select').modal('hide');


  }
  tbl = [];
  totaldb = 0;
  totalcr = 0;
  asset = [];
  liability = [];
  equity = [];
  income = [];
  expense = []
  totalbal = 0
  async getTrailBalance() {
    this.spinner.show()
    this.Obj['b_acct_id'] = this.b_acct_id;
    this.asset = [];
    this.liability = [];
    this.equity = [];
    this.income = [];
    this.expense = []
    this.tbl = [];
    this.totalcr = 0;
    this.totaldb = 0;
    var resp = await this.ledgerService.getTrailBalance(this.Obj);
    console.log(this.Obj)
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide()
      this.TrailBalance = resp.data;
      console.log(this.TrailBalance)
      await this.getData();

      var temp_data = [];
      if (this.TrailBalance.length > 0) {
        for (let i = 0; i < this.TrailBalance.length; i++) {
          var obj = new Object();
          for (let j = 0; j < this.keysArr.length; j++) {
            obj[this.keysArr[j]] = this.TrailBalance[i][this.keysArr[j]];
          }
          if (this.TrailBalance[i]['db_cd_ind'] == 'CR') {
            obj['cr'] = this.TrailBalance[i]['txn_amt'];
            obj['db'] = 0;
          } else {
            obj['cr'] = 0;
            obj['db'] = this.TrailBalance[i]['txn_amt'];
          }
          temp_data.push(obj);
        }

      }

      var table_data = this.group_concat(temp_data, this.keysArr, ['cr', 'db']);
      this.tbl = table_data;
      for (var i = 0; i < this.tbl.length; i++) {
        this.totalcr += this.tbl[i]['cr'];
        this.totaldb += this.tbl[i]['db'];
        if (this.tbl[i]['lvl3_value'] == 'Assets') {
          var obj2 = Object.assign({}, this.tbl[i])
          obj2['balance'] = this.tbl[i]['cr'] - this.tbl[i]['db']
          if (obj2['balance'] < 0) {
            obj2['balance'] = obj2['balance'] * -1
            obj2['balance'] = obj2['balance'] + '(DR)'
          } else {
            obj2['balance'] = obj2['balance'] + '(CR)'
          }
          this.asset.push(obj2)
        }
        if (this.tbl[i]['lvl3_value'] == 'Liabilities & Equities') {
          var obj3 = Object.assign({}, this.tbl[i])
          obj3['balance'] = this.tbl[i]['cr'] - this.tbl[i]['db']
          if (obj3['balance'] < 0) {
            obj3['balance'] = obj3['balance'] * -1
            obj3['balance'] = obj3['balance'] + '(DR)'
          } else {
            obj3['balance'] = obj3['balance'] + '(CR)'
          }
          this.liability.push(obj3)
        }
        // if (this.tbl[i]['lvl3_value'] == '') {
        //   this.equity.push(this.tbl[i])
        // }
        if (this.tbl[i]['lvl3_value'] == 'Income') {
          var obj4 = Object.assign({}, this.tbl[i])
          obj4['balance'] = this.tbl[i]['cr'] - this.tbl[i]['db']
          if (obj4['balance'] < 0) {
            obj4['balance'] = obj4['balance'] * -1
            obj4['balance'] = obj4['balance'] + '(DR)'
          } else {
            obj4['balance'] = obj4['balance'] + '(CR)'
          }
          this.income.push(obj4)
        }
        if (this.tbl[i]['lvl3_value'] == 'Expenditure') {
          var obj5 = Object.assign({}, this.tbl[i])
          obj5['balance'] = this.tbl[i]['cr'] - this.tbl[i]['db']
          if (obj5['balance'] < 0) {
            obj5['balance'] = obj5['balance'] * -1
            obj5['balance'] = obj5['balance'] + '(DR)'
          } else {
            obj5['balance'] = obj5['balance'] + '(CR)'
          }
          this.expense.push(obj5)
        }

      }
      this.totalbal = this.totalcr - this.totaldb
      if (this.totalbal < 0) {
        this.totalbal = this.totalbal * -1
        this.totalbal = this.totalbal

      } else {
        this.totalbal = this.totalbal
      }

      this.datasource = new MatTableDataSource(table_data)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
      this.spinner.hide();
    } else {

      this.spinner.hide()
    }
  }

  group_concat(data, group_key, sumKey) {

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
        for (let j = 0; j < sumKey.length; j++) {
          result[key][sumKey[j]] = data[i][sumKey[j]]
        }

      } else {
        for (let j = 0; j < sumKey.length; j++) {
          result[key][sumKey[j]] += data[i][sumKey[j]]
        }
      }


    }
    let ret_data = Object.values(result);
    return ret_data
  }



  lvl1 = [];
  lvl2 = [];
  lvl3 = [];
  lvl4 = [];
  lvl5 = [];
  lvl6 = [];
  lvl7 = [];
  ChartOfAccountObj = {};

  async getData() {
    this.ChartOfAccountObj = {};

    var lvlobj1 = {};
    for (let i = 0; i < this.TrailBalance.length; i++) {
      if (this.TrailBalance[i]['lvl1_code'] != null)
        lvlobj1[this.TrailBalance[i]['lvl1_code']] = this.TrailBalance[i]['lvl1_value']
      this.ChartOfAccountObj[this.TrailBalance[i]['lvl1_code']] = this.TrailBalance[i]['lvl1_value']

    }
    var lvlobj2 = {};
    for (let i = 0; i < this.TrailBalance.length; i++) {
      if (this.TrailBalance[i]['lvl2_code'] != null)
        lvlobj2[this.TrailBalance[i]['lvl2_code']] = this.TrailBalance[i]['lvl2_value']
      this.ChartOfAccountObj[this.TrailBalance[i]['lvl2_code']] = this.TrailBalance[i]['lvl2_value']

    }
    var lvlobj3 = {};
    for (let i = 0; i < this.TrailBalance.length; i++) {
      if (this.TrailBalance[i]['lvl3_code'] != null)
        lvlobj3[this.TrailBalance[i]['lvl3_code']] = this.TrailBalance[i]['lvl3_value']
      this.ChartOfAccountObj[this.TrailBalance[i]['lvl3_code']] = this.TrailBalance[i]['lvl3_value']

    }
    var lvlobj4 = {};
    for (let i = 0; i < this.TrailBalance.length; i++) {
      if (this.TrailBalance[i]['lvl4_code'] != null)
        lvlobj4[this.TrailBalance[i]['lvl4_code']] = this.TrailBalance[i]['lvl4_value']
      this.ChartOfAccountObj[this.TrailBalance[i]['lvl4_code']] = this.TrailBalance[i]['lvl4_value']
    }
    var lvlobj5 = {};
    for (let i = 0; i < this.TrailBalance.length; i++) {
      if (this.TrailBalance[i]['lvl5_code'] != null)
        lvlobj5[this.TrailBalance[i]['lvl5_code']] = this.TrailBalance[i]['lvl5_value']
      this.ChartOfAccountObj[this.TrailBalance[i]['lvl5_code']] = this.TrailBalance[i]['lvl5_value']

    }
    var lvlobj6 = {};
    for (let i = 0; i < this.TrailBalance.length; i++) {
      if (this.TrailBalance[i]['lvl6_code'] != null)
        lvlobj6[this.TrailBalance[i]['lvl6_code']] = this.TrailBalance[i]['lvl6_value']
      this.ChartOfAccountObj[this.TrailBalance[i]['lvl6_code']] = this.TrailBalance[i]['lvl6_value']

    }

    var lvlobj7 = {};
    for (let i = 0; i < this.TrailBalance.length; i++) {
      if (this.TrailBalance[i]['lvl7_code'] != null)
        lvlobj7[this.TrailBalance[i]['lvl7_code']] = this.TrailBalance[i]['lvl7_value']
      this.ChartOfAccountObj[this.TrailBalance[i]['lvl7_code']] = this.TrailBalance[i]['lvl7_value']

    }



    this.lvl1 = Object.keys(lvlobj1);
    this.lvl2 = Object.keys(lvlobj2);
    this.lvl3 = Object.keys(lvlobj3);
    this.lvl4 = Object.keys(lvlobj4);
    this.lvl5 = Object.keys(lvlobj5);
    this.lvl6 = Object.keys(lvlobj6);
    this.lvl7 = Object.keys(lvlobj7);


console.log(this.lvl1 )

    var data = [];

    for (let i = 0; i < this.lvl1.length; i++) {
      var flag1 = true;
      for (let x = 0; x < this.TrailBalance.length; x++) {
        if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] && flag1 == true) {
          flag1 = false;
          var obj = new Object();
          obj['lvl1_code'] = this.lvl1[i];
          obj['lvl2_code'] = '';
          obj['lvl3_code'] = '';
          obj['lvl4_code'] = '';
          obj['lvl5_code'] = '';
          obj['lvl6_code'] = '';
          obj['lvl7_code'] = '';
          if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
            obj['cr_amount'] = this.TrailBalance[x]['txn_amt'];
            obj['db_amount'] = 0;
          } else {
            obj['db_amount'] = this.TrailBalance[x]['txn_amt'];
            obj['cr_amount'] = 0;
          }
        } else if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] && flag1 == false) {
          if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
            obj['cr_amount'] = obj['cr_amount'] + this.TrailBalance[x]['txn_amt'];
          } else {
            obj['db_amount'] = obj['db_amount'] + this.TrailBalance[x]['txn_amt'];
          }
        }
      }

      data.push(obj)
console.log(obj)


      for (let j = 0; j < this.lvl2.length; j++) {
        var flag2 = true;
        var insert_flag2 = false;
        for (let x = 0; x < this.TrailBalance.length; x++) {
          if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] && this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] && flag2 == true) {
            flag2 = false;
            var obj = new Object();
            var insert_flag2 = true;
            obj['lvl1_code'] = '';
            obj['lvl2_code'] = this.lvl2[j];
            obj['lvl3_code'] = '';
            obj['lvl4_code'] = '';
            obj['lvl5_code'] = '';
            obj['lvl6_code'] = '';
            obj['lvl7_code'] = '';
            if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
              obj['cr_amount'] = this.TrailBalance[x]['txn_amt'];
              obj['db_amount'] = 0;
            } else {
              obj['db_amount'] = this.TrailBalance[x]['txn_amt'];
              obj['cr_amount'] = 0;
            }
          } else if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] &&
            this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] && flag2 == false) {
            if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
              obj['cr_amount'] = obj['cr_amount'] + this.TrailBalance[x]['txn_amt'];
            } else {
              obj['db_amount'] = obj['db_amount'] + this.TrailBalance[x]['txn_amt'];
            }
          }
        }

        if (insert_flag2 == true) {
          data.push(obj);
        }



        for (let k = 0; k < this.lvl3.length; k++) {
          var flag3 = true;
          var insert_flag3 = false;
          for (let x = 0; x < this.TrailBalance.length; x++) {
            if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i]
              && this.TrailBalance[x]['lvl2_code'] == this.lvl2[j]
              && this.TrailBalance[x]['lvl3_code'] == this.lvl3[k]
              && flag3 == true) {
              flag3 = false;


              var obj = new Object();
              var insert_flag3 = true;

              obj['lvl1_code'] = '';
              obj['lvl2_code'] = '';
              obj['lvl3_code'] = this.lvl3[k];
              obj['lvl4_code'] = '';
              obj['lvl5_code'] = '';
              obj['lvl6_code'] = '';
              obj['lvl7_code'] = '';
              if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                obj['cr_amount'] = this.TrailBalance[x]['txn_amt'];
                obj['db_amount'] = 0;
              } else {
                obj['db_amount'] = this.TrailBalance[x]['txn_amt'];
                obj['cr_amount'] = 0;
              }
            } else if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i]
              && this.TrailBalance[x]['lvl2_code'] == this.lvl2[j]
              && this.TrailBalance[x]['lvl3_code'] == this.lvl3[k]
              && flag3 == false) {
              if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                obj['cr_amount'] = obj['cr_amount'] + this.TrailBalance[x]['txn_amt'];
              } else {
                obj['db_amount'] = obj['db_amount'] + this.TrailBalance[x]['txn_amt'];
              }
            }
          }
          if (insert_flag3 == true) {
            data.push(obj)

          }



          for (let l = 0; l < this.lvl4.length; l++) {

            var flag4 = true;
            var insert_flag4 = false;
            for (let x = 0; x < this.TrailBalance.length; x++) {
              if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i]
                && this.TrailBalance[x]['lvl2_code'] == this.lvl2[j]
                && this.TrailBalance[x]['lvl3_code'] == this.lvl3[k]
                && this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] && flag4 == true) {
                flag4 = false;
                var obj = new Object();
                insert_flag4 = true;
                obj['lvl1_code'] = '';
                obj['lvl2_code'] = '';
                obj['lvl3_code'] = '';
                obj['lvl4_code'] = this.lvl4[l];
                obj['lvl5_code'] = '';
                obj['lvl6_code'] = '';
                obj['lvl7_code'] = '';
                if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                  obj['cr_amount'] = this.TrailBalance[x]['txn_amt'];
                  obj['db_amount'] = 0;
                } else {
                  obj['db_amount'] = this.TrailBalance[x]['txn_amt'];
                  obj['cr_amount'] = 0;
                }
              } else if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i]
                && this.TrailBalance[x]['lvl2_code'] == this.lvl2[j]
                && this.TrailBalance[x]['lvl3_code'] == this.lvl3[k]
                && this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] && flag4 == false) {
                if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                  obj['cr_amount'] = obj['cr_amount'] + this.TrailBalance[x]['txn_amt'];
                } else {
                  obj['db_amount'] = obj['db_amount'] + this.TrailBalance[x]['txn_amt'];
                }
              }
            }
            if (insert_flag4 == true) {
              data.push(obj);

            }

            for (let m = 0; m < this.lvl5.length; m++) {

              var flag5 = true;
              var insert_flag5 = false;
              for (let x = 0; x < this.TrailBalance.length; x++) {
                if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] &&
                  this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] &&
                  this.TrailBalance[x]['lvl3_code'] == this.lvl3[k] &&
                  this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] &&
                  this.TrailBalance[x]['lvl5_code'] == this.lvl5[m] && flag5 == true) {
                  flag5 = false;
                  var obj = new Object();
                  insert_flag5 = true;

                  obj['lvl1_code'] = '';
                  obj['lvl2_code'] = '';
                  obj['lvl3_code'] = '';
                  obj['lvl4_code'] = '';
                  obj['lvl5_code'] = this.lvl5[m];
                  obj['lvl6_code'] = '';
                  obj['lvl7_code'] = '';
                  if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                    obj['cr_amount'] = this.TrailBalance[x]['txn_amt'];
                    obj['db_amount'] = 0;
                  } else {
                    obj['db_amount'] = this.TrailBalance[x]['txn_amt'];
                    obj['cr_amount'] = 0;
                  }
                } else if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] &&
                  this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] &&
                  this.TrailBalance[x]['lvl3_code'] == this.lvl3[k] &&
                  this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] &&
                  this.TrailBalance[x]['lvl5_code'] == this.lvl5[m] && flag5 == false) {
                  if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                    obj['cr_amount'] = obj['cr_amount'] + this.TrailBalance[x]['txn_amt'];
                  } else {
                    obj['db_amount'] = obj['db_amount'] + this.TrailBalance[x]['txn_amt'];
                  }
                }
              }
              if (insert_flag5 == true) {
                data.push(obj)

              }

              for (let n = 0; n < this.lvl6.length; n++) {

                var flag6 = true;
                var insert_flag6 = false;
                for (let x = 0; x < this.TrailBalance.length; x++) {
                  if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] &&
                    this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] &&
                    this.TrailBalance[x]['lvl3_code'] == this.lvl3[k] &&
                    this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] &&
                    this.TrailBalance[x]['lvl5_code'] == this.lvl5[m] &&
                    this.TrailBalance[x]['lvl6_code'] == this.lvl6[n] && flag6 == true) {
                    flag6 = false;
                    var obj = new Object();
                    insert_flag6 = true;

                    obj['lvl1_code'] = '';
                    obj['lvl2_code'] = '';
                    obj['lvl3_code'] = '';
                    obj['lvl4_code'] = '';
                    obj['lvl5_code'] = '';
                    obj['lvl6_code'] = this.lvl6[n];
                    obj['lvl7_code'] = '';
                    if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                      obj['cr_amount'] = this.TrailBalance[x]['txn_amt'];
                      obj['db_amount'] = 0;
                    } else {
                      obj['db_amount'] = this.TrailBalance[x]['txn_amt'];
                      obj['cr_amount'] = 0;
                    }
                  } else if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] &&
                    this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] &&
                    this.TrailBalance[x]['lvl3_code'] == this.lvl3[k] &&
                    this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] &&
                    this.TrailBalance[x]['lvl5_code'] == this.lvl5[m] &&
                    this.TrailBalance[x]['lvl6_code'] == this.lvl6[n] && flag6 == false) {
                    if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                      obj['cr_amount'] = obj['cr_amount'] + this.TrailBalance[x]['txn_amt'];
                    } else {
                      obj['db_amount'] = obj['db_amount'] + this.TrailBalance[x]['txn_amt'];
                    }
                  }
                }
                if (insert_flag6 == true) {
                  data.push(obj)

                }

                for (let o = 0; o < this.lvl7.length; o++) {

                  var flag7 = true;
                  var insert_flag7 = false;
                  for (let x = 0; x < this.TrailBalance.length; x++) {
                    if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] &&
                      this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] &&
                      this.TrailBalance[x]['lvl3_code'] == this.lvl3[k] &&
                      this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] &&
                      this.TrailBalance[x]['lvl5_code'] == this.lvl5[m] &&
                      this.TrailBalance[x]['lvl6_code'] == this.lvl6[n] &&
                      this.TrailBalance[x]['lvl7_code'] == this.lvl7[o] && flag7 == true) {
                      flag7 = false;
                      var obj = new Object();
                      insert_flag7 = true;

                      obj['lvl1_code'] = '';
                      obj['lvl2_code'] = '';
                      obj['lvl3_code'] = '';
                      obj['lvl4_code'] = '';
                      obj['lvl5_code'] = '';
                      obj['lvl6_code'] = '';
                      obj['lvl7_code'] = this.lvl7[o];
                      if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                        obj['cr_amount'] = this.TrailBalance[x]['txn_amt'];
                        obj['db_amount'] = 0;
                      } else {
                        obj['db_amount'] = this.TrailBalance[x]['txn_amt'];
                        obj['cr_amount'] = 0;
                      }
                    } else if (this.TrailBalance[x]['lvl1_code'] == this.lvl1[i] &&
                      this.TrailBalance[x]['lvl2_code'] == this.lvl2[j] &&
                      this.TrailBalance[x]['lvl3_code'] == this.lvl3[k] &&
                      this.TrailBalance[x]['lvl4_code'] == this.lvl4[l] &&
                      this.TrailBalance[x]['lvl5_code'] == this.lvl5[m] &&
                      this.TrailBalance[x]['lvl6_code'] == this.lvl6[n] &&
                      this.TrailBalance[x]['lvl7_code'] == this.lvl7[o] && flag7 == false) {
                      if (this.TrailBalance[x]['db_cd_ind'] == 'CR') {
                        obj['cr_amount'] = obj['cr_amount'] + this.TrailBalance[x]['txn_amt'];
                      } else {
                        obj['db_amount'] = obj['db_amount'] + this.TrailBalance[x]['txn_amt'];
                      }
                    }
                  }
                  if (insert_flag7 == true) {
                    data.push(obj)

                  }

                }

              }

            }
          }
        }
      }
    }
    this.reportData = data;
console.log(this.reportData)

  }

  export() {
    let exp_data = []
    let total_data = []
    let data1 = []
    let data2 = []
    let data3 = []
    let data4 = []
    let data5 = []
    let o1 = {}
    o1['cr'] = ''
    o1['db'] = ''
    o1['balance'] = ''
    o1['c_acc'] = 'ASSET'
    if (this.asset.length > 0) {
      exp_data.push(o1)
    }



    for (let i = 0; i < this.asset.length; i++) {
      let obj = {}
      obj['cr'] = this.asset[i]['cr'].toFixed(2)
      obj['db'] = this.asset[i]['db'].toFixed(2)
      obj['balance'] = this.asset[i]['balance']
      obj['c_acc'] = this.asset[i]['leaf_code'] + ' - ' + this.asset[i]['leaf_value']
      exp_data.push(obj)
    }
    let o2 = {}
    o2['cr'] = ''
    o2['db'] = ''
    o2['balance'] = ''
    o2['c_acc'] = 'LIABILITIES'
    if (this.liability.length > 0) {
      exp_data.push(o2)
    }
    for (let i = 0; i < this.liability.length; i++) {
      let obj = {}
      obj['cr'] = this.liability[i]['cr'].toFixed(2)
      obj['db'] = this.liability[i]['db'].toFixed(2)
      obj['balance'] = this.liability[i]['balance']
      obj['c_acc'] = this.liability[i]['leaf_code'] + ' - ' + this.liability[i]['leaf_value']
      exp_data.push(obj)
    }
    let o3 = {}
    o3['cr'] = ''
    o3['db'] = ''
    o3['balance'] = ''
    o3['c_acc'] = 'INCOME'
    if (this.income.length > 0) {
      exp_data.push(o3)
    }
    for (let i = 0; i < this.income.length; i++) {
      let obj = {}
      obj['cr'] = this.income[i]['cr'].toFixed(2)
      obj['db'] = this.income[i]['db'].toFixed(2)
      obj['balance'] = this.income[i]['balance']
      obj['c_acc'] = this.income[i]['leaf_code'] + ' - ' + this.income[i]['leaf_value']
      exp_data.push(obj)
    }
    let o4 = {}
    o4['cr'] = ''
    o4['db'] = ''
    o4['balance'] = ''
    o4['c_acc'] = 'EXPENSE'
    if (this.expense.length > 0) {
      exp_data.push(o4)
    }
    for (let i = 0; i < this.expense.length; i++) {
      let obj = {}
      obj['cr'] = this.expense[i]['cr'].toFixed(2)
      obj['db'] = this.expense[i]['db'].toFixed(2)
      obj['balance'] = this.expense[i]['balance']
      obj['c_acc'] = this.expense[i]['leaf_code'] + ' - ' + this.expense[i]['leaf_value']
      exp_data.push(obj)
    }

    let o5 = {}
    o5['cr'] = ''
    o5['db'] = ''
    o5['balance'] = ''
    o5['c_acc'] = 'EQUITY'
    if (this.equity.length > 0) {
      exp_data.push(o5)
    }
    for (let i = 0; i < this.equity.length; i++) {
      let obj = {}
      obj['cr'] = this.equity[i]['cr'].toFixed(2)
      obj['db'] = this.equity[i]['db'].toFixed(2)
      obj['balance'] = this.equity[i]['balance']
      obj['c_acc'] = this.equity[i]['leaf_code'] + ' - ' + this.equity[i]['leaf_value']
      exp_data.push(obj)
    }

    let o6 = {}
    o6['cr'] = this.totalcr
    o6['db'] = this.totaldb
    o6['balance'] = this.totalbal
    o6['c_acc'] = '                  TOTAL'
    exp_data.push(o6)


    var exp = []
    for (var i = 0; i < exp_data.length; i++) {
      var obj = new Object();
      obj['Chart Of Account'] = exp_data[i]['c_acc']
      obj['Debit'] = exp_data[i]['db']
      obj['Credit'] = exp_data[i]['cr']
      obj['Balance'] = exp_data[i]['balance']

      exp.push(obj);
    }
    this.excel.exportAsExcelFile(exp, 'trail_balance_report')
  }

  async print1() {

    for (let i = 0; i < this.reportData.length; i++) {
      this.reportData[i]['cr_amount'] = this.amounttoINRConvert(this.reportData[i]['cr_amount'])
      this.reportData[i]['db_amount'] = this.amounttoINRConvert(this.reportData[i]['db_amount'])
    }
    var data = this.reportData;

    var txt = this.mainService.accInfo['account_name'] + "(" + this.mainService.accInfo['account_short_name'] + ")";
    var dd = {
      pageSize: 'A3',
      header: function (currentPage, pageCount) {
        var arr = []
        var obj = { text: txt + "  Page No. - " + currentPage, alignment: 'center', margin: [72, 40], fontSize: 15, bold: true };
        arr.push(obj);
        return arr;
      },
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      content: [

      ]
    };


    var header0 = {
      columns: [
        {
          width: '*',
          text: 'BANK BOOK REPORT',
          bold: true,
          alignment: 'center'
        }

      ],
    }

    var header1 = {
      columns: [
        {
          width: '*',
          text: 'Processing Date :',
          bold: true
        },
        {
          width: '*',
          text: this.mainService.dateFormatChange(this.Obj['proc_dt'])
        },
        {

          width: '*',
          text: 'As On Date :',
          bold: true
        },
        {
          width: '*',
          text: this.mainService.dateFormatChange(this.Obj['acct_dt'])
        }
      ],

    }
    var header2 = {
      columns: [
        {
          width: '*',
          text: 'Ledger Type :',
          bold: true

        },
        {
          width: '*',
          text: this.Obj['ledger_type']
        },
        {
          width: '*',
          text: 'Financial Year :',
          bold: true
        },
        {
          width: '*',
          text: this.Obj['fin_year']
        }
      ],

    }
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 1115, y2: 0, lineWidth: 0.5 }] });

    dd.content.push(header0);

    dd.content.push({ text: " " });
    dd.content.push(header1);
    dd.content.push(header2);
    dd.content.push({ text: " " });

    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 1115, y2: 0, lineWidth: 0.5 }] });


    var header8 = {
      columns: [
        {
          width: '*',
          text: 'Level 1',
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Level 2',
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Level 3',
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Level 4',
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Level 5',
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Level 6',
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'Level 7',
          bold: true,
          alignment: 'left'
        },
        {
          width: '*',
          text: 'CR',
          bold: true,
          alignment: 'right'
        },
        {
          width: '*',
          text: 'DB',
          bold: true,
          alignment: 'right'
        }
      ],


    }
    dd.content.push(header8);
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 1115, y2: 0, lineWidth: 0.5 }] });
    dd.content.push({ text: " " });

    for (var i = 0; i < data.length; i++) {

      var objRow = { columns: [], }

      for (let j = 1; j < 8; j++) {
        var text_temp = '';
        if (data[i]['lvl' + j + '_code'] != '') {
          text_temp = data[i]['lvl' + j + '_code'] + " - " + this.ChartOfAccountObj[data[i]['lvl' + j + '_code']]
        }
        objRow['columns'].push({
          width: '*',
          text: text_temp,
          alignment: 'left',
        })
      }
      objRow['columns'].push({
        width: '*',
        text: data[i]['cr_amount'],
        alignment: 'right',
        bold: true,
      })
      objRow['columns'].push({
        width: '*',
        text: data[i]['db_amount'],
        alignment: 'right',
        bold: true,
      })


      dd.content.push(objRow);
      dd.content.push({ text: " " });
    }

    pdfMake.createPdf(dd).download('trial_balance.pdf');

  }

  async print5() {
    this.spinner.show()
    let total_data = []
    let data1 = []
    let data2 = []
    let data3 = []
    let data4 = []
    let data5 = []
    let o1 = {}
    o1['cr'] = ''
    o1['db'] = ''
    o1['balance'] = ''
    o1['c_acc'] = 'ASSET'
    if (this.asset.length > 0) {
      data1.push(o1)
    }
    let o2 = {}
    o2['cr'] = ''
    o2['db'] = ''
    o2['balance'] = ''
    o2['c_acc'] = 'LIABILITIES'
    if (this.liability.length > 0) {
      data2.push(o2)
    }
    let o3 = {}
    o3['cr'] = ''
    o3['db'] = ''
    o3['balance'] = ''
    o3['c_acc'] = 'INCOME'
    if (this.income.length > 0) {
      data3.push(o3)
    }
    let o4 = {}
    o4['cr'] = ''
    o4['db'] = ''
    o4['balance'] = ''
    o4['c_acc'] = 'EXPENSE'
    if (this.expense.length > 0) {
      data4.push(o4)
    }
    let o5 = {}
    o5['cr'] = ''
    o5['db'] = ''
    o5['balance'] = ''
    o5['c_acc'] = 'EQUITY'
    if (this.equity.length > 0) {
      data5.push(o5)
    }
    for (let i = 0; i < this.asset.length; i++) {
      let obj = {}
      obj['cr'] = this.asset[i]['cr'].toFixed(2)
      obj['db'] = this.asset[i]['db'].toFixed(2)
      obj['balance'] = this.asset[i]['balance']
      obj['c_acc'] = this.asset[i]['leaf_code'] + ' - ' + this.asset[i]['leaf_value']
      data1.push(obj)
    }
    for (let i = 0; i < this.liability.length; i++) {
      let obj = {}
      obj['cr'] = this.liability[i]['cr'].toFixed(2)
      obj['db'] = this.liability[i]['db'].toFixed(2)
      obj['balance'] = this.liability[i]['balance']
      obj['c_acc'] = this.liability[i]['leaf_code'] + ' - ' + this.liability[i]['leaf_value']
      data2.push(obj)
    }
    for (let i = 0; i < this.income.length; i++) {
      let obj = {}
      obj['cr'] = this.income[i]['cr'].toFixed(2)
      obj['db'] = this.income[i]['db'].toFixed(2)
      obj['balance'] = this.income[i]['balance']
      obj['c_acc'] = this.income[i]['leaf_code'] + ' - ' + this.income[i]['leaf_value']
      data3.push(obj)
    }
    for (let i = 0; i < this.expense.length; i++) {
      let obj = {}
      obj['cr'] = this.expense[i]['cr'].toFixed(2)
      obj['db'] = this.expense[i]['db'].toFixed(2)
      obj['balance'] = this.expense[i]['balance']
      obj['c_acc'] = this.expense[i]['leaf_code'] + ' - ' + this.expense[i]['leaf_value']
      data4.push(obj)
    }
    for (let i = 0; i < this.equity.length; i++) {
      let obj = {}
      obj['cr'] = this.equity[i]['cr'].toFixed(2)
      obj['db'] = this.equity[i]['db'].toFixed(2)
      obj['balance'] = this.equity[i]['balance']
      obj['c_acc'] = this.equity[i]['leaf_code'] + ' - ' + this.equity[i]['leaf_value']
      data5.push(obj)
    }

    let o6 = {}
    o6['cr'] = this.totalcr
    o6['db'] = this.totaldb
    o6['balance'] = this.totalbal
    o6['c_acc'] = '                  TOTAL'
    total_data.push(o6)
    if (data1.length > 0 || data2.length > 0 || data3.length > 0 || data4.length > 0 || data5.length > 0) {
      var txt = this.mainService.accInfo['account_name'] + '(' + this.mainService.accInfo['account_short_name'] + ')'
      var dd = {
        pageSize: 'A4',
        header: function (currentPage, pageCount) {
          var obj = { text: txt + "     Page No. - " + currentPage, alignment: 'center', margin: [72, 40] };
          return obj;
        },

        pageOrientation: 'portrait',

        pageMargins: [40, 60, 40, 60],
        content: [
        ]
      };
      var header0 = {
        columns: [
          {
            width: '*',
            text: 'TRIAL BALANCE',
            bold: true,
            alignment: 'center'
          }

        ],
      }
      let acct_dt = ''
      if (this.Obj['acct_dt']) {
        acct_dt = this.mainService.dateFormatChange(this.Obj['acct_dt'])
      } else {
        acct_dt = ''
      }
      var header2 = {
        columns: [
        
          {
            width: '*',
            text: 'As On Date :',
            bold: true
          },

          {
            width: '*',
            text:acct_dt
          },
          {
            width: '*',
            text: 'Ledger Type :',
            bold: true
          },
          {
            width: '*',
            text: this.Obj['ledger_type']


          },
         
        ],
      }
      var header3 = {
        columns: [
         
          {
            width: '*',
            text: 'Financial Year :',
            bold: true
          },

          {
            width: '*',
            text: this.Obj['fin_year']
          },
          {
            width: '*',
            text: '',
            bold: true
          },
          {
            width: '*',
            text: ''
          },
        ],
      }
      dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.05 }] });
      dd.content.push(header0);
      dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.05 }] });
      dd.content.push({ text: " " });
      dd.content.push(header2);
      dd.content.push({ text: " " });
      dd.content.push(header3);
      dd.content.push({ text: " " });
      dd.content.push({ text: " " });
      dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.05 }] });
      var tbl = {
        // layout: 'lightHorizontalLines',
        fontSize: 10,
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            [{ text: 'Chart Of Account', alignment: 'left', bold: true }, { text: 'Debit(DR)', alignment: 'right', bold: true }, { text: 'Credit(CR)', alignment: 'right', bold: true }, { text: 'Balance', alignment: 'right', bold: true }]
          ],

        }
      };

      dd.content.push(tbl)
      for (var i = 0; i < data1.length; i++) {
        var arr = []
        if (data1[i]['c_acc'] == 'ASSET') {
          arr.push({ text: data1[i]['c_acc'], alignment: 'left', bold: true });
        } else {
          arr.push(data1[i]['c_acc']);
        }
        arr.push({ text: data1[i]['db'], alignment: 'right' });
        arr.push({ text: data1[i]['cr'], alignment: 'right' });
        arr.push({ text: data1[i]['balance'], alignment: 'right' });
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
      for (var i = 0; i < data2.length; i++) {
        var arr = []
        if (data2[i]['c_acc'] == 'LIABILITIES') {
          arr.push({ text: data2[i]['c_acc'], alignment: 'left', bold: true });
        } else {
          arr.push(data2[i]['c_acc']);
        }
        arr.push({ text: data2[i]['db'], alignment: 'right' });
        arr.push({ text: data2[i]['cr'], alignment: 'right' });
        arr.push({ text: data2[i]['balance'], alignment: 'right' });
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
      for (var i = 0; i < data3.length; i++) {
        var arr = []
        if (data3[i]['c_acc'] == 'INCOME') {
          arr.push({ text: data3[i]['c_acc'], alignment: 'left', bold: true });
        } else {
          arr.push(data3[i]['c_acc']);
        }
        arr.push({ text: data3[i]['db'], alignment: 'right' });
        arr.push({ text: data3[i]['cr'], alignment: 'right' });
        arr.push({ text: data3[i]['balance'], alignment: 'right' });
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
      for (var i = 0; i < data4.length; i++) {
        var arr = []
        if (data4[i]['c_acc'] == 'EXPENSE') {
          arr.push({ text: data4[i]['c_acc'], alignment: 'left', bold: true });
        } else {
          arr.push(data4[i]['c_acc']);
        }
        arr.push({ text: data4[i]['db'], alignment: 'right' });
        arr.push({ text: data4[i]['cr'], alignment: 'right' });
        arr.push({ text: data4[i]['balance'], alignment: 'right' });
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
      for (var i = 0; i < data5.length; i++) {
        var arr = []
        if (data5[i]['c_acc'] == 'EQUITY') {
          arr.push({ text: data5[i]['c_acc'], alignment: 'left', bold: true });
        } else {
          arr.push(data5[i]['c_acc']);
        }
        arr.push({ text: data5[i]['db'], alignment: 'right' });
        arr.push({ text: data5[i]['cr'], alignment: 'right' });
        arr.push({ text: data5[i]['balance'], alignment: 'right' });
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
      for (var i = 0; i < total_data.length; i++) {
        var arr = []
        arr.push({ text: total_data[i]['c_acc'], alignment: 'left', bold: true });
        arr.push({ text: total_data[i]['db'], alignment: 'right' });
        arr.push({ text: total_data[i]['cr'], alignment: 'right' });
        arr.push({ text: total_data[i]['balance'], alignment: 'right' });
        dd.content[dd.content.length - 1].table.body.push(arr);
      }
      this.spinner.hide()
      pdfMake.createPdf(dd).download("trailbalance");
    } else {
      this.spinner.hide()
      swal.fire('There Is No Record To Display', '', 'info')
    }
  }


  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

}
