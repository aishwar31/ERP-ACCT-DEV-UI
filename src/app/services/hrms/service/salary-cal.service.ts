import { ApprService } from './appr.service';
import { EstablishmentService } from './establishment.service';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { PayrollService } from './payroll.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryCalService {
  monthObj = { '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December' }
  monthObjShort = { '1': 'JAN', '2': 'FEB', '3': 'MAR', '4': 'APR', '5': 'MAY', '6': 'JUN', '7': 'JUL', '8': 'AUG', '9': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC' }
  monthEnd = { '1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30, '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31 }

  constructor(private payableService: PayrollService, private mainService: MainService) { }
  getLeap(year) {
    //var year = this.attendanceObj['year'];
    var leap = false;
    if (year % 4 == 0) {
      if (year % 100 == 0) {
        // year is divisible by 400, hence the year is a leap year
        if (year % 400 == 0)
          leap = true;
        else
          leap = false;
      }
      else
        leap = true;
    }
    else
      leap = false;
    if (leap == true) {
      this.monthEnd[2] = 29;
    }


  }

  getEffectiveArangemnt(){

  }

  
  async getFixedPay() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['month'] = this.salaryObj.month;

    var year;
    if (this.salaryObj.month == '1' || this.salaryObj.month == '2' || this.salaryObj.month == '3') {
      year = parseInt(this.salaryObj.fin_year) + 1;
    } else {
      year = parseInt(this.salaryObj.fin_year);
    }
    this.getLeap(year);

    obj['year'] = year;
    obj['start_dt']=year+"-"+this.salaryObj.month+"-01"
    obj['end_dt'] = '2090-10-10';

    this.salaryObj.fixed_pay_info = {};
    var resp = await this.payableService.getEffectiveFixedSalary(obj);
    console.log(resp)
    if (resp['error'] == false) {
      this.allFixedPay = resp.data;
      for (var i = 0; i < this.allFixedPay.length; i++) {
        if (this.salaryObj.fixed_pay_info[this.allFixedPay[i].emp_id] == undefined) {
          this.salaryObj.fixed_pay_info[this.allFixedPay[i].emp_id] = [];
        }
        this.salaryObj.fixed_pay_info[this.allFixedPay[i].emp_id].push(this.allFixedPay[i]);
      }
    } else {
      // swal.fire("Error", "Error while getting Fixed Pay", 'error');
    }
  }
  erpUser;
  b_acct_id
  async getAllEmployeeSalary(obj,emp_arr) {
    this.salaryObj = Object.assign({}, obj)
    this.ind_emp_id = emp_arr
    //variable_pay
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    await this.getFixedPay()
    var salary_data = await this.calculateSalary();
    return salary_data;
  }

  salaryObj = { accrual_date: '', b_acct_id: '', fin_year: '', month: '', section_code: '', emp_cat_code: '', post_info: {}, emp_info: {}, employement_info: {}, bank_info: {}, att_info: {}, fixed_pay_info: {}, variable_pay_info: {}, total_pay: {} }
  allEmplyees = [];
  allAttendance = [];
  //billIdObj={}
  ind_emp_id = [];
  updateSalaryObj = {};
  allBankAccount = [];
  allCurrentArrangements = [];
  allFixedPay = [];
  allEmplyees_new = []
  allVariablePay = [];
  allPosting = []
  salaryArr = [];
  allBillData = [];
  allRule = {};
  //allBillId=[];
  actualSalaryArr = [];
  currentBillObj = { header: {}, allEmployees: [], data: {}, sums: {} };
  allApproval = [];
  stopObj = {};
  t = [{ code: 'ind', value: 'Individual' }, { code: 'sec', value: 'Category Wise' }]
  statusArr = [];
  levelOfApproval = {}
  async calculateSalary(){
    console.log(this.salaryObj)
    this.salaryArr = []
    var year;
    if(this.salaryObj.month=='1' || this.salaryObj.month=='2' || this.salaryObj.month=='3'){
      year = parseInt(this.salaryObj.fin_year)+1;
    }else{
      year = parseInt(this.salaryObj.fin_year);
    }
    var flag =false;
    var errorMsg="";
    var activeEmps = Object.keys(this.salaryObj.employement_info);
    if(this.salaryObj['type'] == 'ind'){
      activeEmps = this.ind_emp_id;
      // this.salaryObj.section_code = this.salaryObj.post_info[activeEmps[0]]
      // this.salaryObj.emp_cat_code = this.salaryObj.emp_info[activeEmps[0]]['emp_cat_code']

    }
  
    var payObj={};
    var accrual_date = this.salaryObj.accrual_date;
    //*********************Fix and Variable Pay Calculation */
   
    for(var i=0;i<activeEmps.length;i++){
      if(this.salaryObj.post_info[activeEmps[i]]==undefined){
        this.salaryObj.post_info[activeEmps[i]] = "ESP";
      }

      if((this.salaryObj.emp_info[activeEmps[i]]['emp_cat_code'] == this.salaryObj.emp_cat_code || this.salaryObj['type'] == 'ind') && (this.stopObj[activeEmps[i]] == undefined || this.stopObj[activeEmps[i]] =='START')){
       var salArr = this.salaryObj.fixed_pay_info[activeEmps[i]];
        if(salArr == undefined){
          salArr=[];
        }

       var salObj={}
       
       if(salArr!=undefined){
       for(var j=0;j<salArr.length;j++){
         
         var effectiveStartDate = salArr[j].effective_start_dt;
         var effectiveEndDate = salArr[j].effective_end_dt
         var x = effectiveStartDate.split('-');
         var y = effectiveEndDate.split('-');
         var effectiveStartYear = parseInt(x[0]);
         var effectiveStartMonth = parseInt(x[1]);
         var effectiveStartDay = parseInt(x[2]);
         var effectiveEndYear = parseInt(y[0]);
         var effectiveEndMonth = parseInt(y[1]);
         var effectiveEndDay = parseInt(y[2]);
           console.log(effectiveStartYear);
          console.log(effectiveStartMonth);
           console.log(effectiveStartDay);
          console.log(effectiveEndYear);
          console.log(effectiveEndMonth);
           console.log(effectiveEndDay);
         if(activeEmps[i]=='20'){
          // console.log(effectiveStartYear);
          // console.log(effectiveStartMonth);
          // console.log(effectiveStartDay);
          // console.log(effectiveEndYear);
          // console.log(effectiveEndMonth);
          // console.log(effectiveEndDay);
         }
         var currYear = parseInt(this.salaryObj.fin_year);
         var currMonth = parseInt(this.salaryObj.month);
         if(currMonth ==1 || currMonth ==2 || currMonth == 3){
           currYear +=1;
         }

         if(currYear>effectiveStartYear || (currYear == effectiveStartYear && currMonth>=effectiveStartMonth)){
            var start = 1;
            var end = this.monthEnd[this.salaryObj.month];
            if(currYear == effectiveStartYear && currMonth == effectiveStartMonth){
              start = effectiveStartDay;
            }
            if(currYear == effectiveEndYear && currMonth == effectiveEndMonth){
              end = effectiveEndDay;
              //end=end-1;
            }
          console.log(salArr[j]["pay_component_code"]+"-"+String( end-start+1) )
            if(end-start+1>=0){
              if(salObj[salArr[j]["pay_component_code"]+"-"+String( end-start+1)] == undefined){
                salObj[salArr[j]["pay_component_code"]+"-"+String( end-start+1)]={type:'fix',pay_component_code: salArr[j].pay_component_code,emp_id: activeEmps[i],pay_code : salArr[j].pay_code,pay_component_amt: 0,num_of_days:end-start+1};
               }
              if(salObj[salArr[j]["pay_component_code"]+"-"+String( end-start+1)]['pay_code']=='PAY'){
                salObj[salArr[j]["pay_component_code"]+"-"+String( end-start+1)]['pay_component_amt'] =   Math.round(salObj[salArr[j]["pay_component_code"]+"-"+String( end-start+1)]['pay_component_amt'] + parseFloat((salArr[j].pay_component_amt*(end-start+1)/this.monthEnd[this.salaryObj.month]).toFixed(2)));

              }else{
                salObj[salArr[j]["pay_component_code"]+"-"+String( end-start+1)]['pay_component_amt'] =   salArr[j].pay_component_amt;

              }
              console.log(salObj[salArr[j]["pay_component_code"]+"-"+String( end-start+1)]['pay_component_amt'] )
              console.log(salObj)
            }


         }
       }
       }
       var keys = Object.keys(salObj);
       for(var j=0;j<keys.length;j++){
       this.salaryArr.push(salObj[keys[j]]);
       }
       console.log(this.salaryArr)
       
      }
     
      
    }
    //********************Attendance Calculation , Suspended Calculation*/
    var emps=[]
    for(var i=0;i<this.salaryArr.length;i++){
      var present_days;
      var absent_days;
      var total_days;
      if(emps.indexOf(this.salaryArr[i].emp_id)<0){
        emps.push(this.salaryArr[i].emp_id);
      }
 
        if(this.salaryArr[i].type=='fix' && this.salaryArr[i].pay_code == 'PAY'){
          
          if(payObj[this.salaryArr[i].emp_id]==undefined){
            payObj[this.salaryArr[i].emp_id] = 0;
          }
          payObj[this.salaryArr[i].emp_id]+=this.salaryArr[i].pay_component_amt;

        }
        this.salaryArr[i]['b_acct_id'] = this.b_acct_id;
        this.salaryArr[i]['emp_id'] = this.salaryArr[i].emp_id;
        this.salaryArr[i]['fin_year'] = this.salaryObj.fin_year;
        this.salaryArr[i]['month'] = this.salaryObj.month;
      /*   if(this.salaryObj['type'] == 'ind' ){
          this.salaryArr[i]['bill_desc'] = "Salary  Bill for "+this.mainService.accInfo['account_short_name'] +this.getNumberFormat(this.salaryArr[i].emp_id) +"-"+this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_name/* " hold employees"+ *///" for Month "+this.monthObj[this.salaryObj.month]+", "+year;

        //}else  */
        if(this.salaryObj['type'] == 'ind'){
          this.salaryArr[i]['bill_desc'] = this.mainService.accInfo['account_short_name'] +this.getNumberFormat(this.salaryArr[i].emp_id) +"-"+this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_name+/* " hold employees"+ */" Salary  Bill for "+this.monthObjShort[this.salaryObj.month]+", "+year;
        }
        else{
          this.salaryArr[i]['bill_desc'] = this.mainService.codeValueShowObj['HR0046'][this.salaryObj.emp_cat_code]+" Salary  Bill  for  "+this.monthObjShort[this.salaryObj.month]+", "+year;
        }
        console.log(this.monthEnd[this.salaryObj.month])
        this.salaryArr[i]['pay_component_code'] = this.salaryArr[i].pay_component_code;
        this.salaryArr[i]['pay_code'] = this.salaryArr[i].pay_code;
        this.salaryArr[i]['section_code'] = this.salaryObj.post_info[this.salaryArr[i].emp_id];
        this.salaryArr[i]['bill_status_code'] = "GENERATED";
        this.salaryArr[i]['create_user_id'] = this.erpUser.user_id;
        this.salaryArr[i]['emp_name'] = this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_name;
        this.salaryArr[i]['emp_phone_no'] = this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_phone_no;
        this.salaryArr[i]['accrual_date'] = accrual_date;
        this.salaryArr[i]['bill_date'] = accrual_date;
        //this.salaryArr[i]['num_of_days'] = this.monthEnd[this.salaryObj.month] - absent_days;
        if(this.salaryArr[i]['pay_component_code'] == 'NPS'){
          this.salaryArr[i]['pay_component_amt'] = Math.round(this.salaryArr[i]['pay_component_amt'])
        }

      


    }
  
   
    //***************************Deduction Normalisation */
    this.actualSalaryArr=[];
    var salObjNew={}
    for(var i = 0;i<this.salaryArr.length;i++){
      if(salObjNew[this.salaryArr[i].emp_id] == undefined){
        salObjNew[this.salaryArr[i].emp_id] ={};
      }
      salObjNew[this.salaryArr[i].emp_id][this.salaryArr[i]["pay_component_code"]+"-"+i] = this.salaryArr[i];
    }
    var seq = ['BASIC','DA','HRA','CCA','MA','PB','CONV','PERSNLPAY','GIS'];
    for(var i=0;i<emps.length;i++){
      var obj = salObjNew[emps[i]];
      var keys = Object.keys(obj);

      for(var j=0;j<seq.length;j++){
        if(obj[seq[j]]!=undefined){
          if(obj[seq[j]].pay_code =='PAY'){
            this.actualSalaryArr.push(obj[seq[j]]);

          }else{
            if(obj[seq[j]].pay_component_amt <= payObj[emps[i]]){
              this.actualSalaryArr.push(obj[seq[j]]);
              payObj[emps[i]] -= obj[seq[j]].pay_component_amt;
            }else{
              obj[seq[j]].pay_component_amt = payObj[emps[i]]
              payObj[emps[i]]=0;
              this.actualSalaryArr.push(obj[seq[j]]);
            }
          }
        }
      }
      for(var j=0;j<keys.length;j++){
        if(seq.indexOf(keys[j])<0){
          if(obj[keys[j]].pay_code =='PAY' || obj[keys[j]].pay_code =='CONT'){
            this.actualSalaryArr.push(obj[keys[j]]);
          }else{
            if(obj[keys[j]].pay_component_amt <= payObj[emps[i]]){
              this.actualSalaryArr.push(obj[keys[j]]);
              payObj[emps[i]] -= obj[keys[j]].pay_component_amt;
            }else{
              obj[keys[j]].pay_component_amt = payObj[emps[i]]
              payObj[emps[i]]=0;
              this.actualSalaryArr.push(obj[keys[j]]);

            }
          }
        }
      }
    }

    console.log(this.actualSalaryArr)
    return this.actualSalaryArr
   /*  if(flag == false && this.flag_sal == false){
      this.datasource = new MatTableDataSource(this.actualSalaryArr);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
     
    }else if(flag == false && this.flag_sal == true ){
     console.log(this.salaryArr)
     for (let i = 0; i < this.actualSalaryArr.length; i++) {
       this.hold_sal.push(this.actualSalaryArr[i])
       
     }
      this.flag_sal = false
    } */
    /* else{
      this.salaryArr = [];
      this.actualSalaryArr = []; */
     /*  swal.fire("Error",errorMsg,'error');
      this.datasource = new MatTableDataSource(this.actualSalaryArr);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort; */
   // }

  }


  getNumberFormat(num) {
    return num.toString().padStart(3, "0")
  }
}
