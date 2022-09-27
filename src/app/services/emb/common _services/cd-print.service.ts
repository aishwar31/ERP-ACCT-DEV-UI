import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MainService } from '../service/main.service';
import { MasterDataService } from '../service/master-data.service';
import { ReferenceDataService } from '../service/reference-data.service'
@Injectable({
  providedIn: 'root'
})
export class CdPrintService {

  constructor(
    private referenceDataService:ReferenceDataService,
    private masterDataService: MasterDataService,
    private mainService:MainService
  ) { }
  async print(element,ebilluser) {
    await this.getAllWorkInfo(ebilluser)
    await this.getAllDed(ebilluser)
    await this.getDeductions(element);
    var account_name=ebilluser['account_name'];
    var account_short_name=ebilluser['account_short_name'];
    var txt = account_name + "(" +account_short_name+ ") \n";
   // var txt = "LUCKNOW DEVELOPMENT AUTHORITY" + "(" + "LDA" + ") , LUCKNOW "
    var txt1 =''// "VIPIN KHAND,GOMTI NAGAR , LUCKNOW - 226010";
    var dd = {
      pageSize: 'A3',
      header: function (currentPage, pageCount) {
        var arr = []
        var obj = { text: txt, alignment: 'center', margin: [72, 40], fontSize: 15, bold: true, style: 'header' };
        arr.push(obj);

        return arr;
      },
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      content: [

      ]
    };
    var obj1 = { text: txt1, alignment: 'center', bold: true, style: 'header' };
    dd.content.push(obj1);

    var header1 = {
      columns: [
        {
          width: '*',
          text: 'CB FOR RUNNING BILL',
          bold: true,
          alignment: 'center'
        }

      ],

    }
    var header2 = {
      columns: [
        {
          width: '*',
          text: 'C.B. No. :',
          bold: true

        },
        {
          width: '*',
          text: element['cb_id']
        },
        {
          width: '*',
          text: 'PRINT DATE :',
          bold: true
        },
        {
          width: '*',
          text: this.mainService.dateformatchange(element['cb_date'])
        }
      ],

    }
    var header3 = {
      columns: [
        {
          width: '*',
          text: 'Current Bill :',
          bold: true

        },
        {
          width: '*',
          text: element.cb_id + " For Work ID.:" + element['work_id']
        },
        {
          width: '*',
          text: '',
          bold: true
        },
        {
          width: '*',
          text: '',
          bold: true
        }
      ],

    }

    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });


    dd.content.push({ text: " " });
    dd.content.push(header1);
    dd.content.push({ text: " " });


    dd.content.push(header2);

    dd.content.push(header3);

    dd.content.push({ text: " " });

    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });

    var header8 = {
      columns: [
        {
          width: '*',
          text: 'Bill Description',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'Description of Charge/Number/Date of Authority for all charges requiring special',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'Amount',
          bold: true,
          alignment: 'right'
        }

      ],


    }
    dd.content.push({ text: " " });
    dd.content.push(header8);

    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });
    let ob = JSON.parse(element.data);
    var temp_AllBillRow = ob['payable_rows'];

    var totalPayable = 0;

    for (let i = 0; i < temp_AllBillRow.length; i++) {
      totalPayable =totalPayable+ temp_AllBillRow[i]['amount'] + temp_AllBillRow[i]['cgst'] + temp_AllBillRow[i]['igst'] + temp_AllBillRow[i]['sgst']
      var eventObj = {
        columns: [
          {
            width: '*',
            text: temp_AllBillRow[i]['event_desc'],
            bold: false,
            alignment: 'center'
          },
          {
            width: '*',
            text: element['work_id'] + " - " + this.workObj[element['work_id']],
            bold: false,
            alignment: 'center'
          },
          {
            width: '*',
            text: temp_AllBillRow[i]['amount'],
            bold: false,
            alignment: 'right'
          }

        ],


      }

      var cgstHeader = {
        columns: [
          {
            width: '*',
            text: "",
            bold: false,
            alignment: 'center'
          },
          {
            width: '*',
            text: "CGST",
            bold: false,
            alignment: 'left'
          },
          {
            width: '*',
            text: temp_AllBillRow[i]['cgst'],
            bold: false,
            alignment: 'right'
          }

        ],


      }
      var sgstHeader = {
        columns: [
          {
            width: '*',
            text: "",
            bold: false,
            alignment: 'left'
          },
          {
            width: '*',
            text: "SGST",
            bold: false,
            alignment: 'left'
          },
          {
            width: '*',
            text: temp_AllBillRow[i]['sgst'],

            bold: false,
            alignment: 'right'
          }

        ],
      }
      var igstHeader = {
        columns: [
          {
            width: '*',
            text: "",
            bold: false,
            alignment: 'left'
          },
          {
            width: '*',
            text: "IGST",
            bold: false,
            alignment: 'left'
          },
          {
            width: '*',
            text: temp_AllBillRow[i]['igst'],

            bold: false,
            alignment: 'right'
          }

        ],
      }

      dd.content.push({ text: " " });
      dd.content.push(eventObj);
      dd.content.push({ text: " " });
      if (temp_AllBillRow[i]['cgst'] != 0) {
        dd.content.push(cgstHeader);
        dd.content.push({ text: " " });
      }
      if (temp_AllBillRow[i]['sgst'] != 0) {
        dd.content.push(sgstHeader);
        dd.content.push({ text: " " });
      }
      if (temp_AllBillRow[i]['igst'] != 0) {
        dd.content.push(igstHeader);
        dd.content.push({ text: " " });
      }



      dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });
      dd.content.push({ text: " " });

    }


    dd.content.push({ text: " " });
    dd.content.push({ text: "Total Payable : " + totalPayable.toFixed(2), bold: true, alignment: 'right' });

    dd.content.push({ text: " " });

    dd.content.push({ text: "Deductions : ", bold: true });
    dd.content.push({ text: " " });

    var tbl = {

      // layout: 'lightHorizontalLines',
      fontSize: 10,
      table: {

        headerRows: 1,
        widths: ['*', '*', '*'],

        body: [
          [{ text: 'SR NO.', alignment: 'left', bold: true },
          { text: 'Dedution Name', alignment: 'left', bold: true },
          { text: 'Amount', alignment: 'right', bold: true }]
        ]
      }
    };
    var detdata = this.allDed
    var ttl = 0;
    for (var i = 0; i < detdata.length; i++) {
      var arr = [];
      arr.push({ text: i + 1 });
      arr.push({ text: detdata[i]['deduction_name'], alignment: 'left' });
      arr.push({ text: detdata[i]['ded_amount'].toFixed(2), alignment: 'right' });
      ttl = ttl + Number(detdata[i]['ded_amount'])
      tbl.table.body.push(arr)
    }
    dd.content.push(tbl)
    dd.content.push({ text: " " });
    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 760, y2: 0, lineWidth: 0.5 }] });
    dd.content.push({ text: " " });

    dd.content.push({ text: "Total Deductions : " + ttl.toFixed(2), bold: true, alignment: 'right' });
    dd.content.push({ text: " " });
    dd.content.push({ text: "With Held Amount : " + ob.withheldamount.toFixed(2), bold: true, alignment: 'right' });
    dd.content.push({ text: " " });
    var netPayable = 0;
    var netPayable = Number(element.net_amt) - Number(ob.withheldamount) ;
    dd.content.push({ text: "Net Payable : " + netPayable.toFixed(2), bold: true, alignment: 'right' });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    var header11 = {
      columns: [
        {
          width: '*',
          text: "P.W.C.",
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'D.A.',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'E.E.',
          bold: true,
          alignment: 'center'
        }


      ],


    }
    var header10 = {
      columns: [
        {
          width: '*',
          text: "Accounts Clerck",
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'Actt.',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'AAO/AO/C.A.',
          bold: true,
          alignment: 'center'
        },
        {
          width: '*',
          text: 'F.C.',
          bold: true,
          alignment: 'center'
        }

      ],


    }
    var amt_word = this.toWords(totalPayable.toFixed(2));


    dd.content.push(header11);
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: "Passed for Payment of Rs." + totalPayable.toFixed(2) + " (" + amt_word + " only)", fontSize: 15 });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });

    dd.content.push(header10);
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });

    dd.content.push({ text: "Above payment of Rs." + totalPayable.toFixed(2) + " (" + amt_word + " only) sanctioned.", fontSize: 15 });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    dd.content.push({ text: " " });
    var header12 = {
      columns: [
        {
          width: '*',
          text: "Jt. Secy /Add. Secy / Secretary",
          bold: true,
          alignment: 'right'
        }
      ],
    }
    dd.content.push(header12);

    pdfMake.createPdf(dd).download('bill' + '.pdf');


  }
  toWords(s) {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];

    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == '1') {
          str += tn[Number(n[i + 1])] + ' ';
          i++;
          sk = 1;
        } else if (n[i] != 0) {
          str += tw[n[i] - 2] + ' ';
          sk = 1;
        }
      } else if (n[i] != 0) {
        str += dg[n[i]] + ' ';
        if ((x - i) % 3 == 0) str += 'hundred ';
        sk = 1;
      }
      if ((x - i) % 3 == 1) {
        if (sk) str += th[(x - i - 1) / 3] + ' ';
        sk = 0;
      }
    }
    if (x != s.length) {
      var y = s.length;
      str += 'point ';
      for (let i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
  }
  net_amount
  getDeductions(element) {
    let ob = JSON.parse(element.data);
    var temp_AllBillRow = ob['payable_rows'];

    let obj = new Object();
    for (let i = 0; i < temp_AllBillRow.length; i++) {
      for (let j = 0; j < temp_AllBillRow[i]['ded'].length; j++) {
        if (obj[temp_AllBillRow[i]['ded'][j]['deduction_id']] == undefined) {
          obj[temp_AllBillRow[i]['ded'][j]['deduction_id']] = 0
        }
        if (temp_AllBillRow[i]['ded'][j]['amt_type'] == 'PERCENTAGE') {
          obj[temp_AllBillRow[i]['ded'][j]['deduction_id']] = obj[temp_AllBillRow[i]['ded'][j]['deduction_id']] + (temp_AllBillRow[i]['amount'] * temp_AllBillRow[i]['ded'][j]['ded_amount'] / 100)
        } else {
          obj[temp_AllBillRow[i]['ded'][j]['deduction_id']] = obj[temp_AllBillRow[i]['ded'][j]['deduction_id']] + temp_AllBillRow[i]['ded'][j]['ded_amount']
        }
      }
      this.net_amount = this.net_amount + temp_AllBillRow[i]['payable_amount']
    }

    var keys = Object.keys(obj)
    this.allDed = []
    for (let i = 0; i < keys.length; i++) {
      this.allDed.push({deduction_id:keys[i], 'deduction_name': this.dedDataArr[keys[i]]['ded_name'], 'ded_amount': obj[keys[i]] })
    }
  }
  dedDataArr = {}
  AllDedList = []
  async getAllDed(ebilluser) {
   // this.spinner.show()
    var resp = await this.referenceDataService.getDeductionList(JSON.stringify(ebilluser.b_acct_id));
    console.log(resp);
    if (resp['error'] == false) {
      this.AllDedList = resp.data;
      for (let i = 0; i < this.AllDedList.length; i++) {
        this.dedDataArr[this.AllDedList[i]['deduction_id']] = this.AllDedList[i]
      }
     // this.spinner.hide();
    } else {
     // this.spinner.hide()
     /*  this.snackBar.open("Error while getting  all ded list", 'Error', {
        duration: 5000
      }); */
    }
  }
  allDed = []
  AllWorkInfo = []
  workObj = {};
  async getAllWorkInfo(ebilluser) {
    var obj = new Object();
    obj['b_acct_id'] = ebilluser.b_acct_id;
    var resp = await this.masterDataService.getWorkInfo(JSON.stringify(obj));
    console.log(resp);

    if (resp['error'] == false) {
      this.AllWorkInfo = resp['data'];
      for (let i = 0; i < this.AllWorkInfo.length; i++) {
        this.AllWorkInfo[i]['desc']=this.AllWorkInfo[i]['work_order_no']+"-"+this.AllWorkInfo[i]['work_order_name']
        this.workObj[this.AllWorkInfo[i]['work_order_no']] = this.AllWorkInfo[i]['work_order_name']
      }
      console.log( this.AllWorkInfo);
      console.log("Mohit")
     // this.spinner.hide();
    } else {
     // this.spinner.hide();
    }
  }
}
