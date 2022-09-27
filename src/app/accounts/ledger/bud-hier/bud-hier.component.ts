import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { HierarchyService } from '../../service/hierarchy.service';
import { FileUploader } from 'ng2-file-upload';
import { MainService } from '../../service/main.service';
import swal from 'sweetalert2';
import { CostCenterService } from '../../service/cost-center.service';

declare var $: any
 
 
@Component({
  selector: 'app-bud-hier',
  templateUrl: './bud-hier.component.html',
  styleUrls: ['./bud-hier.component.css']
})
export class BudHierComponent implements OnInit {

  constructor(public costCenterService: CostCenterService, public mainService: MainService, private router: Router, private spinner: NgxSpinnerService, private snackBar: MatSnackBar, private hierarchyService: HierarchyService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['desc', 'proposed_amount', 'actual_amount', 'action'];

  datasource;
  erpUser

  obj = {};
  b_acct_id
  allHier = [];
  unique = []
  unique_leaf = [];
  allProjectHier = [];
  allProductHier = [];
  allActivityHier = [];
  level1 = [];
  level2 = []
  level3 = []
  level4 = []
  level5 = []
  level6 = []
  level7 = []
  allocated = []

  create_flag = false;
  list_flag = true;
  update_flag = false;
  upload_flag = false
  scaleArr = [{ type: 'Actual', value: 1 }, { type: 'Whole Number', value: 1 }, { type: 'Hundreds', value: 100 }, { type: 'Thousands', value: 1000 }, { type: 'Lakhs', value: 100000 }, { type: 'Crores', value: 10000000 }]
  scaleObj = { scale: 'Actual' }



  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    this.httpUrl = this.mainService.httpUrl;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'file' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    await this.getAllHier();
    await this.getCostcenter()
    // this.getAllProject();
    // this.getAllProduct();
    // this.getAllActivity();
  }

  allCostCenter = []
  CostCenterCode = []
  async getCostcenter() {

    this.spinner.show();
    this.obj['b_acct_id'] = this.b_acct_id;

    console.log(this.obj)

    var resp = await this.costCenterService.getCost(this.obj);


    if (resp['error'] == false) {

      this.allCostCenter = resp.data
      // for (let i = 0; i < this.allCostCenter.length; i++) {
      //   this.CostCenterCode.push(this.allCostCenter[i]['cc_code'])
      // }
      // console.log(this.CostCenterCode);

      this.spinner.hide();

    }
  }
  // async getAllActivity(){
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id;
  //   obj['table_name']='activity_hier';
  //   var resp = await this.hierarchyService.getHierarchy(obj);
  //   if (resp['error'] == false) {
  //     this.allActivityHier = resp.data;
  //   } else {
  //   }
  // }

  // async getAllProject(){
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id;
  //   obj['table_name']='proj_hier';
  //   var resp = await this.hierarchyService.getHierarchy(obj);
  //   if (resp['error'] == false) {
  //     this.allProjectHier = resp.data;
  //   } else {
  //   }
  // }

  // async getAllProduct(){
  //   var obj = new Object();
  //   obj['b_acct_id'] = this.b_acct_id;
  //   obj['table_name']='prod_hier';
  //   var resp = await this.hierarchyService.getHierarchy(obj);
  //   if (resp['error'] == false) {
  //     this.allProductHier = resp.data;
  //   } else {
  //   }
  // }



  async getAllHier() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['table_name'] = 'bud_hier';
    var resp = await this.hierarchyService.getBudgetHierarchy(obj);
    console.log(resp)
    if (resp['error'] == false) {
      this.allHier = resp.data;
      for (let i = 0; i < this.allHier.length; i++) {
        console.log(this.allHier[i])
        let str = ""
        for (let j = 1; j < 8; j++) {
          if (this.allHier[i]['lvl' + j + "_cd"] != null && this.allHier[i]['lvl' + j + "_cd"] != "") {
            str += this.allHier[i]['lvl' + j + "_value"] + " > "

          }
        }

        str = str.substring(0, str.length - 2)
        this.allHier[i]['desc'] = str;
      }
      await this.changeScale()

      this.spinner.hide();
    } else {
      this.spinner.hide()
    }
  }
// async changeCostCenter(j){
//   console.log(this.obj)
//     if (this.obj['is_lvl' + j + '_cc'] == false) {
//       this.obj["lvl" + j + "_cd"] = null
//       this.obj["lvl" + j + "_value"] = null

//       for (let i = j; i < 8; i++) {
//         this.obj["lvl" + i + "_cd"] = null
//         this.obj["lvl" + i + "_value"] = null
//       }
//       let temp = j - 1
//       this.obj['leaf_cd'] = this.obj["lvl" + temp + "_cd"]
//       this.obj['leaf_value'] = this.obj["lvl" + temp + "_value"]
//       return;
//     }
    
// }
  async changeCC(j) {
    
    for (let i = 0; i < this.allCostCenter.length; i++) {
      if (this.allCostCenter[i]['cc_code'] == this.obj["lvl" + j + "_cd"]) {
        this.obj["lvl" + j + "_value"] = this.allCostCenter[i]['cc_name']
      }
    }
    await this.makingLeafValues()
    if (j == 2) {
      await this.onChangeLvl2()
    } else if (j == 3) {
      await this.onChangeLvl3()

    } else if (j == 4) {
      await this.onChangeLvl4()

    } else if (j == 5) {
      await this.onChangeLvl5()

    } else if (j == 6) {
      await this.onChangeLvl6()

    }

  }
  async changeScale() {

    let scale_value = 1;
    for (let i = 0; i < this.scaleArr.length; i++) {
      if (this.scaleArr[i]['type'] == this.scaleObj['scale']) {
        scale_value = this.scaleArr[i]['value']
      }
    }
    for (let i = 0; i < this.allHier.length; i++) {

      if (this.scaleObj['scale'] == 'Actual') {
        this.allHier[i]['scale_proposed_amount'] = Number(this.allHier[i]['proposed_amount'].toFixed(0))
        this.allHier[i]['scale_allocated_amount'] = Number(this.allHier[i]['allocated_amount'].toFixed(0))
        this.allHier[i]['scale_remaining_amount'] = Number(this.allHier[i]['remaining_amount'].toFixed(0))
        this.allHier[i]['scale_actual_amount'] = Number(this.allHier[i]['actual_amount'].toFixed(0))

      } else {

        this.allHier[i]['scale_proposed_amount'] = Number((this.allHier[i]['proposed_amount'] / scale_value).toFixed(3))
        this.allHier[i]['scale_allocated_amount'] = Number((this.allHier[i]['allocated_amount'] / scale_value).toFixed(3))
        this.allHier[i]['scale_remaining_amount'] = Number((this.allHier[i]['remaining_amount'] / scale_value).toFixed(3))
        this.allHier[i]['scale_actual_amount'] = Number((this.allHier[i]['actual_amount'] / scale_value).toFixed(3))
      }
    }
    this.datasource = new MatTableDataSource(this.allHier)
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }
  event_arr = []

  makeEventArr(budObj, prodArr, projArr, avtArr) {
    this.event_arr = []
    for (let i = 0; i < avtArr.length; i++) {

      for (let j = 0; j < prodArr.length; j++) {

        for (let k = 0; k < projArr.length; k++) {
          let obj = new Object;
          obj["event_code"] = budObj["leaf_cd"] + " - " + prodArr[j]["leaf_cd"] + " - " + projArr[k]["leaf_cd"] + " - " + avtArr[i]["leaf_cd"]
          obj["event_desc"] = budObj["leaf_value"] + " from " + avtArr[i]["leaf_value"] + " of " + prodArr[j]["leaf_value"] + " for " + projArr[k]["leaf_value"]
          obj["event_record_code"] = "R101"
          this.event_arr.push(obj)
        }

      }

    }

  }
  async create() {
    this.refresh()

    $('#myModal2').modal('show');

  }
  async save() {
    // this.spinner.show();
    this.obj['create_user_id'] = this.erpUser.user_id;
    this.obj['b_acct_id'] = this.b_acct_id;
    this.obj['table_name'] = 'bud_hier';
    //await this .makeEventArr(this.obj,this.allProductHier,this.allProjectHier,this.allActivityHier);
    this.obj['event_arr'] = [];
    let levelCC = []
    for (let i = 1; i < 8; i++) {
      // if (this.CostCenterCode.includes(this.obj['lvl' + i + '_cd'])) {
      //   levelCC.push(this.obj['lvl' + i + '_cd'])
      // }

      if (this.obj['lvl' + i + '_type'] != undefined) {
        if (this.obj['lvl' + i + '_type'] != '') {

          if (this.unique.includes(this.obj['lvl' + i + '_cd'])) {
            swal.fire('Error', "Duplicate value " + this.obj['lvl' + i + '_cd']);
            return;
          }
        }
      }
    }
    //console.log(levelCC)
    // if (levelCC.length > 1) {
    //   swal.fire('Error', "You can not add more than one costcenter in a hierarchy..");
    //   return;
    // } else if (levelCC.length == 0) {
    //   swal.fire('Error', "You must add a cost center!!");
    //   return;
    // }


    if (this.unique_leaf.includes(this.obj['leaf_cd'])) {
      swal.fire('Error', "Duplicate leaf " + this.obj['leaf_cd']);
      this.spinner.hide();

      return;
    }
    var resp = await this.hierarchyService.createBudgetHierarchy(this.obj);
    if (resp['error'] == false) {
      this.spinner.hide();
      await this.getAllHier();
      swal.fire('Success', 'Added Successfully!!!');
      this.refresh()
    } else {
      this.spinner.hide();
      swal.fire('Error', resp.data);

    }
  }

  flag = 0
  async update() {
    // this.spinner.show();

    this.obj['update_user_id'] = this.erpUser.user_id;
    this.obj['b_acct_id'] = this.b_acct_id;
    this.obj['table_name'] = 'bud_hier';



    var resp = await this.hierarchyService.updateBudgetHierarchy(this.obj);
    if (resp['error'] == false) {
      this.flag = 1
      this.spinner.hide();
      if (this.flag == 1) {
        swal.fire({
          title: 'You are about to change the hierarchy structure. This may impact other business functions that use this hierarchy such as accounting rules created using nodes from this hierarchy, reporting being performed using nodes of this hierarchy. Are you sure you want to do this? If not sure please press cancel and consult your administrator before undertaking this operation. If you are sure then press submit to make this change permanent.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Update it!'
        }).then((result) => {
          if (result.value) {
            this.getAllHier();
            this.refresh()
            swal.fire('Success', 'Updated Successfully!!!');
          }
          else {
            $("#myModal1").modal("hide");
            this.refresh()
          }
        })
      }


    } else {
      this.spinner.hide();
      swal.fire('Error', resp.data);

    }
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  openMove(element){
    $('#selectCreate').modal('show');
    this.refresh()
    this.obj['current_obj']=Object.assign({},element)

  }

  async SubmitListHierforMove(){

    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['leaf_cd'] == this.obj['leaf_cd']) {
        this.obj['bud_desc'] = this.allHier[i]['desc'];
        this.obj['bud_cd'] = this.allHier[i]['leaf_cd'];
        this.obj['bud_lvl'] = this.allHier[i]['level'];
        this.obj['destination_obj']=this.allHier[i]
      }
    }
    this.obj['create_user_id'] = this.erpUser.user_id;
    this.obj['b_acct_id'] = this.b_acct_id;
    this.obj['table_name'] = 'bud_hier';
    console.log(this.obj)
    var resp = await this.hierarchyService.moveBudgetHierarchy(this.obj);
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide();

      await this.getAllHier();
      swal.fire('Success', 'Move Successfully!');
    } else {
      this.spinner.hide();
      swal.fire('Error', resp.data);
    }
    this.refresh()
  }

  async delete(element) {
    var obj = Object.assign({}, element);
    obj['b_acct_id'] = this.b_acct_id;
    obj['id'] = element.id;
    obj['table_name'] = 'bud_hier';
    this.spinner.show()
    var resp = await this.hierarchyService.deleteBudgetHierarchy(obj);
    if (resp['error'] == false) {
      await this.getAllHier()
      this.spinner.hide();
      swal.fire('Success', 'Deleted Successfully!!!');

    } else {
      this.spinner.hide()
      swal.fire('Error', resp['data']);
    }
  }


  async listfunc() {
    this.create_flag = false;
    this.list_flag = true;
    this.update_flag = false
    this.upload_flag = false;
    await this.getAllHier();


  }
  async uploaded() {
    this.create_flag = false;
    this.upload_flag = true;
    this.update_flag = false;
    this.list_flag = false


  }
  async createNew() {
    this.create_flag = true;
    this.list_flag = false;
    this.update_flag = false
    this.upload_flag = false;

    this.refresh()
    // $(".nav-tabs nav-link").removeClass('active');

    // await $('.nav-tabs a[href="#tab-2"]').tab('show');

  }










  async onChangeLvl1() {
    for (let i = 0; i < this.level1.length; i++) {
      if (this.level1[i]['lvl1_cd'] == this.obj['lvl1_cd']) {
        this.obj['lvl1_value'] = this.level1[i]['lvl1_value']
      }
    }
    let temp = []
    this.level2 = []

    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['lvl1_cd'] == this.obj['lvl1_cd']) {
        let hier_row = this.allHier[i]
        let keys = Object.keys(hier_row)
        for (let j = 0; j < keys.length; j++) {
          if (!this.unique.includes(hier_row[keys[j]])) {
            this.unique.push(hier_row[keys[j]])
          }
        } this.unique_leaf.push(hier_row['leaf_cd'])
        if (this.allHier[i]['lvl2_cd'] != null && this.allHier[i]['lvl2_cd'] != '') {
          if (!temp.includes(this.allHier[i]['lvl2_cd'])) {
            temp.push(this.allHier[i]['lvl2_cd'])
            let ob = new Object()
            ob['lvl2_cd'] = this.allHier[i]['lvl2_cd']
            ob['lvl2_value'] = this.allHier[i]['lvl2_value']
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

    for (let i = 2; i < 8; i++) {
      this.obj['lvl' + i + '_cd'] = null
      this.obj['lvl' + i + '_value'] = null

    }

    await this.makingLeafValues()


  }

  async onChangeLvl2() {
    for (let i = 0; i < this.level2.length; i++) {
      if (this.level2[i]['lvl2_cd'] == this.obj['lvl2_cd']) {
        this.obj['lvl2_value'] = this.level2[i]['lvl2_value']
      }
    }
    let temp = []
    this.level3 = []
    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['lvl2_cd'] == this.obj['lvl2_cd']) {
        if (this.allHier[i]['lvl3_cd'] != null && this.allHier[i]['lvl3_cd'] != '') {

          if (!temp.includes(this.allHier[i]['lvl3_cd'])) {
            temp.push(this.allHier[i]['lvl3_cd'])
            let ob = new Object()
            ob['lvl3_cd'] = this.allHier[i]['lvl3_cd']
            ob['lvl3_value'] = this.allHier[i]['lvl3_value']
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
      this.obj['lvl' + i + '_cd'] = null
      this.obj['lvl' + i + '_value'] = null

    }

    await this.makingLeafValues()


  }


  async onChangeLvl3() {
    for (let i = 0; i < this.level3.length; i++) {
      if (this.level3[i]['lvl3_cd'] == this.obj['lvl3_cd']) {
        this.obj['lvl3_value'] = this.level3[i]['lvl3_value']
      }
    }
    let temp = []
    this.level4 = []
    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['lvl3_cd'] == this.obj['lvl3_cd']) {
        if (this.allHier[i]['lvl4_cd'] != null && this.allHier[i]['lvl4_cd'] != '') {

          if (!temp.includes(this.allHier[i]['lvl4_cd'])) {
            temp.push(this.allHier[i]['lvl4_cd'])
            let ob = new Object()
            ob['lvl4_cd'] = this.allHier[i]['lvl4_cd']
            ob['lvl4_value'] = this.allHier[i]['lvl4_value']
            this.level4.push(ob)
          }
        }
      }
    }
    this.level5 = []
    this.level6 = []
    this.level7 = []

    for (let i = 4; i < 8; i++) {
      this.obj['lvl' + i + '_cd'] = null
      this.obj['lvl' + i + '_value'] = null

    }


    await this.makingLeafValues()

  }

  async onChangeLvl4() {
    for (let i = 0; i < this.level4.length; i++) {
      if (this.level4[i]['lvl4_cd'] == this.obj['lvl4_cd']) {
        this.obj['lvl4_value'] = this.level4[i]['lvl4_value']
      }
    }
    let temp = []
    this.level5 = []
    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['lvl4_cd'] == this.obj['lvl4_cd']) {
        if (this.allHier[i]['lvl5_cd'] != null && this.allHier[i]['lvl5_cd'] != '') {

          if (!temp.includes(this.allHier[i]['lvl5_cd'])) {
            temp.push(this.allHier[i]['lvl5_cd'])
            let ob = new Object()
            ob['lvl5_cd'] = this.allHier[i]['lvl5_cd']
            ob['lvl5_value'] = this.allHier[i]['lvl5_value']
            this.level5.push(ob)
          }
        }
      }
    }
    this.level6 = []
    this.level7 = []

    for (let i = 5; i < 8; i++) {
      this.obj['lvl' + i + '_cd'] = null
      this.obj['lvl' + i + '_value'] = null

    }


    await this.makingLeafValues()

  }

  async onChangeLvl5() {
    for (let i = 0; i < this.level5.length; i++) {
      if (this.level5[i]['lvl5_cd'] == this.obj['lvl5_cd']) {
        this.obj['lvl5_value'] = this.level5[i]['lvl5_value']
      }
    }
    let temp = []
    this.level6 = []
    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['lvl5_cd'] == this.obj['lvl5_cd']) {
        if (this.allHier[i]['lvl6_cd'] != null && this.allHier[i]['lvl6_cd'] != '') {

          if (!temp.includes(this.allHier[i]['lvl6_cd'])) {
            temp.push(this.allHier[i]['lvl6_cd'])
            let ob = new Object()
            ob['lvl6_cd'] = this.allHier[i]['lvl6_cd']
            ob['lvl6_value'] = this.allHier[i]['lvl6_value']
            this.level6.push(ob)
          }
        }
      }

    }
    this.level7 = []

    for (let i = 6; i < 8; i++) {
      this.obj['lvl' + i + '_cd'] = null
      this.obj['lvl' + i + '_value'] = null

    }

    await this.makingLeafValues()


  }


  async onChangeLvl6() {
    for (let i = 0; i < this.level6.length; i++) {
      if (this.level6[i]['lvl6_cd'] == this.obj['lvl6_cd']) {
        this.obj['lvl6_value'] = this.level6[i]['lvl6_value']
      }
    }
    let temp = []
    this.level7 = []
    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['lvl6_cd'] == this.obj['lvl6_cd']) {
        if (this.allHier[i]['lvl7_cd'] != null && this.allHier[i]['lvl7_cd'] != '') {

          if (!temp.includes(this.allHier[i]['lvl7_cd'])) {
            temp.push(this.allHier[i]['lvl7_cd'])
            let ob = new Object()
            ob['lvl7_cd'] = this.allHier[i]['lvl7_cd']
            ob['lvl7_value'] = this.allHier[i]['lvl7_value']
            this.level7.push(ob)
          }
        }
      }

    }

    for (let i = 7; i < 8; i++) {
      this.obj['lvl' + i + '_cd'] = null
      this.obj['lvl' + i + '_value'] = null

    }

    await this.makingLeafValues()


  }
  async onChangeLvl7() {
    for (let i = 0; i < this.level7.length; i++) {
      if (this.level7[i]['lvl7_cd'] == this.obj['lvl7_cd']) {
        this.obj['lvl7_value'] = this.level7[i]['lvl7_value']
      }
    }

    await this.makingLeafValues()



  }
  allocationParentObj = {}
  realAllocationObj = {}
  childrenArr = []
  realchildrenArr = []
  async allocate(element) {
    this.childrenArr = []
    this.realchildrenArr = []

    this.refresh()
    $('#myModal3').modal('show');
    this.allocationParentObj = Object.assign({}, element)
    this.realAllocationObj = Object.assign({}, element)

    let temp_lvl = 0
    for (let i = 1; i < 8; i++) {
      if (element["lvl" + i + "_cd"] == element['leaf_cd']) {
        temp_lvl = i
      }
    }
    let next_lvl = temp_lvl + 1
    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]["lvl" + temp_lvl + "_cd"] == element['leaf_cd']) {
        if (this.allHier[i]["lvl" + next_lvl + "_cd"] == this.allHier[i]['leaf_cd']) {
          this.childrenArr.push(Object.assign({}, this.allHier[i]))
          this.realchildrenArr.push(Object.assign({}, this.allHier[i]))
        }
      }
    }

  }


  check(i) {
    if(this.childrenArr[i]['proposed_amount']==null && this.childrenArr[i]['proposed_amount'] ==undefined ){
      this.childrenArr[i]['proposed_amount'] =0
    }

    if (this.childrenArr[i]['proposed_amount'] < this.childrenArr[i]['allocated_amount']) {
      swal.fire('Error', "Proposed Amount should be greater than or equal to the Allocated Amount");
      this.childrenArr[i] = this.realchildrenArr[i]
      return;
    } else {
      this.childrenArr[i]['remaining_amount'] = this.childrenArr[i]['proposed_amount'] - this.childrenArr[i]['allocated_amount']

    }
    let parentallocatedAmount = 0
    for (let j = 0; j < this.childrenArr.length; j++) {
      parentallocatedAmount = parentallocatedAmount + Number(this.childrenArr[j]['proposed_amount'])
    }
    if (this.allocationParentObj['proposed_amount'] < parentallocatedAmount) {
      swal.fire('Error', "Sum of all children's proposed Amount should be less than or equal to the parent's proposed amount");
      this.childrenArr[i] = this.realchildrenArr[i]
      return;
    }
    this.allocationParentObj['allocated_amount'] = parentallocatedAmount
    this.allocationParentObj['remaining_amount'] = this.allocationParentObj['proposed_amount'] - parentallocatedAmount

  }
  checkRoot() {
    let parentallocatedAmount = 0
    for (let j = 0; j < this.childrenArr.length; j++) {
      parentallocatedAmount = parentallocatedAmount + Number(this.childrenArr[j]['proposed_amount'])
    }
    if (this.allocationParentObj['proposed_amount'] < parentallocatedAmount) {
      swal.fire('Error', "Proposed Amount should be greator than or equal to the allocated amount");
      this.allocationParentObj['proposed_amount'] = this.realAllocationObj['proposed_amount']
      return;
    }
    this.allocationParentObj['remaining_amount'] = this.allocationParentObj['proposed_amount'] - this.allocationParentObj['allocated_amount']

  }

  updateLevel = 0;
  //  async open_update(element) {
  //   //  this.spinner.show()
  //   this.create_flag=false;
  //     this.list_flag=false;
  //     this.update_flag=true
  //     this.upload_flag=false
  //    await this.refresh()



  //           for (let i = 0; i < 8; i++) {
  //             if (element['lvl' + i + "_cd"] == element['leaf_cd']) {
  //               this.updateLevel = i
  //             }
  //           }

  //    $('#myModal1').modal('show');
  //    for(let i=0;i<8;i++){
  //     if(element['lvl'+i+"_cd"]==element['leaf_cd']){
  //       this.updateLevel=i
  //     }
  //   }
  //     this.obj=Object.assign({},element);
  //    await this.onChangeLvl1();
  //    this.obj=Object.assign({},element);

  //    await this.onChangeLvl2();
  //    this.obj=Object.assign({},element);

  //    await this.onChangeLvl3();
  //    this.obj=Object.assign({},element);

  //    await this.onChangeLvl4();
  //    this.obj=Object.assign({},element);

  //    await this.onChangeLvl5();
  //    this.obj=Object.assign({},element);

  //    await this.onChangeLvl6();
  //    this.obj=Object.assign({},element);

  // this.spinner.hide()
  //     for (let i = 0; i < this.allHier.length; i++) {
  //       if (this.allHier[i]['lvl1_cd'] == this.obj['lvl1_cd']) {
  //         let hier_row = this.allHier[i]
  //         let keys = Object.keys(hier_row)
  //         for (let j = 0; j < keys.length; j++) {
  //           if (!this.unique.includes(hier_row[keys[j]])) {
  //             this.unique.push(hier_row[keys[j]])

  //           }

  //         }
  //         this.unique_leaf.push(hier_row['leaf_cd'])}}

  //         console.log(this.obj)
  //   }

  async open_update(element) {
    //  this.spinner.show()
    this.create_flag = false;
    this.list_flag = false;
    this.update_flag = true
    this.upload_flag = false
    await this.refresh()



    for (let i = 0; i < 8; i++) {
      if (element['lvl' + i + "_cd"] == element['leaf_cd']) {
        this.updateLevel = i
      }
    }

    $('#myModal1').modal('show');
    for (let i = 0; i < 8; i++) {
      if (element['lvl' + i + "_cd"] == element['leaf_cd']) {
        this.updateLevel = i
      }
    }
    this.obj = Object.assign({}, element);
    await this.onChangeLvl1();
    this.obj = Object.assign({}, element);

    await this.onChangeLvl2();
    this.obj = Object.assign({}, element);

    await this.onChangeLvl3();
    this.obj = Object.assign({}, element);

    await this.onChangeLvl4();
    this.obj = Object.assign({}, element);

    await this.onChangeLvl5();
    this.obj = Object.assign({}, element);

    await this.onChangeLvl6();
    this.obj = Object.assign({}, element);

    this.spinner.hide()
    for (let i = 0; i < this.allHier.length; i++) {
      if (this.allHier[i]['lvl1_cd'] == this.obj['lvl1_cd']) {
        let hier_row = this.allHier[i]
        let keys = Object.keys(hier_row)
        for (let j = 0; j < keys.length; j++) {
          if (!this.unique.includes(hier_row[keys[j]])) {
            this.unique.push(hier_row[keys[j]])

          }

        }
        this.unique_leaf.push(hier_row['leaf_cd'])
      }
    }

    console.log(this.obj)
  }

  async updateAmount() {
    this.spinner.show();
    let ob = new Object()
    ob['update_user_id'] = this.erpUser.user_id;
    ob['b_acct_id'] = this.b_acct_id;
    ob['parent_obj'] = this.allocationParentObj;
    ob['child_arr'] = this.childrenArr;
    ob['table_name'] = 'bud_hier';


    var resp = await this.hierarchyService.updateBudgetAmount(ob);
    if (resp['error'] == false) {
      this.spinner.hide();
      await this.getAllHier();
      this.refresh()
      this.childrenArr = []
      this.realchildrenArr = []
      this.allocationParentObj = Object.assign({}, {})
      this.realAllocationObj = Object.assign({}, {})

      swal.fire('Success', 'Updated Successfully!!!');
      $('#myModal3').modal('hide');
    } else {
      this.spinner.hide();
      swal.fire('Error', resp.data);

    }
  }

  refresh() {
    let temp = []
    this.level1 = []
    for (let i = 0; i < this.allHier.length; i++) {
      if (!temp.includes(this.allHier[i]['lvl1_cd'])) {
        temp.push(this.allHier[i]['lvl1_cd'])
        let ob = new Object()
        ob['lvl1_cd'] = this.allHier[i]['lvl1_cd']
        ob['lvl1_value'] = this.allHier[i]['lvl1_value']
        this.level1.push(ob)
      }
    }
    this.obj = {};
    this.level2 = []

    this.level3 = []
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []
    for (let i = 0; i < this.allHier.length; i++) {


      let hier_row = this.allHier[i]
      let keys = Object.keys(hier_row)
      for (let j = 0; j < keys.length; j++) {
        if (!this.unique.includes(hier_row[keys[j]])) {
          this.unique.push(hier_row[keys[j]])
        }
      } this.unique_leaf.push(hier_row['leaf_cd'])


    }
  }

  async addNew(i) {
    if (this.obj['lvl' + i + '_type'] == 'text') {
      this.obj['lvl' + i + '_type'] = ''

    } else {
      this.obj['lvl' + i + '_type'] = 'text'

    }
    this.obj['lvl' + i + '_cd'] = null
    this.obj['lvl' + i + '_value'] = null
    for (let j = i; j < 8; j++) {
      if (this.obj['lvl' + j + '_type'] != 'text') {
        this.obj['lvl' + j + '_cd'] = null
        this.obj['lvl' + j + '_value'] = null
      }

    }
    await this.makingLeafValues()

  }


  async makingLeafValues() {

    if (this.obj['lvl7_cd'] != undefined && this.obj['lvl7_cd'] != '' && this.obj['lvl7_cd'] != null) {
      this.obj['leaf_cd'] = this.obj['lvl7_cd']
      this.obj['leaf_value'] = this.obj['lvl7_value']
    } else if (this.obj['lvl6_cd'] != undefined && this.obj['lvl6_cd'] != '' && this.obj['lvl6_cd'] != null) {
      this.obj['leaf_cd'] = this.obj['lvl6_cd']
      this.obj['leaf_value'] = this.obj['lvl6_value']
    } else if (this.obj['lvl5_cd'] != undefined && this.obj['lvl5_cd'] != '' && this.obj['lvl5_cd'] != null) {
      this.obj['leaf_cd'] = this.obj['lvl5_cd']
      this.obj['leaf_value'] = this.obj['lvl5_value']
    } else if (this.obj['lvl4_cd'] != undefined && this.obj['lvl4_cd'] != '' && this.obj['lvl4_cd'] != null) {
      this.obj['leaf_cd'] = this.obj['lvl4_cd']
      this.obj['leaf_value'] = this.obj['lvl4_value']
    } else if (this.obj['lvl3_cd'] != undefined && this.obj['lvl3_cd'] != '' && this.obj['lvl3_cd'] != null) {
      this.obj['leaf_cd'] = this.obj['lvl3_cd']
      this.obj['leaf_value'] = this.obj['lvl3_value']
    } else if (this.obj['lvl2_cd'] != undefined && this.obj['lvl2_cd'] != '' && this.obj['lvl2_cd'] != null) {
      this.obj['leaf_cd'] = this.obj['lvl2_cd']
      this.obj['leaf_value'] = this.obj['lvl2_value']
    } else if (this.obj['lvl1_cd'] != undefined && this.obj['lvl1_cd'] != '' && this.obj['lvl1_cd'] != null) {
      this.obj['leaf_cd'] = this.obj['lvl1_cd']
      this.obj['leaf_value'] = this.obj['lvl1_value']
    }


  }

  imageBlobUrl;
  imgURL
  selectedFile: File = null;
  isUpload;
  public imagePath;
  httpUrl;
  uploader;

  onFileUpload(event, files) {
    this.selectedFile = <File>event.target.files[0];

    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
    };

  }


  is_header_present = false;
  exportTemplate() {
    var arr1 = [["", "", "", "", "Instruction to Fill The data in Sheet 2", "", "", "", ""],
    ["1", "Please use only Numbers and character and sign to fill the data", "", "", "", "", "", "", ""],
    ["2", "All Value are alpha neumeric", "", "", "", "", "", "", ""],
    ["3", "Duplicate value will be removed while processing the file", "", "", "", "", "", "", ""],
    ["4", "For a Node value enter 0 and for a Leaf Value enter 1", "", "", "", "", "", "", ""],
    ["5", "For creating hierarchy, first create a node/root then keep adding the leaf nodes below in different row as per requirement ", "", "", "", "", "", "", ""],];
    var arr2 = [["lvl1_code", "lvl1_value", "lvl2_code", "lvl2_value", "lvl3_code", "lvl3_value", "lvl4_code", "lvl4_value", "lvl5_code", "lvl5value", "lvl6_code", "lvl6_value", "lvl7_code", "lvl7_value", "leaf_code", "leaf_value"]]
    this.mainService.exportAsExcelFile(arr1, arr2, "Budget-Template")
  }
  leafDetection() {
  }
  async upload() {
    this.spinner.show();
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    const obj = new Object();
    obj['b_acct_id'] = this.erpUser.b_acct_id;
    obj['file_name'] = this.uploader.queue[0].some.name;
    var extention = obj['file_name'].split(".")
    obj['create_user_id'] = this.erpUser.user_id;
    obj['is_header_present'] = 1;
    obj['table_name'] = 'bud_hier';

    obj["event_record_code"] = "R101"
    this.spinner.show()
    if (extention[1].toLowerCase() == 'xlsx') {
      const params = JSON.stringify(obj);
      this.uploader.queue[0].url = this.httpUrl + '/accounts/hierarchy/processHierarchyFile' + params;
      this.uploader.queue[0].upload();
      this.uploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {
        var resp = JSON.parse(response)
        if (resp.error == false) {
          await this.getAllHier();
          this.spinner.hide();

          swal.fire('Success', 'File Uploaded Successfully!!', 'success');
        } else {
          this.spinner.hide()
          swal.fire('Error', resp.data, 'error');
        }
      };
    }
    else {
      this.spinner.hide();
      swal.fire('Error', 'Please Upload Our Template File !!', 'error');
    }
  }
}