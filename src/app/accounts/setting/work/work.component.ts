import { Component, OnInit, ViewChild } from '@angular/core';

import { HierarchyService } from '../../service/hierarchy.service';
import { MainService } from '../../service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { SalService } from '../../service/sal.service';
import { SettingService } from '../../service/setting.service';
import Swal from 'sweetalert2';
import { WorkService } from '../../service/work.service';
import swal from 'sweetalert2';

declare var $: any

 
 
@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {


  constructor(private hierarchyService:HierarchyService, private salService: SalService, private settingService: SettingService, private workS: WorkService, public mainService: MainService, private spinner: NgxSpinnerService, private snackBar: MatSnackBar) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  datasource;
  allParty
  obj = {}
  displayedColumns = ['id', 'work_no', 'work_desc', 'party_le_id', 'start_dt', 'end_dt', 'amt','action'];
  erpUser;
  user_id;
  b_acct_id;
  allSal = [];
  allProjectHier=[];
  allProductHier=[];
  allActivityHier=[];
  allBudgetHier=[];
  allBudget = [];
  allProject = [];
  allProduct = [];
  allActivity = [];
  techToBusNameObj = {};
  create_flag=false;
  list_flag=true;
  update_flag=false;

  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    this.user_id = this.erpUser.user_id;
    await this.getAllParties()
    await this.getAllWork()
    await this.getAllBudget();

    await this.getAllProject();
    await this.getAllProduct();
  }
  async createNew(){
    this.create_flag=true;
    this.list_flag=false;
    this.update_flag=false
 // $(".nav-tabs nav-link").removeClass('active');

  // await $('.nav-tabs a[href="#tab-2"]').tab('show');
   
  }
  budgetObj={}
  hierobj = {budget:{},activity:{},product:{},project:{}}
 
  async getAllBudget(){
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name']='bud_hier';
    var resp = await this.hierarchyService.getBudgetHierarchy(obj);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.allBudgetHier = resp.data;

      for(let i=0;i<this.allBudgetHier.length;i++){
        console.log(this.allBudgetHier[i])
        let str=""
        for(let j=1;j<8;j++){
          if(this.allBudgetHier[i]['lvl'+j+"_cd"]!=null && this.allBudgetHier[i]['lvl'+j+"_cd"]!=""){
            str +=this.allBudgetHier[i]['lvl'+j+"_value"]+" > "

          }
        }

        str=str.substring(0,str.length-2)
        this.allBudgetHier[i]['desc']=str;
        this.budgetObj[this.allBudgetHier[i]['leaf_cd']]=str
        this.hierobj['budget'][this.allBudgetHier[i]['leaf_cd']]=this.allBudgetHier[i]

      }
    } else {
      this.spinner.hide()

    }
  }


  projectObj={}
  async getAllProject(){
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name']='proj_hier';
    var resp = await this.hierarchyService.getProjectHierarchy(obj);
    if (resp['error'] == false) {
      this.allProjectHier = resp.data;
      for(let i=0;i<this.allProjectHier.length;i++){
        console.log(this.allProjectHier[i])
        let str=""
        for(let j=1;j<8;j++){
          if(this.allProjectHier[i]['lvl'+j+"_cd"]!=null && this.allProjectHier[i]['lvl'+j+"_cd"]!=""){
            str +=this.allProjectHier[i]['lvl'+j+"_value"]+" > "

          }
        }

        str=str.substring(0,str.length-2)
        this.allProjectHier[i]['desc']=str;
        this.projectObj[this.allProjectHier[i]['leaf_cd']]=str
        this.hierobj['project'][this.allProjectHier[i]['leaf_cd']]=this.allProjectHier[i]

      }
    } else {
    }
  }

  productObj={}
  async getAllProduct(){
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name']='prod_hier';
    var resp = await this.hierarchyService.getProductHierarchy(obj);
    if (resp['error'] == false) {
      this.allProductHier = resp.data;
      for(let i=0;i<this.allProductHier.length;i++){
        console.log(this.allProductHier[i])
        let str=""
        for(let j=1;j<8;j++){
          if(this.allProductHier[i]['lvl'+j+"_cd"]!=null && this.allProductHier[i]['lvl'+j+"_cd"]!=""){
            str +=this.allProductHier[i]['lvl'+j+"_value"]+" > "

          }
        }

        str=str.substring(0,str.length-2)
        this.allProductHier[i]['desc']=str;
        this.productObj[this.allProductHier[i]['leaf_cd']]=str
        this.hierobj['product'][this.allProductHier[i]['leaf_cd']]=this.allProductHier[i]

      }
    } else {
    }
  }

  
  level1 = [];
  level2 = [];
  level3 = [];
  level4 = [];
  level5 = [];
  level6 = [];
  level7 = [];
  Hier = [];
  hier_type;
  HierSelectObj={}
  selectObj = {}
  HierSelectobj
 
async Select(type) {
  $('#select').modal('show');
  this.hier_type = type;
  let ob={}

  if (type == 'budget') {
    this.Hier = this.allBudgetHier;
    if(this.selectObj['bud_cd']!=null && this.selectObj['bud_cd']!=''){

      ob=this.hierobj['budget'][this.selectObj['bud_cd']]
    
      console.log(ob)

   }
  } else if (type == 'activity') {
    this.Hier = this.allActivityHier;
    if(this.selectObj['act_cd']!=null && this.selectObj['act_cd']!=''){

      ob=this.hierobj['activity'][this.selectObj['act_cd']]
    
      console.log(ob)

  }} else if (type == 'project') {
    this.Hier = this.allProjectHier;
    if(this.selectObj['proj_cd']!=null && this.selectObj['proj_cd']!=''){

      ob=this.hierobj['project'][this.selectObj['proj_cd']]
    
    

  }} else if (type == 'product') {
    this.Hier = this.allProductHier;
    if(this.selectObj['prod_cd']!=null && this.selectObj['prod_cd']!=''){

      ob=this.hierobj['product'][this.selectObj['prod_cd']]
    
      

  }}
  this.HierSelectObj={}
  console.log(this.HierSelectObj)
  await this.getLevel1();
  if(Object.keys(ob).length!=0){
    this.HierSelectObj=Object.assign({},ob)
    await   this.onChangeLvl1()
    this.HierSelectObj=Object.assign({},ob)

    await    this.onChangeLvl2()
    this.HierSelectObj=Object.assign({},ob)

    await   this.onChangeLvl3()
    this.HierSelectObj=Object.assign({},ob)

    await  this.onChangeLvl4()
    this.HierSelectObj=Object.assign({},ob)

    await   this.onChangeLvl5()
    this.HierSelectObj=Object.assign({},ob)

    await   this.onChangeLvl6()
    this.HierSelectObj=Object.assign({},ob)

    await   this.onChangeLvl7()


      }
    }

  async selectCreate(type){
    $('#selectCreate').modal('show');
    this.hier_type = type;
    let ob={}
    if (type == 'budget') {
      this.Hier = this.allBudgetHier;
      if(this.obj['bud_cd']!=null && this.obj['bud_cd']!=''){

        ob=this.hierobj['budget'][this.obj['bud_cd']]
      
   

      }
    } else if (type == 'activity') {
      this.Hier = this.allActivityHier;
      if(this.obj['act_cd']!=null && this.obj['act_cd']!=''){

        ob=this.hierobj['activity'][this.obj['act_cd']]
      
    
      }
     
    } else if (type == 'project') {
      this.Hier = this.allProjectHier;
      if(this.obj['proj_cd']!=null && this.obj['proj_cd']!=''){

        ob=this.hierobj['project'][this.obj['proj_cd']]
      
       
      }
    } else if (type == 'product') {
      this.Hier = this.allProductHier;
      if(this.obj['prod_cd']!=null && this.obj['prod_cd']!=''){

        ob=this.hierobj['product'][this.obj['prod_cd']]
      
      
      }
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
    if (this.hier_type == 'budget') {
      for (let i = 0; i < this.allBudgetHier.length; i++) {
        if (this.allBudgetHier[i]['leaf_cd'] == this.HierSelectObj['lvl'+levelnum+'_cd']) {
          this.selectObj['bud_desc'] = this.allBudgetHier[i]['desc'];
          this.selectObj['bud_cd'] = this.allBudgetHier[i]['leaf_cd'];
          this.selectObj['bud_lvl'] = this.allBudgetHier[i]['level'];
          this.selectObj['bud_obj']=this.allBudgetHier[i]
        }
      }
    } else if (this.hier_type == 'activity') {
      for (let i = 0; i < this.allActivityHier.length; i++) {
        if (this.allActivityHier[i]['leaf_cd'] == this.HierSelectObj['lvl'+levelnum+'_cd']) {
          this.selectObj['act_desc'] = this.allActivityHier[i]['desc'];
          this.selectObj['act_cd'] = this.allActivityHier[i]['leaf_cd'];
          this.selectObj['act_lvl'] = this.allActivityHier[i]['level'];
          this.selectObj['act_obj']=this.allActivityHier[i]

        }
      }
    } else if (this.hier_type == 'project') {
      for (let i = 0; i < this.allProjectHier.length; i++) {
        if (this.allProjectHier[i]['leaf_cd'] == this.HierSelectObj['lvl'+levelnum+'_cd']) {
          this.selectObj['proj_desc'] = this.allProjectHier[i]['desc'];
          this.selectObj['proj_cd'] = this.allProjectHier[i]['leaf_cd'];
          this.selectObj['proj_lvl'] = this.allProjectHier[i]['level'];
          this.selectObj['proj_obj']=this.allProjectHier[i]

        }
      }
    } else if (this.hier_type == 'product') {
      for (let i = 0; i < this.allProductHier.length; i++) {
        if (this.allProductHier[i]['leaf_cd'] == this.HierSelectObj['lvl'+levelnum+'_cd']) {
          this.selectObj['prod_cd'] = this.allProductHier[i]['leaf_cd'];
          this.selectObj['prod_desc'] = this.allProductHier[i]['desc'];
          this.selectObj['prod_lvl'] = this.allProductHier[i]['level'];
          this.selectObj['prod_obj']=this.allProductHier[i]

        }
      }
    }

    $('#select').modal('hide');


  }

  SubmitListHierforCreate() {
    if(this.HierSelectObj['leaf_cd']=="" || this.HierSelectObj['leaf_cd']==null){
      Swal.fire("Error","Please select till leaf.")
      return;
    }
    if (this.hier_type == 'budget') {
      for (let i = 0; i < this.allBudgetHier.length; i++) {
        if (this.allBudgetHier[i]['leaf_cd'] == this.HierSelectObj['leaf_cd']) {
          this.obj['bud_desc'] = this.allBudgetHier[i]['desc'];
          this.obj['bud_cd'] = this.allBudgetHier[i]['leaf_cd'];
          this.obj['bud_lvl'] = this.allBudgetHier[i]['level'];
          this.obj['bud_obj']=this.allBudgetHier[i]
        }
      }
      console.log(this.obj)
    } else if (this.hier_type == 'activity') {
      for (let i = 0; i < this.allActivityHier.length; i++) {
        if (this.allActivityHier[i]['leaf_cd'] == this.HierSelectObj['leaf_cd']) {
          this.obj['act_desc'] = this.allActivityHier[i]['desc'];
          this.obj['act_cd'] = this.allActivityHier[i]['leaf_cd'];
          this.obj['act_lvl'] = this.allActivityHier[i]['level'];
          this.obj['act_obj']=this.allActivityHier[i]

        }
      }
    } else if (this.hier_type == 'project') {
      for (let i = 0; i < this.allProjectHier.length; i++) {
        if (this.allProjectHier[i]['leaf_cd'] == this.HierSelectObj['leaf_cd']) {
          this.obj['proj_desc'] = this.allProjectHier[i]['desc'];
          this.obj['proj_cd'] = this.allProjectHier[i]['leaf_cd'];
          this.obj['proj_lvl'] = this.allProjectHier[i]['level'];
          this.obj['proj_obj']=this.allProjectHier[i]

        }
      }
    } else if (this.hier_type == 'product') {
      for (let i = 0; i < this.allProductHier.length; i++) {
        if (this.allProductHier[i]['leaf_cd'] == this.HierSelectObj['leaf_cd']) {
          this.obj['prod_cd'] = this.allProductHier[i]['leaf_cd'];
          this.obj['prod_desc'] = this.allProductHier[i]['desc'];
          this.obj['prod_lvl'] = this.allProductHier[i]['level'];
          this.obj['prod_obj']=this.allProductHier[i]

        }
      }
    }

    $('#selectCreate').modal('hide');


  }
  async getAllParties() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.settingService.getPartyInfo(JSON.stringify(obj));
    if (resp['error'] == false) {
      console.log(resp)
      this.allParty = resp.data;
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Error while getting  all party list!", 'error');

    }
  }
  setPartyData() {
    for (let i = 0; i < this.allParty.length; i++) {
      if (this.obj['party_le_id'] == this.allParty[i]['le_id']) {
        this.obj['party_legal_name'] = this.allParty[i]['party_legal_name']
        this.obj['party_phone_no'] = this.allParty[i]['party_phone_no']
        this.obj['party_email'] = this.allParty[i]['party_email']
      }
    }
  }
  async getAllWork() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.workS.getWorkList(obj);
    if (resp['error'] == false) {
      this.allSal = resp.data;
      for (let i = 0; i < this.allSal.length; i++) {
        for (let j = 0; j < this.allParty.length; j++) {
          if (this.allParty[j]['le_id'] == this.allSal[i]['party_le_id']) {
            this.allSal[i]['party_legal_name'] = this.allParty[j]['party_legal_name']
          }
        }
      }
      this.datasource = new MatTableDataSource(this.allSal)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
      this.spinner.hide();
      this.refresh()

    } else {
      this.spinner.hide();
      swal.fire("Error", "...Error while getting  all sal list!", 'error');

    }
  }
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  async submit() {
    this.spinner.show()
    this.obj['create_user_id'] = this.user_id
    this.obj['b_acct_id'] = this.erpUser.b_acct_id;
    this.obj['runnig_bill_no']=0
    console.log(this.obj)
    var resp = await this.workS.createWork(this.obj);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.getAllWork()
      $('.nav-tabs a[href="#tab-1"]').tab('show')
      swal.fire('Success...', 'Work Created Successfully', 'success')
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Error While Creating", 'error');
    }

  }
  async update() {
    this.spinner.show()
    this.obj['update_user_id'] = this.user_id
    this.obj['b_acct_id'] = this.b_acct_id
    var resp = await this.workS.updateWork(this.obj);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.getAllWork()
      swal.fire('Success...', 'Work Updated Successfully', 'success')
      $('.nav-tabs a[href="#tab-1"]').tab('show')
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Error While Updating", 'error');

    }
  }
  refresh() {
    this.obj = {}
  }
  async delete(data) {
    this.spinner.show()
    this.obj['id'] = data['id']
    this.obj['b_acct_id'] = this.b_acct_id
    console.log(this.obj);
    var resp = await this.workS.deleteWork(this.obj);
    if (resp['error'] == false) {
      this.spinner.hide()
      this.getAllWork()
      swal.fire('Success...', 'Work Deleted Successfully', 'success')
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Error While Deleting", 'error');
    }
  }
  async listfunc(){
    this.create_flag=false;
    this.list_flag=true;
    this.update_flag=false;
    this.refresh()
   
    }
  open_update(element) {
    this.create_flag=false;
    this.list_flag=false;
    this.update_flag=true
    this.obj = Object.assign({}, element);
    this.setPartyData()
    $('.nav-tabs a[href="#tab-3"]').tab('show')
  }

}
