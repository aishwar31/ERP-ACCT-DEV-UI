import * as moment from 'moment';

import { ApprService } from './appr.service';
import { EstablishService } from './establish.service';
import { EstablishmentService } from './establishment.service';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { PayrollService } from './payroll.service';

// import { addDays, addMonths, differenceInDays, differenceInMonths, daysInWeek } from 'date-fns';
// import { start } from 'repl';



@Injectable({
  providedIn: 'root'
})
export class SalCalService {
  monthObj = { '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December' }
  monthObjShort = { '1': 'JAN', '2': 'FEB', '3': 'MAR', '4': 'APR', '5': 'MAY', '6': 'JUN', '7': 'JUL', '8': 'AUG', '9': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC' }
  monthEnd = { '1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30, '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31 }

  constructor(private payableService: PayrollService, private mainService: MainService, private estNewService: EstablishService) { }
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

  ///************************get pay matrix *****************************8*/
  BasicPayObj = {};
  allMatrix = []
  async getAllPayMatrix() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.estNewService.getMatrix(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.allMatrix = resp.data;
      for (var i = 0; i < this.allMatrix.length; i++) {
        this.BasicPayObj[this.allMatrix[i]['pay_band'].toString() + this.allMatrix[i]['grade_pay_code'].toString() + this.allMatrix[i]['level_code'].toString() + this.allMatrix[i]['index_num'].toString()] = this.allMatrix[i]['basic_pay']
      }
      console.log(this.BasicPayObj)
    } else {
    }
  }

  ///************************get HRA matrix *****************************8*/

  allHRAMatrix = []
  async getAllHRAMatrix() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.estNewService.getHRAMatrix(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.allHRAMatrix = resp.data;
      console.log(this.allHRAMatrix)

    } else {

    }
  }

  ///************************get GIS matrix *****************************8*/

  allGISMatrix = []
  async getAllGISMatrix() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.estNewService.getGISMatrix(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.allGISMatrix = resp.data;
      console.log(this.allGISMatrix)

      //  for (var i = 0; i < this.allMatrix.length; i++) {
      //    this.BasicPayObj[this.allMatrix[i]['pay_band']+this.allMatrix[i]['grade_pay_code']+this.allMatrix[i]['level_code']+this.allMatrix[i]['index']]=this.allMatrix[i]['basic_pay']
      //  }
    } else {

    }
  }

  ///************************get CCA matrix *****************************8*/

  allCCAMatrix = []
  async getAllCCAMatrix() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.estNewService.getCCAMatrix(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.allCCAMatrix = resp.data;
      console.log(this.allCCAMatrix)

      // for (var i = 0; i < this.allMatrix.length; i++) {
      //   this.BasicPayObj[this.allMatrix[i]['pay_band']+this.allMatrix[i]['grade_pay_code']+this.allMatrix[i]['level_code']+this.allMatrix[i]['index']]=this.allMatrix[i]['basic_pay']
      // }
    } else {

    }
  }
  allTimeMatrix = []
  async getAllTimeMatrix() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    var resp = await this.estNewService.getCCAMatrix(JSON.stringify(obj));
    if (resp['error'] == false) {
      this.allCCAMatrix = resp.data;
      console.log(this.allCCAMatrix)

      // for (var i = 0; i < this.allMatrix.length; i++) {
      //   this.BasicPayObj[this.allMatrix[i]['pay_band']+this.allMatrix[i]['grade_pay_code']+this.allMatrix[i]['level_code']+this.allMatrix[i]['index']]=this.allMatrix[i]['basic_pay']
      // }
    } else {

    }
  }
  async  getEffectiveArangemnt(emp_id, date) {

    var arr = {};
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['emp_id'] = emp_id;
    obj['date'] = date;

    console.log(obj)
    var resp = await this.estNewService.getCurrentEstablishementOnDate(JSON.stringify(obj));
    if (resp['error'] == false) {
      arr = resp.data[0];
    } else {

    }

    return arr;
  }
  allSalRule = []

  async getAllPayRules() {
    var obj = new Object();
    obj['b_acct_id'] = this.b_acct_id;
    obj['effective_dt'] = '2090-10-10';
    obj['status'] = ['ACTIVE']
    var resp = await this.estNewService.getComponentDefinition(obj);
    if (resp['error'] == false) {
      this.allSalRule = resp.data;
      console.log(this.allSalRule)
    } else {
    }
  }


  getEffectiveComponentByRule(emp_id) {
    var arr

    for (let p = 0; p < this.arr_of_all_dates.length; p++) {
      var date = new Date(this.arr_of_all_dates[p]);



      // var obj = {};
      // var obj1 = {};
      // obj['BASIC'+date] = { amt: parseFloat(this.updateObj['basic_pay']), pay_code: 'PAY' };
      // obj1['BASIC'+date] = parseFloat(this.updateObj['basic_pay']);

      for (var i = 0; i < this.allSalRule.length; i++) {

        var eff_dt = this.allSalRule[i].effective_dt.split('T')[0];

        var amt = 0;
        var pay_code = this.allSalRule[i].pay_code;
        var effective_dt = eff_dt;
        if (this.allSalRule[i].rate_type == 'FIX') {
          amt = this.allSalRule[i].amount;
          this.salObj[this.allSalRule[i]['component_code'] + "-" + String(this.arr_of_all_dates[p])] = { type: 'rule', pay_component_code: this.allSalRule[i]['component_code'], emp_id: emp_id, pay_code: this.allSalRule[i]['pay_code'], pay_component_amt: parseFloat((amt * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)), num_of_days: 1, date: this.arr_of_all_dates[p] };

          // obj1[this.allSalRule[i].component_code] = amt;
          // obj[this.allSalRule[i].component_code] = { amt: amt, pay_code: this.allSalRule[i].pay_code };

        } else if (this.allSalRule[i].rate_type == 'PERCENTAGE') {
          amt = 0;
          var arr = this.allSalRule[i].dependent_component.split(',');
          for (var j = 0; j < arr.length; j++) {
            if (this.salObj[arr[j] + "-" + String(this.arr_of_all_dates[p])] == undefined) {
              amt += 0;
            } else {
              amt += this.salObj[arr[j] + "-" + String(this.arr_of_all_dates[p])]['pay_component_amt']
            }
          }
          var final_amt = parseFloat((amt * this.allSalRule[i].amount / 100).toFixed(3));

          // obj1[this.allSalRule[i].component_code] = amt;
          // obj[this.allSalRule[i].component_code] = { amt: amt, pay_code: this.allSalRule[i].pay_code };
          if (final_amt != 0) {
            this.salObj[this.allSalRule[i]['component_code'] + "-" + String(this.arr_of_all_dates[p])] = { type: 'rule', pay_component_code: this.allSalRule[i]['component_code'], emp_id: emp_id, pay_code: this.allSalRule[i]['pay_code'], pay_component_amt: final_amt, num_of_days: 1, date: this.arr_of_all_dates[p] };
          }


        }
      }

    }
    // this.AllFixPay = [];
  }
  AllFixPay = [];

  //   getDates(startDate, stopDate) {
  //     console.log(startDate)
  //     console.log(stopDate)
  //     var dateArray = new Array();
  //     var currentDate = startDate;
  //     while (currentDate <= stopDate) {
  //         dateArray.push(new Date (currentDate));
  //         currentDate = currentDate.addDays(1);
  //     }
  //     return dateArray;
  // }

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
    obj['start_dt'] = year + "-" + this.salaryObj.month + "-01"
    // obj['end_dt'] = '2090-10-10';
    obj['end_dt'] = year + "-" + this.salaryObj.month + "-" + this.monthEnd[this.salaryObj.month];

    this.salaryObj.fixed_pay_info = {};
    console.log(obj)
    var resp = await this.payableService.getNewEffectiveFixedPay(obj);
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
  b_acct_id;

  start_date;
  end_date;
  arr_of_all_dates = [];
  async getAllEmployeeSalary(obj, emp_arr) {
    this.salaryObj = Object.assign({}, obj)
    this.ind_emp_id = emp_arr
    //variable_pay
    this.erpUser = JSON.parse(localStorage.getItem('erpUser'));
    this.b_acct_id = this.erpUser.b_acct_id;
    await this.getAllPayMatrix();
    // await this.getAllHRAMatrix();
    // await this.getAllGISMatrix();
    // await this.getAllCCAMatrix();
    // await this.getAllPayRules();
    // await this.getTimeMatrix();



    var year;
    if (this.salaryObj.month == '1' || this.salaryObj.month == '2' || this.salaryObj.month == '3') {
      year = parseInt(this.salaryObj.fin_year) + 1;
    } else {
      year = parseInt(this.salaryObj.fin_year);
    }
    this.getLeap(year);

    this.start_date = year + "-" + this.salaryObj.month + "-01"
    this.end_date = year + "-" + this.salaryObj.month + "-" + this.monthEnd[this.salaryObj.month];
    console.log(this.start_date, this.end_date);
    this.arr_of_all_dates = [];
    for (let i = 1; i <= this.monthEnd[this.salaryObj.month]; i++) {

      let selDate = moment()


      selDate.set('year', year)
      selDate.set('month', parseInt(this.salaryObj.month) - 1)
      selDate.set('date', i)

      let day = selDate.format('YYYY-MM-DD')
      this.arr_of_all_dates.push(day)
    }
    // var dateList = getDaysBetweenDates(start_date, end_date);
    // console.log(dateList);
    console.log(this.arr_of_all_dates)
    // this.arr_of_all_dates=await this.getDates(this.start_date,this.end_date)

    await this.getFixedPay();
    var salary_data = await this.calculateSalary();
    return salary_data;
    // return []
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
  levelOfApproval = {};

  getBasicPay(key) {
    var basic_pay = 0;
    if (this.BasicPayObj[key] != undefined) {
      basic_pay = this.BasicPayObj[key]
    }
    return basic_pay
  }

  getHRA(grade_pay_code, city_group) {
    var obj = { amt: 0, pay_code: 'PAY' };

    for (let i = 0; this.allHRAMatrix.length; i++) {
      if ((this.allHRAMatrix[i].upper_limit >= grade_pay_code && this.allHRAMatrix[i].lower_limit <= grade_pay_code) && city_group == this.allHRAMatrix[i]['city_group']) {
        obj['amt'] = this.allHRAMatrix[i].amount
        obj['pay_code'] = this.allHRAMatrix[i].pay_code
      }

      return obj
    }

  }
  getCCA(grade_pay_code, city_cd) {
    var obj = { amt: 0, pay_code: 'PAY' };

    for (let i = 0; this.allCCAMatrix.length; i++) {
      if ((this.allCCAMatrix[i].upper_limit >= grade_pay_code && this.allCCAMatrix[i].lower_limit <= grade_pay_code) && city_cd == this.allCCAMatrix[i]['city_cd']) {
        obj['amt'] = this.allCCAMatrix[i].amount
        obj['pay_code'] = this.allCCAMatrix[i].pay_code
      }

      return obj
    }

  }
  getGIS(grade_pay_code) {
    var obj = { amt: 0, pay_code: 'PAY' };

    for (let i = 0; this.allGISMatrix.length; i++) {
      if ((this.allGISMatrix[i].upper_limit >= grade_pay_code && this.allGISMatrix[i].lower_limit <= grade_pay_code)) {
        obj['amt'] = this.allGISMatrix[i].amount
        obj['pay_code'] = this.allGISMatrix[i].pay_code
      }

      return obj
    }

  }
  salObj
  async calculateSalary() {
    console.log(this.salaryObj)
    this.salaryArr = []
    var year;
    if (this.salaryObj.month == '1' || this.salaryObj.month == '2' || this.salaryObj.month == '3') {
      year = parseInt(this.salaryObj.fin_year) + 1;
    } else {
      year = parseInt(this.salaryObj.fin_year);
    }
    console.log("start ")
    var flag = false;
    var errorMsg = "";
    var activeEmps = Object.keys(this.salaryObj.employement_info);
    if (this.salaryObj['type'] == 'ind') {
      activeEmps = this.ind_emp_id;
      // this.salaryObj.section_code = this.salaryObj.post_info[activeEmps[0]]
      // this.salaryObj.emp_cat_code = this.salaryObj.emp_info[activeEmps[0]]['emp_cat_code']

    }
    console.log(activeEmps)

    
    var payObj = {};
    var accrual_date = this.salaryObj.accrual_date;
    //*********************Fix and Variable Pay Calculation */


    for (var i = 0; i < activeEmps.length; i++) {

      if (this.salaryObj.post_info[activeEmps[i]] == undefined) {
        this.salaryObj.post_info[activeEmps[i]] = "ESP";
      }


      if ((this.salaryObj.emp_info[activeEmps[i]]['emp_cat_code'] == this.salaryObj.emp_cat_code || this.salaryObj['type'] == 'ind') && (this.stopObj[activeEmps[i]] == undefined || this.stopObj[activeEmps[i]] == 'START')) {


        this.salObj = {};


        for (let p = 0; p < this.arr_of_all_dates.length; p++) {




          //matrix lookup calculation

          var date = new Date(this.arr_of_all_dates[p])
          var eff_arr = await this.getEffectiveArangemnt(activeEmps[i], date)
          console.log(eff_arr);

          if (eff_arr['basic_pay'] != undefined) {
            var basic_pay = this.getBasicPay(eff_arr['pay_scale_code'].toString() + eff_arr['grade_pay_code'].toString() + eff_arr['level_code'].toString() + eff_arr['basic_pay'].toString());
            var hra_obj = this.getHRA(eff_arr['grade_pay_code'], 'A');
            var cca_obj = this.getCCA(eff_arr['grade_pay_code'], 'LKO');
            var gis_obj = this.getGIS(eff_arr['grade_pay_code']);
            var hra_amt = hra_obj['amt'];
            var cca_amt = cca_obj['amt'];
            var gis_amt = gis_obj['amt'];
            console.log(basic_pay);
            console.log(hra_amt);
            console.log(cca_amt);
            console.log(gis_amt);




            if (this.salObj['BASIC' + "-" + String(this.arr_of_all_dates[p])] == undefined) {
              this.salObj['BASIC' + "-" + String(this.arr_of_all_dates[p])] = { type: 'fix', pay_component_code: 'BAISC', emp_id: activeEmps[i], pay_code: 'PAY', pay_component_amt: parseFloat((basic_pay * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)), num_of_days: 1, date: this.arr_of_all_dates[p] };
            }

            if (this.salObj['HRA' + "-" + String(this.arr_of_all_dates[p])] == undefined) {
              this.salObj['HRA' + "-" + String(this.arr_of_all_dates[p])] = { type: 'fix', pay_component_code: 'HRA', emp_id: activeEmps[i], pay_code: 'PAY', pay_component_amt: parseFloat((hra_amt * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)), num_of_days: 1, date: this.arr_of_all_dates[p] };
            }
            if (this.salObj['CCA' + "-" + String(this.arr_of_all_dates[p])] == undefined) {
              this.salObj['CCA' + "-" + String(this.arr_of_all_dates[p])] = { type: 'fix', pay_component_code: 'CCA', emp_id: activeEmps[i], pay_code: 'PAY', pay_component_amt: parseFloat((cca_amt * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)), num_of_days: 1, date: this.arr_of_all_dates[p] };
            }
            if (this.salObj['GIS' + "-" + String(this.arr_of_all_dates[p])] == undefined) {
              this.salObj['GIS' + "-" + String(this.arr_of_all_dates[p])] = { type: 'fix', pay_component_code: 'GIS', emp_id: activeEmps[i], pay_code: 'DED', pay_component_amt: parseFloat((gis_amt * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)), num_of_days: 1, date: this.arr_of_all_dates[p] };
            }



            ////////////////////////////////////////////////////////////////////////////////////////
            for (var q = 0; q < this.allSalRule.length; q++) {

              var eff_dt = this.allSalRule[q].effective_dt.split('T')[0];

              var amt = 0;
              var pay_code = this.allSalRule[q].pay_code;
              var effective_dt = eff_dt;
              if (this.allSalRule[q].rate_type == 'FIX') {
                amt = this.allSalRule[q].amount;
                this.salObj[this.allSalRule[q]['component_code'] + "-" + String(this.arr_of_all_dates[p])] = { type: 'rule', pay_component_code: this.allSalRule[q]['component_code'], emp_id: activeEmps[i], pay_code: this.allSalRule[q]['pay_code'], pay_component_amt: parseFloat((amt * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)), num_of_days: 1, date: this.arr_of_all_dates[p] };
              } 
              
              else if (this.allSalRule[q].rate_type == 'PERCENTAGE') {
                amt = 0;
                var arr = this.allSalRule[q].dependent_component.split(',');
                for (var j = 0; j < arr.length; j++) {
                  if (this.salObj[arr[j] + "-" + String(this.arr_of_all_dates[p])] == undefined) {
                    amt += 0;
                  } else {
                    amt += this.salObj[arr[j] + "-" + String(this.arr_of_all_dates[p])]['pay_component_amt']
                  }
                }
                var final_amt = parseFloat((amt * this.allSalRule[q].amount / 100).toFixed(3));
                if (final_amt != 0) {
                  this.salObj[this.allSalRule[q]['component_code'] + "-" + String(this.arr_of_all_dates[p])] = { type: 'rule', pay_component_code: this.allSalRule[q]['component_code'], emp_id: activeEmps[i], pay_code: this.allSalRule[q]['pay_code'], pay_component_amt: final_amt, num_of_days: 1, date: this.arr_of_all_dates[p] };
                }


              }
            }




          }

        }


        // await this.getEffectiveComponentByRule(activeEmps[i])

        //***********************get all fix pay */
        var salArr = this.salaryObj.fixed_pay_info[activeEmps[i]];
        if (salArr == undefined) {
          salArr = [];
        }
        console.log(salArr)
        if (salArr != undefined) {
          for (var j = 0; j < salArr.length; j++) {

            var effectiveStartDate = salArr[j].effective_start_dt
            var effectiveEndDate = salArr[j].effective_end_dt
            // var x = effectiveStartDate.split('-');
            // var y = effectiveEndDate.split('-');
            // var effectiveStartYear = parseInt(x[0]);
            // var effectiveStartMonth = parseInt(x[1]);
            // var effectiveStartDay = parseInt(x[2]);
            // var effectiveEndYear = parseInt(y[0]);
            // var effectiveEndMonth = parseInt(y[1]);
            // var effectiveEndDay = parseInt(y[2]);
            // console.log(effectiveStartYear);
            // console.log(effectiveStartMonth);
            // console.log(effectiveStartDay);
            // console.log(effectiveEndYear);
            // console.log(effectiveEndMonth);
            // console.log(effectiveEndDay);
            // if (activeEmps[i] == '20') {
            // console.log(effectiveStartYear);
            // console.log(effectiveStartMonth);
            // console.log(effectiveStartDay);
            // console.log(effectiveEndYear);
            // console.log(effectiveEndMonth);
            // console.log(effectiveEndDay);
            // }
            var currYear = parseInt(this.salaryObj.fin_year);
            var currMonth = parseInt(this.salaryObj.month);
            if (currMonth == 1 || currMonth == 2 || currMonth == 3) {
              currYear += 1;
            }



            for (let p = 0; p < this.arr_of_all_dates.length; p++) {

              console.log(effectiveStartDate)
              console.log(this.arr_of_all_dates[p])
              console.log(effectiveEndDate)
              var date = new Date(this.arr_of_all_dates[p])

              // console.log(await this.getEffectiveArangemnt(activeEmps[i], date));

              console.log((moment(effectiveStartDate) <= moment(date)) && (moment(date) <= moment(effectiveEndDate)))
              console.log((moment(effectiveStartDate) <= moment(this.arr_of_all_dates[p])))
              console.log((moment(effectiveEndDate) >= moment(this.arr_of_all_dates[p])))

              if ((moment(effectiveStartDate) <= moment(this.arr_of_all_dates[p])) && ( moment(this.arr_of_all_dates[p])<=moment(effectiveEndDate) )) {

                if (this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])] == undefined) {
                  this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])] = { type: 'fix', pay_component_code: salArr[j].pay_component_code, emp_id: activeEmps[i], pay_code: salArr[j].pay_code, pay_component_amt: 0, num_of_days: 1, date: this.arr_of_all_dates[p] };
                }

                if (this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])]['pay_code'] == 'PAY') {
                  this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])]['pay_component_amt'] = parseFloat(this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])]['pay_component_amt'] + parseFloat((salArr[j].pay_component_amt * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)));
                } else {
                  this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])]['pay_component_amt'] = parseFloat(this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])]['pay_component_amt'] + parseFloat((salArr[j].pay_component_amt * (1) / this.monthEnd[this.salaryObj.month]).toFixed(3)));
                }
                console.log(this.salObj[salArr[j]["pay_component_code"] + "-" + String(this.arr_of_all_dates[p])]['pay_component_amt'])
                console.log(this.salObj)
              }
              // if (currYear > effectiveStartYear || (currYear == effectiveStartYear && currMonth >= effectiveStartMonth)) {
              //   var start = 1;
              //   var end = this.monthEnd[this.salaryObj.month];
              //   if (currYear == effectiveStartYear && currMonth == effectiveStartMonth) {
              //     start = effectiveStartDay;
              //   }
              //   if (currYear == effectiveEndYear && currMonth == effectiveEndMonth) {
              //     // end = effectiveEndDay;
              //     end = 1;
              //     //end=end-1;
              //   }
              //   console.log(salArr[j]["pay_component_code"] + "-" + String(end - start + 1))
              //   if (end - start + 1 >= 0) {
              //     if (this.salObj[salArr[j]["pay_component_code"] + "-" + String(end - start + 1)] == undefined) {
              //       this.salObj[salArr[j]["pay_component_code"] + "-" + String(end - start + 1)] = { type: 'fix', pay_component_code: salArr[j].pay_component_code, emp_id: activeEmps[i], pay_code: salArr[j].pay_code, pay_component_amt: 0, num_of_days: end - start + 1 };
              //     }
              //     if (this.salObj[salArr[j]["pay_component_code"] + "-" + String(end - start + 1)]['pay_code'] == 'PAY') {
              //       this.salObj[salArr[j]["pay_component_code"] + "-" + String(end - start + 1)]['pay_component_amt'] = Math.round(this.salObj[salArr[j]["pay_component_code"] + "-" + String(end - start + 1)]['pay_component_amt'] + parseFloat((salArr[j].pay_component_amt * (end - start + 1) / this.monthEnd[this.salaryObj.month]).toFixed(3)));

              //     } else {
              //       this.salObj[salArr[j]["pay_component_code"] + "-" + String(end - start + 1)]['pay_component_amt'] = salArr[j].pay_component_amt;

              //     }
              //     console.log(this.salObj[salArr[j]["pay_component_code"] + "-" + String(end - start + 1)]['pay_component_amt'])
              //     console.log(this.salObj)
              //   }


              // }


            }


          }
        }
        var keys = Object.keys(this.salObj);
        for (var j = 0; j < keys.length; j++) {
          this.salaryArr.push(this.salObj[keys[j]]);
        }
        console.log(this.salaryArr)

      }


    }
    //********************Attendance Calculation , Suspended Calculation*/
    // var emps=[]
    // for(var i=0;i<this.salaryArr.length;i++){
    //   var present_days;
    //   var absent_days;
    //   var total_days;
    //   if(emps.indexOf(this.salaryArr[i].emp_id)<0){
    //     emps.push(this.salaryArr[i].emp_id);
    //   }

    //     if(this.salaryArr[i].type=='fix' && this.salaryArr[i].pay_code == 'PAY'){

    //       if(payObj[this.salaryArr[i].emp_id]==undefined){
    //         payObj[this.salaryArr[i].emp_id] = 0;
    //       }
    //       payObj[this.salaryArr[i].emp_id]+=this.salaryArr[i].pay_component_amt;

    //     }
    //     this.salaryArr[i]['b_acct_id'] = this.b_acct_id;
    //     this.salaryArr[i]['emp_id'] = this.salaryArr[i].emp_id;
    //     this.salaryArr[i]['fin_year'] = this.salaryObj.fin_year;
    //     this.salaryArr[i]['month'] = this.salaryObj.month;
    //   /*   if(this.salaryObj['type'] == 'ind' ){
    //       this.salaryArr[i]['bill_desc'] = "Salary  Bill for "+this.mainService.accInfo['account_short_name'] +this.getNumberFormat(this.salaryArr[i].emp_id) +"-"+this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_name/* " hold employees"+ *///" for Month "+this.monthObj[this.salaryObj.month]+", "+year;

    //     //}else  */
    //     if(this.salaryObj['type'] == 'ind'){
    //       this.salaryArr[i]['bill_desc'] = this.mainService.accInfo['account_short_name'] +this.getNumberFormat(this.salaryArr[i].emp_id) +"-"+this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_name+/* " hold employees"+ */" Salary  Bill for "+this.monthObjShort[this.salaryObj.month]+", "+year;
    //     }
    //     else{
    //       this.salaryArr[i]['bill_desc'] = this.mainService.codeValueShowObj['HR0046'][this.salaryObj.emp_cat_code]+" Salary  Bill  for  "+this.monthObjShort[this.salaryObj.month]+", "+year;
    //     }
    //     console.log(this.monthEnd[this.salaryObj.month])
    //     this.salaryArr[i]['pay_component_code'] = this.salaryArr[i].pay_component_code;
    //     this.salaryArr[i]['pay_code'] = this.salaryArr[i].pay_code;
    //     this.salaryArr[i]['section_code'] = this.salaryObj.post_info[this.salaryArr[i].emp_id];
    //     this.salaryArr[i]['bill_status_code'] = "GENERATED";
    //     this.salaryArr[i]['create_user_id'] = this.erpUser.user_id;
    //     this.salaryArr[i]['emp_name'] = this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_name;
    //     this.salaryArr[i]['emp_phone_no'] = this.salaryObj.emp_info[this.salaryArr[i].emp_id].emp_phone_no;
    //     this.salaryArr[i]['accrual_date'] = accrual_date;
    //     this.salaryArr[i]['bill_date'] = accrual_date;
    //     //this.salaryArr[i]['num_of_days'] = this.monthEnd[this.salaryObj.month] - absent_days;
    //     if(this.salaryArr[i]['pay_component_code'] == 'NPS'){
    //       this.salaryArr[i]['pay_component_amt'] = Math.round(this.salaryArr[i]['pay_component_amt'])
    //     }




    // }


    // //***************************Deduction Normalisation */
    // this.actualSalaryArr=[];
    // var salObjNew={}
    // for(var i = 0;i<this.salaryArr.length;i++){
    //   if(salObjNew[this.salaryArr[i].emp_id] == undefined){
    //     salObjNew[this.salaryArr[i].emp_id] ={};
    //   }
    //   salObjNew[this.salaryArr[i].emp_id][this.salaryArr[i]["pay_component_code"]+"-"+i] = this.salaryArr[i];
    // }
    // var seq = ['BASIC','DA','HRA','CCA','MA','PB','CONV','PERSNLPAY','GIS'];
    // for(var i=0;i<emps.length;i++){
    //   var obj = salObjNew[emps[i]];
    //   var keys = Object.keys(obj);

    //   for(var j=0;j<seq.length;j++){
    //     if(obj[seq[j]]!=undefined){
    //       if(obj[seq[j]].pay_code =='PAY'){
    //         this.actualSalaryArr.push(obj[seq[j]]);

    //       }else{
    //         if(obj[seq[j]].pay_component_amt <= payObj[emps[i]]){
    //           this.actualSalaryArr.push(obj[seq[j]]);
    //           payObj[emps[i]] -= obj[seq[j]].pay_component_amt;
    //         }else{
    //           obj[seq[j]].pay_component_amt = payObj[emps[i]]
    //           payObj[emps[i]]=0;
    //           this.actualSalaryArr.push(obj[seq[j]]);
    //         }
    //       }
    //     }
    //   }
    //   for(var j=0;j<keys.length;j++){
    //     if(seq.indexOf(keys[j])<0){
    //       if(obj[keys[j]].pay_code =='PAY' || obj[keys[j]].pay_code =='CONT'){
    //         this.actualSalaryArr.push(obj[keys[j]]);
    //       }else{
    //         if(obj[keys[j]].pay_component_amt <= payObj[emps[i]]){
    //           this.actualSalaryArr.push(obj[keys[j]]);
    //           payObj[emps[i]] -= obj[keys[j]].pay_component_amt;
    //         }else{
    //           obj[keys[j]].pay_component_amt = payObj[emps[i]]
    //           payObj[emps[i]]=0;
    //           this.actualSalaryArr.push(obj[keys[j]]);

    //         }
    //       }
    //     }
    //   }
    // }

    console.log(this.salaryArr);
   
    return this.salaryArr
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
