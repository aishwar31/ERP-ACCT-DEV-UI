import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthenticationService } from '../../authentication.service';
import { CostCenterService } from '../service/cost-center.service';
import { HierarchyService } from '../service/hierarchy.service';
import { MainService } from '../service/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { OrgHierService } from '../service/org-hier.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var $: any;


 
 
@Component({
 selector: 'app-cost-center',
 templateUrl: './cost-center.component.html',
 styleUrls: ['./cost-center.component.css']
})
export class CostCenterComponent implements OnInit {
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('sort') sort: MatSort;
 datasource;
 costObject = {};
 b_acct_id: any;
 erpUser: any;
 flag: number;
 constructor(private MatSnackBar: MatSnackBar, private hierarchyService: HierarchyService, public AuthenticationService: AuthenticationService, public OrgHierService: OrgHierService, public costCenterService: CostCenterService, public mainService: MainService, private router: Router, private spinner: NgxSpinnerService,) { }
 displayedColumns = ['cc_code', 'cc_name', 'cc_email', 'cc_mob_no', 'cc_add', 'manager_id','cc_func', 'org_hier_code', 'action'];
 level1 = [];
 level2 = []
 level3 = []
 level4 = []
 level5 = []
 level6 = []
 level7 = []
 unique_leaf = []

 obj={}
 allOrgHier = []
 orgHierarchy = [];
 create_flag = false;
 list_flag = true;
 update_flag = false;
 unique = [];


 async ngOnInit() {
 this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
 this.b_acct_id = this.erpUser.b_acct_id;
 await this.getList()
 await this.getHier()
 await this.getEmployees()
 await this.getAccountModule()
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
 moduleArr = []
 async getAccountModule() {
 var obj = new Object();
 obj['b_acct_id'] = this.b_acct_id;
 console.log(obj)
 var resp = await this.AuthenticationService.getaccountmodule(JSON.stringify(obj));
 console.log(resp);
 if (resp['error'] == false) {
 this.moduleArr = []
 let arr = resp['data'][0]['module_cd'].split(",");
 for (let i = 0; i < arr.length; i++) {
 
 let ob = Object.assign({}, {})
 ob['module_cd'] = arr[i]
 this.moduleArr.push(ob)
 console

 
 }
 } else {

 }
 }
 /* async open_update(element){
 this.obj=Object.assign({},element)
 } */

async module(element){
 $('#myModal4').modal('show');
 
 this.obj = Object.assign({}, element);
 this.obj['b_acct_id'] = this.b_acct_id
 
 
}
async updateCostCenterModule(){
  
        var resp=await this.hierarchyService.updateHierarchyModule(this.obj);
        console.log(resp)
        if(resp['error']==false){
       
        if(this.obj['cc_func']!=null){
        await this.updateCost()
        }
        }else{
            Swal.fire('Error', resp.data)
            this.spinner.hide();
        }
        
       
       
}



 allEmp = []
 async getEmployees() {
 let ob = {}
 ob['b_acct_id'] = this.b_acct_id
 var resp = await this.costCenterService.getEmployees(JSON.stringify(ob));
 this.allEmp = resp['data']
 console.log(this.allEmp)
 }
 async listfunc() {
 this.create_flag = false;
 this.list_flag = true;
 this.update_flag = false



 }

 applyFilter(filterValue: string) {
 this.datasource.filter = filterValue.trim().toLowerCase();
 }

 /* async create() {
 this.create_flag = true;
 this.list_flag = false;
 this.update_flag = false;
 this.refresh()
 
 } */

 async update(element) {
 this.create_flag = false;
 this.list_flag = false;
 this.update_flag = true;

 this.currentHierarchy = Object.assign({}, element)
 this.obj = Object.assign({}, element);
 console.log('update', this.allOrgHier)

 }
 hierCd = []

 async createCostCenter() {
 this.spinner.show()
 
 this.obj['create_user_id'] = this.erpUser.user_id;
 this.obj['b_acct_id'] = this.b_acct_id
 this.obj['status'] = 'ACTIVE'
 await this.createOrgHier()
 await this.createProjectHier()
 var resp = await this.costCenterService.createCost(this.obj);
 console.log('create', resp)
 
 if (resp['error'] == false) {

 this.spinner.hide()
 await this.getList()
 await this.getHier()
 Swal.fire("Success", "...");
 this.refresh();
 
 }
 else {
 console.log('ERROR')
 this.spinner.hide()
 Swal.fire("Error", "...", resp['error']);
 
 }
 
 }

 async createOrgHier() {
 let ob = this.orgHierCodeObject[this.obj['org_hier_leaf_code']]
 let arr = Object.keys(ob)
 let num = 0
 for (let i = 1; i < 8; i++) {
 if (ob['lvl' + i + "_cd"] == ob['leaf_cd']) {
 num = i + 1
 }
 }
 ob['lvl' + num + "_cd"] = this.obj['cc_code']
 ob['lvl' + num + "_value"] = this.obj['cc_name']
 ob['lvl' + num + "_node_type"] = 'Cost Center'
 ob['lvl' + num + "_type"] = 'text'
 ob['leaf_cd'] = this.obj['cc_code']
 ob['leaf_value'] = this.obj['cc_name']
 ob['leaf_node_type'] = 'Cost Center'
 ob['b_acct_id'] = this.b_acct_id
 ob['create_user_id'] = this.erpUser.user_id
 ob['org_hier_code'] = 'FIN'


 var resp = await this.OrgHierService.createHierarchy(ob);
 console.log(resp)
 if (resp['error'] == false) {
 this.spinner.hide()
 }
 else {

 this.spinner.hide()
 Swal.fire("Error", "...", resp['error']);

 }
 }
 async createProjectHier() {
 let ob = new Object
 ob['b_acct_id'] = this.b_acct_id
 ob['create_user_id'] = this.erpUser.user_id
 if (this.allProjectHier.length > 0) {
 ob['lvl1_cd'] = this.allProjectHier[0]['lvl1_cd']
 ob['lvl1_value'] = this.allProjectHier[0]['lvl1_value']

 } else {
 ob['lvl1_cd'] = 'P1'
 ob['lvl1_value'] = 'All Projects'
 ob['lvl1_type'] = 'text'

 }
 ob['lvl2_cd'] = this.obj['cc_code']
 ob['lvl2_value'] = this.obj['cc_name']
 ob['lvl2_type'] = 'text'
 ob['leaf_cd'] = this.obj['cc_code']
 ob['leaf_value'] = this.obj['cc_name']
 ob['table_name'] = 'proj_hier';

 var resp = await this.hierarchyService.createProjectHierarchy(ob);
 console.log(resp)
 if (resp['error'] == false) {
 this.allHier = resp.data;

 } else {
 }
 }
 allHier = []

 orgHierObject = {}
 orgHierCodeObject = {}
 async getHier() {

 this.obj['b_acc_id'] = this.b_acct_id
 this.obj['org_hier_code'] = 'FIN'
 /* var resp1 = await this.OrgHierService.getOrgHier(this.obj); */

 var resp = await this.OrgHierService.getHierarchy(this.obj);
 this.orgHierarchy = resp.data
 this.orgHierObject = new Object
 console.log('all Hier', this.allOrgHier)
 for (let i = 0; i < this.orgHierarchy.length; i++) {
 console.log(this.orgHierarchy[i])
 let str = ""
 for (let j = 1; j < 8; j++) {
 if (this.orgHierarchy[i]['lvl' + j + "_cd"] != null && this.orgHierarchy[i]['lvl' + j + "_cd"] != "") {
 str += this.orgHierarchy[i]['lvl' + j + "_value"] + " > "

 }
 /* else{
 this.orgHierarchy[i]['leaf_node_type']='Cost center'
 this.orgHierarchy[i]['is_leaf']='1'
 } */
 }

 str = str.substring(0, str.length - 2)
 this.orgHierarchy[i]['desc'] = str;
 this.orgHierObject[this.orgHierarchy[i]['leaf_cd']] = str
 this.orgHierCodeObject[this.orgHierarchy[i]['leaf_cd']] = this.orgHierarchy[i]

 }

 console.log(this.orgHierObject)

 }
 /* async changeHier(){
 for(let i=0;i<this.orgHierarchy.length;i++){
 for(let j=1;j<8;j++){
 if(this.orgHierarchy[i]['lvl'+j+"_cd"]==null && this.orgHierarchy[i]['lvl'+j+"_cd"]==""){
 
 }
 }
 }
 } */

 /* select() {
 
 
 this.obj['org_hier_leaf_code'] = this.currentHierarchy['leaf_cd']
 this.obj['org_hier_code'] = 'FIN'

 console.log(this.obj)
 
 } */

 flags = 0
 updateLevel = 0
 currentHierarchy = {}
 async updateHier() {


 this.currentHierarchy['b_acct_id'] = this.b_acct_id
 this.currentHierarchy['update_user_id'] = this.erpUser.user_id
 if (this.currentHierarchy['lvl' + this.updateLevel + "_type"] == 'text') {
 for (let i = 1; i < 8; i++) {

 if (this.currentHierarchy['lvl' + i + '_type'] != undefined) {
 if (this.currentHierarchy['lvl' + i + '_type'] != '') {

 if (this.unique.includes(this.currentHierarchy['lvl' + i + '_cd'])) {

 Swal.fire('Error', "Duplicate value of " + this.currentHierarchy['lvl' + i + '_cd']);
 return;

 }


 }
 }
 }
 }
 var resp = await this.OrgHierService.updateHierarchy(this.currentHierarchy);
 console.log(resp)
 if (resp['error'] == false) {
 this.spinner.hide();

 Swal.fire('Success', "Update Successfully!");

 } else {
 Swal.fire('Error', resp.data);
 this.spinner.hide();
 }




 }

 async makingLeafValues1() {

 if (this.currentHierarchy['lvl7_cd'] != undefined && this.currentHierarchy['lvl7_cd'] != '' && this.currentHierarchy['lvl7_cd'] != null) {
 this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl7_cd']
 this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl7_value']
 this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
 } else if (this.currentHierarchy['lvl6_cd'] != undefined && this.currentHierarchy['lvl6_cd'] != '' && this.currentHierarchy['lvl6_cd'] != null) {
 this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl6_cd']
 this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl6_value']
 this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
 } else if (this.currentHierarchy['lvl5_cd'] != undefined && this.currentHierarchy['lvl5_cd'] != '' && this.currentHierarchy['lvl5_cd'] != null) {
 this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl5_cd']
 this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl5_value']
 this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
 } else if (this.currentHierarchy['lvl4_cd'] != undefined && this.currentHierarchy['lvl4_cd'] != '' && this.currentHierarchy['lvl4_cd'] != null) {
 this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl4_cd']
 this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl4_value']
 this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
 } else if (this.currentHierarchy['lvl3_cd'] != undefined && this.currentHierarchy['lvl3_cd'] != '' && this.currentHierarchy['lvl3_cd'] != null) {
 this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl3_cd']
 this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl3_value']
 this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
 } else if (this.currentHierarchy['lvl2_cd'] != undefined && this.currentHierarchy['lvl2_cd'] != '' && this.currentHierarchy['lvl2_cd'] != null) {
 this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl2_cd']
 this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl2_value']
 this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
 } else if (this.currentHierarchy['lvl1_cd'] != undefined && this.currentHierarchy['lvl1_cd'] != '' && this.currentHierarchy['lvl1_cd'] != null) {
 this.currentHierarchy['leaf_cd'] = this.currentHierarchy['lvl1_cd']
 this.currentHierarchy['leaf_value'] = this.currentHierarchy['lvl1_value']
 this.currentHierarchy['leaf_node_type'] = this.currentHierarchy['leaf_node_type']
 }


 }

 async delete(element) {
 this.spinner.show()
 let obj = {}
 obj['b_acct_id'] = this.b_acct_id
 obj['id'] = element['id']
 var resp = await this.costCenterService.deleteCost(obj);
 if (resp['error'] == false) {
 this.spinner.hide()

 Swal.fire('success', 'Record Deleted Successfully', 'success')
 await this.getList()
 }
 else {
 this.spinner.hide()

 Swal.fire('Error', 'Some Error Occured', 'error')
 }
 }

 async updateCost() {

 // this.spinner.show();
 this.obj['b_acct_id'] = this.b_acct_id;
 this.obj['update_user_id'] = this.erpUser.user_id;
 /* obj1['cc_code'] = this.obj['cc_code']
 obj1['cc_name'] = this.obj['cc_name']
 obj1['cc_email'] = this.obj['cc_email']
 obj1['cc_mob_no'] = this.obj['cc_mob_no']
 obj1['cc_add'] = this.obj['cc_add']
 obj1['manager_id'] = this.obj['manager_id']
 obj1['cc_func'] = this.obj['cc_func'] */

 var resp = await this.costCenterService.updateCost(this.obj);


 if (resp['error'] == false) {


 this.spinner.hide();
 Swal.fire('Success', 'Updated Successfully')
 await this.getList();

 }

 else {

 Swal.fire('Error', resp.data)
 this.spinner.hide();
 }
 }

 async onChangeLvl1() {
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
 console.log(this.level1)

 this.obj={}
 this.level2 = []

 this.level3 = []
 this.level4 = []
 this.level5 = []
 this.level6 = []
 this.level7 = []

 
 }


 async open_hier() {

 $('#myModal3').modal('show');

 }

 allList = []
 async getList() {

 this.spinner.show();
 this.obj['b_acct_id'] = this.b_acct_id;

 console.log(this.obj)

 var resp = await this.costCenterService.getCost(this.obj);


 if (resp['error'] == false) {

 this.allList = resp.data
 this.datasource = new MatTableDataSource(this.allList);
 this.datasource.sort = this.sort;
 this.datasource.paginator = this.paginator;
 this.spinner.hide();

 }
 }
 orgObj = {}


}