import { Component, OnInit, ViewChild } from '@angular/core';

import { LedgerService } from '../../service/ledger.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';

@Component({
  selector: 'app-fin-year',
  templateUrl: './fin-year.component.html',
  styleUrls: ['./fin-year.component.css']
})
export class FinYearComponent implements OnInit {
  displayedColumns = ['id', 'fin_year','status', 'action'];
  calender=[{code:'APR-MAR'},{code:'JAN-DEC'}]
  constructor( private spinner: NgxSpinnerService, private snackBar: MatSnackBar,private ledgerService:LedgerService) { }
  datasource;
  erpUser
  b_acct_id
  allFinYear=[]
  user_id
  obj={}
  openFinYear={}
  futureFinYear=[]
  closedFinYear=[]
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    await this.getFinYear();
    
  }
  async getFinYear() {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.ledgerService.getAllFinYear(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.allFinYear = resp.data;
      this.datasource = new MatTableDataSource(this.allFinYear)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
      this.spinner.hide();
      for(let i=0;i<this.allFinYear.length;i++){
        if(this.allFinYear[i]['status']=='OPEN' || this.allFinYear[i]['status']=='UNDERAPPROVAL'  ){
          this.openFinYear=Object.assign({},this.allFinYear[i])
        }
        if(this.allFinYear[i]['status']=='FUTURE'){
          this.futureFinYear.push(this.allFinYear[i])
        }
        if(this.allFinYear[i]['status']=='CLOSED'){
          this.closedFinYear.push(this.allFinYear[i])
        }
      }
      if(Object.keys(this.openFinYear).length>0){
        this.obj['calender']=this.openFinYear['calender']
        console.log(this.obj['calender'])
      }
   await   this.calenderChange()

    } else {
      this.spinner.hide()

    }
  }
  async addNewRow() {
    var obj = Object.assign({}, this.obj);
    obj['b_acct_id'] = this.b_acct_id
    obj['status'] = 'INACTIVE';
    this.spinner.show();
    var resp = await this.ledgerService.createfinyear(obj);
    if (resp['error'] == false) {
      await this.getFinYear();
      this.spinner.hide();
      swal.fire("Success", "...Added Successfully!",'success');

     
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Request Failed!",'error');

    
    }


  }

  async active(element) {
    var obj = Object.assign({}, element);
    obj['b_acct_id'] = this.b_acct_id
    obj['status'] = 'ACTIVE'
    obj['id'] = element['id']
    this.spinner.show();
    var resp = await this.ledgerService.updatefinyear(obj);
    if (resp['error'] == false) {
      await this.getFinYear();
      this.spinner.hide();
      swal.fire("Success", "...Activated Successfully!",'success');
    } else {
      this.spinner.hide();
      swal.fire("Error", "...Request Failed!",'error');
    }
  }
  refresh(){
    this.obj={};
  }
  async deactive(element) {
    var obj = Object.assign({}, element);
    obj['b_acct_id'] = this.b_acct_id
    obj['status'] = 'INACTIVE'
    obj['id'] = element['id']
    this.spinner.show();
    var resp = await this.ledgerService.updatefinyear(obj);
    if (resp['error'] == false) {
      await this.getFinYear();
      this.spinner.hide();
      swal.fire("Success", "...Deactivated Successfully!",'success');

     /*  this.snackBar.open("Deactivated Successfully", 'Success!', {
        duration: 5000,
      }); */
    } else {
      this.spinner.hide();

      swal.fire("Error", "...Request Failed!",'error');
     /*  this.snackBar.open("Request Failed", 'Error', {
        duration: 5000,
      }); */
    }
  }

  
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  async calenderChange(){
   let year=0
    if(Object.keys(this.openFinYear).length>0){
      year=Number(this.openFinYear['fin_year'])+1+this.futureFinYear.length
    }

    if(this.obj['calender']=="APR-MAR"){
      let end_year=year+1
      this.obj['fin_year']=year
      this.obj['start_date']=year+'-04-01'
      this.obj['end_date']=end_year+'-03-31'

    }else if(this.obj['calender']=="JAN-DEC"){
      this.obj['fin_year']=year

      this.obj['start_date']=year+'-01-01'
      this.obj['end_date']=year+'-12-31'
    }else{
      this.obj['fin_year']=year

      this.obj['start_date']=''
      this.obj['end_date']=''
    }
  }
}
