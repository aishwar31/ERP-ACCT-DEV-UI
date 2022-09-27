import { Component, OnInit, ViewChild } from '@angular/core';

import { HierarchyService } from '../../service/hierarchy.service';
import { MainService } from '../../service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { OrgHierService } from '../../service/org-hier.service'
import { Router } from '@angular/router';
import { element } from 'protractor';
import swal from 'sweetalert2';
import { yearsPerPage } from '@angular/material/datepicker';

declare var $: any;


 
 
@Component({
  selector: 'app-org-hier',
  templateUrl: './org-hier.component.html',
  styleUrls: ['./org-hier.component.css']
})
export class OrgHierComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sortCol2') sortCol2: MatSort;
  constructor(private hierarchyService: HierarchyService, private orgHierService: OrgHierService, public mainService: MainService, private router: Router, private spinner: NgxSpinnerService,) { }
  displayedColumns = ['id', 'hier_purpose', 'org_hier_code', 'hier_desc', 'action'];
  displayedColumns1 = ['leaf_node_type', 'leaf_code_desc', 'lvl1_node_type', 'lvl1_code_desc', 'lvl2_node_type', 'lvl2_code_desc', 'lvl3_node_type', 'lvl3_code_desc', 'lvl4_node_type', 'lvl4_code_desc', 'lvl5_node_type', 'lvl5_code_desc', 'lvl6_node_type', 'lvl6_code_desc', 'lvl7_node_type', 'lvl7_code_desc', 'is_cc', 'action']
  flagObj = { 1: 'YES', 0: 'NO' }
  datasource;
  list_flag = true
  view_flag = false
  dataSource
  erpUser;
  b_acct_id;
  unique = [];
  unique_leaf = [];
  allOrgHier = [];
  orgHierarchy = [];
  level1 = []
  level2 = []
  level3 = []
  level4 = []
  level5 = []
  level6 = []
  level7 = []
  is_cost_center = false

  obj = { buss_func_type: "Cost Center" }
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    this.obj['org_hier_code'] = 'FIN'

    await this.getOrgHier()
    await this.getAllProjectHier()

  }
  allProjectHier = []
  async getAllProjectHier() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name'] = 'proj_hier';
    var resp = await this.hierarchyService.getProjectHierarchy(obj);
    console.log(resp)
    if (resp['error'] == false) {
      this.allProjectHier = resp.data;

      this.spinner.hide();
    } else {
      this.spinner.hide()
    }
  }
  async listfunc() {
    this.list_flag = true;
    this.view_flag = false
    await this.getOrgHier()
    await this.getAllProjectHier()

  }

  async createHier() {
    this.spinner.show()

    this.obj['b_acct_id'] = this.b_acct_id
    this.obj['create_user_id'] = this.erpUser.user_id
    this.obj['status'] = 'ACTIVE'

    console.log(this.obj)

    var resp = await this.orgHierService.addHier(this.obj);

    if (resp['error'] == false) {
      this.spinner.hide()
      await this.getOrgHier()
      swal.fire("Success", "...", resp['data']);


    }
    else {
      console.log('ERROR')
      this.spinner.hide()
      swal.fire("Error", "...", resp['data']);

    }
  }

  async getOrgHier() {
    this.spinner.show()
    var ob = new Object;
    ob['b_acct_id'] = this.b_acct_id

    var resp = await this.orgHierService.getOrgHier(ob);

    if (resp['error'] == false) {
      this.spinner.hide()
      this.allOrgHier = resp['data']
      this.datasource = new MatTableDataSource(this.allOrgHier);
      this.datasource.sort = this.sort;
      this.datasource.paginator = this.paginator;
    }
    else {
      console.log('ERROR')
      this.spinner.hide()
      swal.fire("Error", "...", resp['data']);

    }
  }




  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter1(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openMove(element){
    $('#selectCreate').modal('show');
    this.refresh()
    this.obj['current_obj']=Object.assign({},element)

  }

  async SubmitListHierforMove(){

    // console.log(this.allOrgHier);
    console.log(this.orgHierarchy);
    console.log(this.currentHierarchy);
    

    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['leaf_cd'] == this.currentHierarchy['leaf_cd']) {
        this.obj['org_desc'] = this.orgHierarchy[i]['desc'];
        this.obj['org_cd'] = this.orgHierarchy[i]['leaf_cd'];
        this.obj['org_lvl'] = this.orgHierarchy[i]['level'];
        this.obj['destination_obj']=this.orgHierarchy[i]
      }
    }
    this.obj['create_user_id'] = this.erpUser.user_id;
    this.obj['b_acct_id'] = this.b_acct_id;
    this.obj['table_name'] = 'org_hier_xref_levels';
    console.log(this.obj)
    var resp = await this.orgHierService.moveOrganizationHierarchy(this.obj);
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide();

      await this.getOrgHier();
      swal.fire('Success', 'Move Successfully!');
    } else {
      this.spinner.hide();
      swal.fire('Error', resp.data);
    }
    this.refresh()
  }


  async delete(element) {
    this.spinner.show()
    let ob = new Object
    ob['b_acct_id'] = this.b_acct_id
    ob['update_user_id'] = this.erpUser.user_id
    ob['status'] = 'INACTIVE'
    ob['org_hier_code'] = element['org_hier_code']


    console.log(this.obj)

    var resp = await this.orgHierService.updateorgHierstatus(ob);

    if (resp['error'] == false) {
      this.spinner.hide()
      await this.getOrgHier()
      swal.fire("Success", "Deleted Successfully");


    }
    else {
      console.log('ERROR')
      this.spinner.hide()
      swal.fire("Error", "...", resp['data']);

    }
  }


  viewObj = {}
  hier = []
  async view(element) {
    this.view_flag = true
    this.list_flag = false
    $('.nav-tabs a[href="#tab-2"]').tab('show')
    this.viewObj = Object.assign({}, element);
    var ob = new Object;
    ob['b_acct_id'] = this.b_acct_id
    ob['org_hier_code'] = this.viewObj['org_hier_code']

    var resp = await this.orgHierService.getHierarchy(ob);
    console.log(resp);

    if (resp['error'] == false) {
      this.spinner.hide()
      let arr = resp['data']
      this.orgHierarchy = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]['is_cc'] != 1) {
          this.orgHierarchy.push(arr[i])
        }
      }
      console.log(this.orgHierarchy);
      this.dataSource = new MatTableDataSource(arr);
      this.dataSource.sort = this.sortCol2;
      this.dataSource.paginator = this.paginator1;
    }
    else {
      console.log('ERROR')
      this.spinner.hide()
      swal.fire("Error", "...", resp['data']);

    }

  }

  async add() {
    await this.refresh()

    $('#myModal3').modal('show');

  }


  async open_update(element) {
    this.obj = Object.assign({}, element)

    $('#myModal2').modal('show');
  }


  async update() {
    // this.spinner.show()

    this.obj['b_acct_id'] = this.b_acct_id
    this.obj['update_user_id'] = this.erpUser.user_id

    console.log(this.obj)

    var resp = await this.orgHierService.updateOrgHier(this.obj);

    if (resp['error'] == false) {
      this.spinner.hide()
      await this.getOrgHier()
      swal.fire("Success", "Updated Successfully");


    }
    else {
      console.log('ERROR')
      this.spinner.hide()
      swal.fire("Error", "...", resp['data']);

    }
  }
  async open_update2(element) {
    this.currentHierarchy = Object.assign({}, element)
    $('#myModal4').modal('show');
    console.log(this.currentHierarchy)
    await this.refresh()


    for (let i = 0; i < 8; i++) {
      if (element['lvl' + i + "_cd"] == element['leaf_cd']) {
        this.updateLevel = i
      }
    }




    this.currentHierarchy = Object.assign({}, element);
    await this.onChangeLvl1();
    this.currentHierarchy = Object.assign({}, element);

    await this.onChangeLvl2();
    this.currentHierarchy = Object.assign({}, element);

    await this.onChangeLvl3();
    this.currentHierarchy = Object.assign({}, element);

    await this.onChangeLvl4();
    this.currentHierarchy = Object.assign({}, element);

    await this.onChangeLvl5();
    this.currentHierarchy = Object.assign({}, element);

    await this.onChangeLvl6();
    this.currentHierarchy = Object.assign({}, element);
    await this.onChangeLvl7();
    this.currentHierarchy = Object.assign({}, element);


    this.spinner.hide()
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['lvl1_cd'] == this.currentHierarchy['lvl1_cd']) {
        let hier_row = this.orgHierarchy[i]
        let keys = Object.keys(hier_row)
        for (let j = 0; j < keys.length; j++) {
          if (!this.unique.includes(hier_row[keys[j]])) {
            this.unique.push(hier_row[keys[j]])

          }

        }
        this.unique_leaf.push(hier_row['leaf_cd'])
      }
    }

  }
  flags = 0
  updateLevel = 0
  currentHierarchy = {}
  async updateHier() {

    //  this.spinner.show();
    this.currentHierarchy['b_acct_id'] = this.b_acct_id
    this.currentHierarchy['update_user_id'] = this.erpUser.user_id
    if (this.currentHierarchy['lvl' + this.updateLevel + "_type"] == 'text') {
      for (let i = 1; i < 8; i++) {

        if (this.currentHierarchy['lvl' + i + '_type'] != undefined) {
          if (this.currentHierarchy['lvl' + i + '_type'] != '') {

            if (this.unique.includes(this.currentHierarchy['lvl' + i + '_cd'])) {

              swal.fire('Error', "Duplicate value of " + this.currentHierarchy['lvl' + i + '_cd']);
              return;

            }


          }
        }
      }
    }
    var resp = await this.orgHierService.updateHierarchy(this.currentHierarchy);
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide();
      await this.view(this.viewObj);
      swal.fire('Success', "Update Successfully!");

    } else {
      swal.fire('Error', resp.data);
      this.spinner.hide();
    }

    // if (this.flags == 1) {
    //   swal.fire({
    //     title: 'You are about to change the hierarchy structure. This may impact other business functions that use this hierarchy such as accounting rules created using nodes from this hierarchy, reporting being performed using nodes of this hierarchy. Are you sure you want to do this? If not sure please press cancel and consult your administrator before undertaking this operation. If you are sure then press submit to make this change permanent.',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, Update it!'
    //   }).then((result) => {
    //     if (result.value) {
    //       for (let i = 0; i < 8; i++) {
    //         if (element['lvl' + i + "_cd"] == element['leaf_cd']) {
    //           this.updateLevel = i
    //         }
    //       }
    //     }
    //     else {
    //       this.refresh()
    //     }
    //   })
    // }


  }
  async onChangeLvl1() {
    console.log(this.level1);
    console.log(this.currentHierarchy);
    console.log(this.orgHierarchy);
    
    for (let i = 0; i < this.level1.length; i++) {
      if (this.level1[i]['lvl1_cd'] == this.currentHierarchy['lvl1_cd']) {
        this.currentHierarchy['lvl1_value'] = this.level1[i]['lvl1_value']
        this.currentHierarchy['lvl1_node_type'] = this.level1[i]['lvl1_node_type']

      }
    }
    let temp = []
    this.level2 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['lvl1_cd'] == this.currentHierarchy['lvl1_cd']) {
        let hier_row = this.orgHierarchy[i]
        let keys = Object.keys(hier_row)
        for (let j = 0; j < keys.length; j++) {
          if (!this.unique.includes(hier_row[keys[j]])) {
            this.unique.push(hier_row[keys[j]])
          }
        } this.unique_leaf.push(hier_row['leaf_cd'])
        if (this.orgHierarchy[i]['lvl2_cd'] != null && this.orgHierarchy[i]['lvl2_cd'] != '') {
          if (!temp.includes(this.orgHierarchy[i]['lvl2_cd'])) {
            temp.push(this.orgHierarchy[i]['lvl2_cd'])
            let ob = new Object()
            ob['lvl2_cd'] = this.orgHierarchy[i]['lvl2_cd']
            ob['lvl2_value'] = this.orgHierarchy[i]['lvl2_value']
            ob['lvl2_node_type'] = this.orgHierarchy[i]['lvl2_node_type']
            this.level2.push(ob)
          }
        }
      }

    }
    this.level3 = []
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []
    console.log(this.level2)
    for (let i = 2; i < 8; i++) {
      this.currentHierarchy['lvl' + i + '_cd'] = null
      this.currentHierarchy['lvl' + i + '_value'] = null
      this.currentHierarchy['lvl' + i + '_node_type'] = null
    }

    await this.makingLeafValues()


  }

  async onChangeLvl2() {
    for (let i = 0; i < this.level2.length; i++) {
      if (this.level2[i]['lvl2_cd'] == this.currentHierarchy['lvl2_cd']) {
        this.currentHierarchy['lvl2_value'] = this.level2[i]['lvl2_value']
        this.currentHierarchy['lvl2_node_type'] = this.level2[i]['lvl2_node_type']

      }
    }
    let temp = []
    this.level3 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['lvl2_cd'] == this.currentHierarchy['lvl2_cd']) {
        if (this.orgHierarchy[i]['lvl3_cd'] != null && this.orgHierarchy[i]['lvl3_cd'] != '') {
          if (!temp.includes(this.orgHierarchy[i]['lvl3_cd'])) {
            temp.push(this.orgHierarchy[i]['lvl3_cd'])
            let ob = new Object()
            ob['lvl3_cd'] = this.orgHierarchy[i]['lvl3_cd']
            ob['lvl3_value'] = this.orgHierarchy[i]['lvl3_value']
            ob['lvl3_node_type'] = this.orgHierarchy[i]['lvl3_node_type']
            this.level3.push(ob)
          }
        }
      }
    }
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []

    for (let i = 3; i < 8; i++) {
      this.currentHierarchy['lvl' + i + '_cd'] = null
      this.currentHierarchy['lvl' + i + '_value'] = null
      this.currentHierarchy['lvl' + i + '_node_type'] = null
    }

    await this.makingLeafValues()


  }


  async onChangeLvl3() {
    for (let i = 0; i < this.level3.length; i++) {
      if (this.level3[i]['lvl3_cd'] == this.currentHierarchy['lvl3_cd']) {
        this.currentHierarchy['lvl3_value'] = this.level3[i]['lvl3_value']
        this.currentHierarchy['lvl3_node_type'] = this.level3[i]['lvl3_node_type']

      }
    }
    let temp = []
    this.level4 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['lvl3_cd'] == this.currentHierarchy['lvl3_cd']) {
        if (this.orgHierarchy[i]['lvl4_cd'] != null && this.orgHierarchy[i]['lvl4_cd'] != '') {

          if (!temp.includes(this.orgHierarchy[i]['lvl4_cd'])) {
            temp.push(this.orgHierarchy[i]['lvl4_cd'])
            let ob = new Object()
            ob['lvl4_cd'] = this.orgHierarchy[i]['lvl4_cd']
            ob['lvl4_value'] = this.orgHierarchy[i]['lvl4_value']
            ob['lvl4_node_type'] = this.orgHierarchy[i]['lvl4_node_type']
            this.level4.push(ob)
          }
        }
      }
    }
    this.level5 = []
    this.level6 = []
    this.level7 = []

    for (let i = 4; i < 8; i++) {
      this.currentHierarchy['lvl' + i + '_cd'] = null
      this.currentHierarchy['lvl' + i + '_value'] = null
      this.currentHierarchy['lvl' + i + '_node_type'] = null
    }


    await this.makingLeafValues()

  }

  async onChangeLvl4() {
    for (let i = 0; i < this.level4.length; i++) {
      if (this.level4[i]['lvl4_cd'] == this.currentHierarchy['lvl4_cd']) {
        this.currentHierarchy['lvl4_value'] = this.level4[i]['lvl4_value']
        this.currentHierarchy['lvl4_node_type'] = this.level4[i]['lvl4_node_type']

      }
    }
    let temp = []
    this.level5 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['lvl4_cd'] == this.currentHierarchy['lvl4_cd']) {
        if (this.orgHierarchy[i]['lvl5_cd'] != null && this.orgHierarchy[i]['lvl5_cd'] != '') {

          if (!temp.includes(this.orgHierarchy[i]['lvl5_cd'])) {
            temp.push(this.orgHierarchy[i]['lvl5_cd'])
            let ob = new Object()
            ob['lvl5_cd'] = this.orgHierarchy[i]['lvl5_cd']
            ob['lvl5_value'] = this.orgHierarchy[i]['lvl5_value']
            ob['lvl5_node_type'] = this.orgHierarchy[i]['lvl5_node_type']
            this.level5.push(ob)
          }
        }
      }
    }
    this.level6 = []
    this.level7 = []

    for (let i = 5; i < 8; i++) {
      this.currentHierarchy['lvl' + i + '_cd'] = null
      this.currentHierarchy['lvl' + i + '_value'] = null
      this.currentHierarchy['lvl' + i + '_node_type'] = null
    }

    await this.makingLeafValues()


  }

  async onChangeLvl5() {
    for (let i = 0; i < this.level5.length; i++) {
      if (this.level5[i]['lvl5_cd'] == this.currentHierarchy['lvl5_cd']) {
        this.currentHierarchy['lvl5_value'] = this.level5[i]['lvl5_value']
        this.currentHierarchy['lvl5_node_type'] = this.level5[i]['lvl5_node_type']

      }
    }
    let temp = []
    this.level6 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['lvl5_cd'] == this.currentHierarchy['lvl5_cd']) {
        if (this.orgHierarchy[i]['lvl6_cd'] != null && this.orgHierarchy[i]['lvl6_cd'] != '') {

          if (!temp.includes(this.orgHierarchy[i]['lvl6_cd'])) {
            temp.push(this.orgHierarchy[i]['lvl6_cd'])
            let ob = new Object()
            ob['lvl6_cd'] = this.orgHierarchy[i]['lvl6_cd']
            ob['lvl6_value'] = this.orgHierarchy[i]['lvl6_value']
            ob['lvl6_node_type'] = this.orgHierarchy[i]['lvl6_node_type']
            this.level6.push(ob)
          }
        }
      }
    }
    this.level7 = []

    for (let i = 6; i < 8; i++) {
      this.currentHierarchy['lvl' + i + '_cd'] = null
      this.currentHierarchy['lvl' + i + '_value'] = null
      this.currentHierarchy['lvl' + i + '_node_type'] = null
    }

    await this.makingLeafValues()


  }


  async onChangeLvl6() {
    for (let i = 0; i < this.level6.length; i++) {
      if (this.level6[i]['lvl6_cd'] == this.currentHierarchy['lvl6_cd']) {
        this.currentHierarchy['lvl6_value'] = this.level6[i]['lvl6_value']
        this.currentHierarchy['lvl6_node_type'] = this.level6[i]['lvl6_node_type']

      }
    }
    let temp = []
    this.level7 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (this.orgHierarchy[i]['lvl6_cd'] == this.currentHierarchy['lvl6_cd']) {
        if (this.orgHierarchy[i]['lvl7_cd'] != null && this.orgHierarchy[i]['lvl7_cd'] != '') {

          if (!temp.includes(this.orgHierarchy[i]['lvl7_cd'])) {
            temp.push(this.orgHierarchy[i]['lvl7_cd'])
            let ob = new Object()
            ob['lvl7_cd'] = this.orgHierarchy[i]['lvl7_cd']
            ob['lvl7_value'] = this.orgHierarchy[i]['lvl7_value']
            ob['lvl7_node_type'] = this.orgHierarchy[i]['lvl7_node_type']
            this.level7.push(ob)
          }
        }
      }
    }

    for (let i = 7; i < 8; i++) {
      this.currentHierarchy['lvl' + i + '_cd'] = null
      this.currentHierarchy['lvl' + i + '_value'] = null
      this.currentHierarchy['lvl' + i + '_node_type'] = null
    }

    await this.makingLeafValues()
  }
  async onChangeLvl7() {
    for (let i = 0; i < this.level7.length; i++) {
      if (this.level7[i]['lvl7_cd'] == this.currentHierarchy['lvl7_cd']) {
        this.obj['lvl7_value'] = this.level7[i]['lvl7_value']
      }
    }

    await this.makingLeafValues()



  }
  async makingLeafValues() {

    if (this.currentHierarchy['lvl7_cd'] != undefined && this.currentHierarchy['lvl7_cd'] != '' && this.currentHierarchy['lvl7_cd'] != null) {
      this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl7_cd']
      this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl7_value']
      this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['lvl7_node_type']
    } else if (this.currentHierarchy['lvl6_cd'] != undefined && this.currentHierarchy['lvl6_cd'] != '' && this.currentHierarchy['lvl6_cd'] != null) {
      this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl6_cd']
      this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl6_value']
      this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['lvl6_node_type']
    } else if (this.currentHierarchy['lvl5_cd'] != undefined && this.currentHierarchy['lvl5_cd'] != '' && this.currentHierarchy['lvl5_cd'] != null) {
      this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl5_cd']
      this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl5_value']
      this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['lvl5_node_type']
    } else if (this.currentHierarchy['lvl4_cd'] != undefined && this.currentHierarchy['lvl4_cd'] != '' && this.currentHierarchy['lvl4_cd'] != null) {
      this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl4_cd']
      this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl4_value']
      this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['lvl4_node_type']
    } else if (this.currentHierarchy['lvl3_cd'] != undefined && this.currentHierarchy['lvl3_cd'] != '' && this.currentHierarchy['lvl3_cd'] != null) {
      this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl3_cd']
      this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl3_value']
      this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['lvl3_node_type']
    } else if (this.currentHierarchy['lvl2_cd'] != undefined && this.currentHierarchy['lvl2_cd'] != '' && this.currentHierarchy['lvl2_cd'] != null) {
      this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl2_cd']
      this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl2_value']
      this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['lvl2_node_type']
    } else if (this.currentHierarchy['lvl1_cd'] != undefined && this.currentHierarchy['lvl1_cd'] != '' && this.currentHierarchy['lvl1_cd'] != null) {
      this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl1_cd']
      this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl1_value']
      this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['lvl1_node_type']
    }


  }


  async addNew(i) {
    if (this.currentHierarchy['lvl' + i + '_type'] == 'text') {
      this.currentHierarchy['lvl' + i + '_type'] = ''

    } else {
      this.currentHierarchy['lvl' + i + '_type'] = 'text'

    }
    this.currentHierarchy['lvl' + i + '_cd'] = null
    this.currentHierarchy['lvl' + i + '_value'] = null
    this.currentHierarchy['lvl' + i + '_node_type'] = null
    for (let j = i; j < 8; j++) {
      if (this.currentHierarchy['lvl' + j + '_type'] != 'text') {
        this.currentHierarchy['lvl' + j + '_cd'] = null
        this.currentHierarchy['lvl' + j + '_value'] = null
        this.currentHierarchy['lvl' + i + '_node_type'] = null
      }

    }
    await this.makingLeafValues()

  }
  async save() {
    this.currentHierarchy['b_acct_id'] = this.b_acct_id
    this.currentHierarchy['create_user_id'] = this.erpUser.user_id
    this.currentHierarchy['org_hier_code'] = this.viewObj['org_hier_code']
    let costCenterCount = []
    for (let i = 1; i < 8; i++) {
      if (this.currentHierarchy['lvl' + i + '_node_type'] == 'Cost Center') {
        costCenterCount.push(this.currentHierarchy['lvl' + i + '_cd'])
      }

      if (this.currentHierarchy['lvl' + i + '_type'] != undefined) {
        if (this.currentHierarchy['lvl' + i + '_type'] != '') {
          if (this.unique.includes(this.currentHierarchy['lvl' + i + '_cd'])) {
            swal.fire('Error', "Duplicate value " + this.currentHierarchy['lvl' + i + '_cd']);
            return;
          }
        }
      }
    }


    if (this.unique_leaf.includes(this.currentHierarchy['leaf_cd'])) {
      swal.fire('Error', "Duplicate leaf " + this.currentHierarchy['leaf_cd']);


      return;
    }
    if (costCenterCount.length > 1) {
      swal.fire('Error', "");


      return;
    }

    if (this.is_cost_center == true) {
      this.currentHierarchy['is_cc'] = 1
      let resp1 = await this.createProjectHier()
      if (resp1['error'] == false) {
        var resp = await this.orgHierService.createHierarchy(this.currentHierarchy);
        console.log(resp)
        if (resp['error'] == false) {
          this.spinner.hide()
          await this.view(this.viewObj);
          swal.fire("Success", 'Added Sucessfully');
          this.refresh();
        }
        else {

          this.spinner.hide()
          swal.fire("Error", "...", resp['data']);

        }
      } else {
        this.spinner.hide()
        swal.fire("Error", "...", resp1['data']);
      }

    } else {
      this.currentHierarchy['is_cc'] = 0
      var resp = await this.orgHierService.createHierarchy(this.currentHierarchy);
      console.log(resp)
      if (resp['error'] == false) {
        this.spinner.hide()
        await this.view(this.viewObj);
        swal.fire("Success", 'Added Sucessfully');
        this.refresh();
      }
      else {

        this.spinner.hide()
        swal.fire("Error", "...", resp['data']);

      }
    }


  }

  async createProjectHier() {
    let ob = new Object
    ob['b_acct_id'] = this.b_acct_id
    ob['create_user_id'] = this.erpUser.user_id
    if (this.allProjectHier.length > 0) {
      ob['lvl1_cd'] = this.allProjectHier[0]['lvl1_cd']
      ob['lvl1_value'] = this.allProjectHier[0]['lvl1_value']
      ob['lvl1_user_cd'] = this.allProjectHier[0]['lvl1_user_cd']
      ob['lvl1_node_type'] = this.allProjectHier[0]['lvl1_node_type']

    } else {
      ob['lvl1_cd'] = 1
      ob['lvl1_value'] = 'All Projects'
      ob['lvl1_type'] = 'text'
      ob['lvl1_user_cd'] = 'root'
      ob['lvl1_node_type'] = 'root'
    }
    ob['lvl2_user_cd'] = this.currentHierarchy['leaf_cd']
    ob['lvl2_node_type'] = this.currentHierarchy['leaf_node_type']
    // ob['lvl2_cd'] = this.currentHierarchy['leaf_cd']
    ob['lvl2_value'] = this.currentHierarchy['leaf_value']
    ob['lvl2_type'] = 'text'
    // ob['leaf_cd'] = this.currentHierarchy['leaf_cd']
    ob['leaf_value'] = this.currentHierarchy['leaf_value']
    ob['table_name'] = 'proj_hier';
    ob['leaf_user_cd'] = this.currentHierarchy['leaf_cd']
    ob['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
    var resp = await this.hierarchyService.createProjectHierarchy(ob);
    // console.log(resp)
    // if (resp['error'] == false) {
    //   // return resp

    // } else {
    //   swal.fire("Error", 'Error while creating project.');
    //   // return resp

    // }
    return resp;
  }
  async refresh() {
    let temp = []
    this.level1 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {
      if (!temp.includes(this.orgHierarchy[i]['lvl1_cd'])) {
        temp.push(this.orgHierarchy[i]['lvl1_cd'])
        let ob = new Object()
        ob['lvl1_cd'] = this.orgHierarchy[i]['lvl1_cd']
        ob['lvl1_value'] = this.orgHierarchy[i]['lvl1_value']
        ob['lvl1_node_type'] = this.orgHierarchy[i]['lvl1_node_type']



        this.level1.push(ob)
      }
    }
    this.currentHierarchy = new Object()
    console.log(this.level1)

    this.level2 = []

    this.level3 = []
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []
    for (let i = 0; i < this.orgHierarchy.length; i++) {


      let hier_row = this.orgHierarchy[i]
      let keys = Object.keys(hier_row)
      for (let j = 0; j < keys.length; j++) {
        if (!this.unique.includes(hier_row[keys[j]])) {
          this.unique.push(hier_row[keys[j]])
        }
      } this.unique_leaf.push(hier_row['leaf_cd'])


    }
  }
  async delete2(element) {
    // this.spinner.show()
    let ob = Object.assign({}, element)
    ob['b_acct_id'] = this.b_acct_id
    ob['update_user_id'] = this.erpUser.user_id
    ob['status'] = 'INACTIVE'


    console.log(ob)

    var resp = await this.orgHierService.deleteHierarchy(ob);
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide()
      await this.view(this.viewObj)
      swal.fire("Success", "Deleted Successfully")
    }
    else {
      this.spinner.hide()
      swal.fire("Error", resp.data);

    }
  }
}
