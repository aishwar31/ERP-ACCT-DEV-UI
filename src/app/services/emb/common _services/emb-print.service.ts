import { CommonDataService } from './common-data.service'
import { EbillService } from '../service/ebill.service';
import { EmbService } from '../service/emb.service'
import { Injectable } from '@angular/core';
import { MainService } from '../service/main.service';
import { MasterDataService } from '../service/master-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ReferenceDataService } from '../service/reference-data.service'
import Swal from 'sweetalert2';
import { TenderService } from '../service/tender.service'
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;





//import { MasterDataService } from '../service/master-data.service'
@Injectable({
  providedIn: 'root'
})
export class EmbPrintService {

  constructor(private CommonDataService: CommonDataService,
    private embService:EmbService,
    private referenceDataS:ReferenceDataService,
    private mainService:MainService,
    //private approveService: ApproveService,
    private ebillService: EbillService,
    private tenderService: TenderService,
    private masterDataService: MasterDataService,
    private spinner: NgxSpinnerService) { }
    //embData = []
    allWork = []
    work_order_id
  async print1(element,ebilluser,selectedTender) {
    
    await this.getAllWorkInfo(ebilluser)
    console.log(this.workObj)
   // var element = this.embData[this.embData.length - 1]
    for (let i = 0; i < this.allWork.length; i++) {
      if (element['work_order_id'] == this.allWork[i]['id']) {
        this.work_order_id = this.allWork[i]['work_order_name']
      }

    }
    /* for (let i = 0; i < this.mainService.codeValueTechObj['EMB001'].length; i++) {

      if (element['project_cd'] == this.mainService.codeValueTechObj['EMB001'][i]['code']) {
        this.project_cd = this.mainService.codeValueTechObj['EMB001'][i]['value']
      }
    } */
    // this.spinner.show()
    var obj = { b_acct_id: ebilluser.b_acct_id, tender_id: element['tender_id'], emb_no: element["emb_no"] };
    var resp = await this.referenceDataS.getdataforprint(JSON.stringify(obj));
    var dtlLines = {}
    for (let i = 0; i < resp['data'].length; i++) {
      if (dtlLines[resp['data'][i]['sno']] == undefined) {
        dtlLines[resp['data'][i]['sno']] = []
        resp['data'][i]["dtlLines"] = JSON.parse(resp['data'][i]["calc"])
        dtlLines[resp['data'][i]['sno']].push(resp['data'][i])
      } else {
        resp['data'][i]["dtlLines"] = JSON.parse(resp['data'][i]["calc"])
        dtlLines[resp['data'][i]['sno']].push(resp['data'][i])
      }

    }
    var obj = { b_acct_id: ebilluser.b_acct_id, tender_id: element['tender_id'], emb_no: element["emb_no"] };
    var res = await this.referenceDataS.getembforprint(JSON.stringify(obj));
    if (element['emb_dt']) {
      element['emb_dt'] = (element['emb_dt'])
    }
    let data = res.data
    var pay_quan = await this.embService.getembbillforprint(JSON.stringify(obj));
    var pay_quanobj = {}
    for (let i = 0; i < pay_quan['data'].length; i++) {

      pay_quanobj[pay_quan['data'][i]['sno']] = pay_quan['data'][i]['q']
    }
    var txt = 'EMB Report for EMB NO - ' + selectedTender['already_emb'];
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
    var tbl1 = {

      //layout: 'lightHorizontalLines',
      fontSize: 10,
      table: {

        headerRows: 0,
        widths: [526, 570],

        body: [



        ]
      }
    };
    var workObj = this.workObj[selectedTender['work_id']];
    //var partyObj=this.partyObj[this.selectedTender['party_id']];

   /*  var arr = [];
    arr.push({ text: "Project ", bold: true });
    arr.push(this.project_cd);
    tbl1.table.body.push(arr); */

    var arr = [];
    arr.push({ text: "Name Of Work ", bold: true });
    arr.push(workObj['work_order_name']);
    tbl1.table.body.push(arr);

    var arr = [];
    arr.push({ text: "Work Order No ", bold: true });
    arr.push(workObj['work_order_no']);
    tbl1.table.body.push(arr);




    var arr = [];
    arr.push({ text: "Last Date of Measurement ", bold: true });
    arr.push(this.mainService.dateformatchange(element['emb_dt']));
    tbl1.table.body.push(arr);

    /* var header0 = {
      columns: [
        {
          width: '*',
          text: 'Abstract of Cost  ',
          bold: true,          
          alignment: 'center'
        }
      ],
 
    } */

    // var header1 = {
    //   columns: [
    //     {
    //       width: '*',
    //       text: 'Emb Till Emb No. :',
    //       bold: true
    //     },

    //     {
    //       width: '*',
    //       text: element['emb_no']
    //     },
    //     {
    //       width: '*',
    //       text: 'Project :',
    //       bold: true
    //     },

    //     {
    //       width: '*',
    //       text: this.project_cd
    //     }
    //   ],

    // }
    // var header2 = {
    //   columns: [
    //     {
    //       width: '*',
    //       text: 'Last Date of Measurement :',
    //       bold: true

    //     },
    //     {
    //       width: '*',
    //       text: (element['emb_dt'])
    //     },
    //     {
    //       width: '*',
    //       text: 'Work :',
    //       bold: true
    //     },

    //     {
    //       width: '*',
    //       text: this.work_order_id
    //     }
    //   ],
    // }



    // dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 1110, y2: 0, lineWidth: 0.05 }] });
    dd.content.push({ text: " " });
    dd.content.push(tbl1);

    dd.content.push({ text: " " });
    dd.content.push({ text: " " });


    dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 1110, y2: 0, lineWidth: 0.05 }] });
    var tbl = {

      // layout: 'lightHorizontalLines',
      fontSize: 10,
      table: {
        headerRows: 2,
        widths: [30, 250, 60, 60, 100, 40, 50, 50, 50, 70, 65, 60, 50, 50],
        body: [
          [{ text: 'S NO.', bold: true }, { text: 'Line Description', alignment: 'left', bold: true }, { text: 'Work Order Quantity ', alignment: 'right', bold: true }, { text: 'Already Measured  Quantity', alignment: 'right', bold: true }, { text: 'Measurement', bold: true, colSpan: 5, alignment: 'center' }, {}, {}, {}, {}, { text: 'Calculated Quantity', alignment: 'right', bold: true }, { text: 'Up to date Qty', alignment: 'right', bold: true }, { text: 'Paid Last Qty', alignment: 'right', bold: true }, { text: 'To Pay Qty', alignment: 'right', bold: true }, { text: 'Excess for BOQ QTY', alignment: 'right', bold: true }],
          [{ text: '', bold: true }, { text: '', alignment: 'left', bold: true }, { text: '', alignment: 'right', bold: true }, { text: '', alignment: 'right', bold: true }, { text: 'NO', bold: true }, { text: 'L', bold: true }, { text: 'B', bold: true }, { text: 'H', bold: true }, { text: 'Unit Wieght', bold: true }, { text: '', alignment: 'right', bold: true }, { text: '', alignment: 'right', bold: true }, { text: '', alignment: 'right', bold: true }, { text: '', alignment: 'right', bold: true }, { text: '', alignment: 'right', bold: true }]

        ],
      }
    };

    dd.content.push(tbl);
    for (var i = 0; i < data.length; i++) {
      if (pay_quanobj[data[i]['sno']] == undefined) {
        pay_quanobj[data[i]['sno']] = 0;
      }
      var arr = []
      arr.push({ text: data[i]['sno'], bold: true });
      arr.push({ text: data[i]['item_desc'], alignment: 'left', bold: true });
      arr.push({ text: this.mainService.trunc(data[i]['eff_quantity'] + data[i]['already_measured']), alignment: 'right', bold: true });
      arr.push({ text: data[i]['already_measured'], alignment: 'right', bold: true });
      arr.push('')
      arr.push('')
      arr.push('')
      arr.push('')
      // arr.push('')
      arr.push('')
      arr.push('');
      arr.push('')
      arr.push('')
      arr.push('')
      arr.push('')
      dd.content[dd.content.length - 1].table.body.push(arr);
      let inner_data = []
      if (dtlLines[data[i]['sno']] != undefined) {
        inner_data = dtlLines[data[i]['sno']]
      } else {
        inner_data = []
      }
      var obb = {}
      var flag = []
      var flag1 = []
      for (let j = 0; j < inner_data.length; j++) {
        if (!flag.includes(inner_data[j]['measure_dt'])) {
          obb[inner_data[j]['measure_dt']] = {}
          obb[inner_data[j]['measure_dt']][inner_data[j]['dtlLines']['rec_measurment']] = []
          obb[inner_data[j]['measure_dt']][inner_data[j]['dtlLines']['rec_measurment']].push(inner_data[j])
          flag.push(inner_data[j]['measure_dt'])
        } else {
          if (obb[inner_data[j]['measure_dt']][inner_data[j]['dtlLines']['rec_measurment']] == undefined) {
            obb[inner_data[j]['measure_dt']][inner_data[j]['dtlLines']['rec_measurment']] = []
          }
          obb[inner_data[j]['measure_dt']][inner_data[j]['dtlLines']['rec_measurment']].push(inner_data[j])
        }

      }
      var arr12 = Object.keys(obb)
      var quan = 0
      quan = data[i]['already_measured']
      for (let j = 0; j < arr12.length; j++) {

        var arr321 = Object.keys(obb[arr12[j]])


        for (let k = 0; k < arr321.length; k++) {
          var totaal = 0
          var ar = []
          ar.push('');
          ar.push({ text: arr321[k], alignment: 'left', bold: true });
          ar.push('');
          ar.push('');
          ar.push('')
          ar.push('')
          ar.push('')
          ar.push('')
          // ar.push('')
          ar.push('')
          ar.push('');
          ar.push('')
          ar.push('')
          ar.push('')
          ar.push('')
          dd.content[dd.content.length - 1].table.body.push(ar);
          var date = []
          date.push('');
          date.push({ text: 'Measurment Date ' + this.mainService.dateformatchange(arr12[j]), alignment: 'left', bold: true });
          date.push('');
          date.push('');
          date.push('')
          date.push('')
          date.push('')
          date.push('')
          // date.push('')
          date.push('')
          date.push('');
          date.push('')
          date.push('')
          date.push('')
          date.push('')
          dd.content[dd.content.length - 1].table.body.push(date);
          var arr3210 = obb[arr12[j]][arr321[k]]

          for (let l = 0; l < arr3210.length; l++) {

            var measure = []
            measure.push('');
            measure.push({ text: arr3210[l]['measure_desc'], alignment: 'left' });
            measure.push('');
            measure.push({ text: quan, alignment: 'right' });
            quan = this.mainService.trunc((quan + arr3210[l]['quantity']))
            totaal = this.mainService.trunc((totaal + arr3210[l]['quantity']))
            var number = 1
            var length = null
            var lengthcount = 1
            var heightcount = 1
            var widthcount = 1;
            var height = null
            var width = null
            var cons = null
            var radius = null
            var radiusCount = 1;
            var nom = null
            for (let m = 0; m < arr3210[l]['dtlLines']['measureobj'].length; m++) {
              if (arr3210[l]['dtlLines']['measureobj'][m]['measure'] == 'number') {

                number = arr3210[l]['dtlLines']['measureobj'][m]['mes']
              } else if (arr3210[l]['dtlLines']['measureobj'][m]['measure'] == 'length') {
                if (length != null) {
                  length = length + "+" + arr3210[l]['dtlLines']['measureobj'][m]['mes']
                  lengthcount = lengthcount + 1
                } else {
                  length = arr3210[l]['dtlLines']['measureobj'][m]['mes']
                }

              } else if (arr3210[l]['dtlLines']['measureobj'][m]['measure'] == 'height') {
                if (height != null) {
                  height = height + "+" + arr3210[l]['dtlLines']['measureobj'][m]['mes']
                  heightcount = heightcount + 1
                } else {
                  height = arr3210[l]['dtlLines']['measureobj'][m]['mes']
                }

              } else if (arr3210[l]['dtlLines']['measureobj'][m]['measure'] == 'width') {

                if (width != null) {
                  width = width + "+" + arr3210[l]['dtlLines']['measureobj'][m]['mes']
                  widthcount = widthcount + 1
                } else {
                  width = arr3210[l]['dtlLines']['measureobj'][m]['mes']
                }
              } else if (arr3210[l]['dtlLines']['measureobj'][m]['measure'] == 'Unitwieght') {
                cons = arr3210[l]['dtlLines']['measureobj'][m]['mes']
              } else if (arr3210[l]['dtlLines']['measureobj'][m]['measure'] == 'Const') {
                cons = arr3210[l]['dtlLines']['measureobj'][m]['mes']
              }
              /*  else {
               
                cons = arr3210[l]['dtlLines']['measureobj'][m]['mes']
              } */

              /* else if(arr3210[l]['dtlLines']['measureobj'][m]['measure'] == 'radius'){
                nom = arr3210[l]['dtlLines']['measureobj'][m]['mes']
              }
               */




            }
            for (let m = 0; m < arr3210[l]['dtlLines']['formula'].length; m++) {
              if (!isNaN(arr3210[l]['dtlLines']['formula'][m])) {
                cons = arr3210[l]['dtlLines']['formula'][m]
              }




            }
            var sideobj = new Object();
            var sideobjcount = new Object()

            for (let m = 0; m < arr3210[l]['dtlLines']['formula'].length; m++) {
              if (isNaN(arr3210[l]['dtlLines']['formula'][m]) && arr3210[l]['dtlLines']['formula'][m] != 'number' && arr3210[l]['dtlLines']['formula'][m] != 'Unitwieght' && arr3210[l]['dtlLines']['formula'][m] != 'Const') {
                if (sideobj[arr3210[l]['dtlLines']['formula'][m]] != undefined) {
                  sideobj[arr3210[l]['dtlLines']['formula'][m] + m] = sideobj[arr3210[l]['dtlLines']['formula'][m]]
                  sideobjcount[arr3210[l]['dtlLines']['formula'][m] + m] = sideobjcount[arr3210[l]['dtlLines']['formula'][m]]
                  sideobj[arr3210[l]['dtlLines']['formula'][m]] = undefined
                }
                for (let n = 0; n < arr3210[l]['dtlLines']['measureobj'].length; n++) {

                  if (arr3210[l]['dtlLines']['measureobj'][n]['measure'] == arr3210[l]['dtlLines']['formula'][m]) {
                    if (sideobj[arr3210[l]['dtlLines']['formula'][m]] != undefined) {
                      sideobj[arr3210[l]['dtlLines']['formula'][m]] = sideobj[arr3210[l]['dtlLines']['formula'][m]] + "+" + arr3210[l]['dtlLines']['measureobj'][n]['mes']
                      sideobjcount[arr3210[l]['dtlLines']['formula'][m]] = sideobjcount[arr3210[l]['dtlLines']['formula'][m]] + 1
                    } else {
                      sideobj[arr3210[l]['dtlLines']['formula'][m]] = arr3210[l]['dtlLines']['measureobj'][n]['mes']
                      sideobjcount[arr3210[l]['dtlLines']['formula'][m]] = 1
                    }

                  }
                }
              }
            }
            measure.push({ text: number, alignment: 'right' })
            //measure.push({ text: nom, alignment: 'right' })
            var sidepbjarr = Object.keys(sideobj)
            if (sidepbjarr.length < 3) {
              for (let o = 0; o < sidepbjarr.length; o++) {
                if (sideobjcount[sidepbjarr[o]] > 1) {
                  measure.push({ text: "(" + sideobj[sidepbjarr[o]] + ")/" + sideobjcount[sidepbjarr[o]], alignment: 'right' })
                } else {
                  measure.push({ text: sideobj[sidepbjarr[o]], alignment: 'right' })
                }

              }
              for (let o = 0; o < 3 - sidepbjarr.length; o++) {
                measure.push('')

              }
            } else {
              for (let o = 0; o < 3; o++) {
                if (sideobjcount[sidepbjarr[o]] > 1) {
                  measure.push({ text: "(" + sideobj[sidepbjarr[o]] + ")/" + sideobjcount[sidepbjarr[o]], alignment: 'right' })
                } else {
                  measure.push({ text: sideobj[sidepbjarr[o]], alignment: 'right' })
                }

              }
            }
            measure.push({ text: cons, alignment: 'right' })
            /*  if (lengthcount > 1) {
               measure.push({ text: "(" + length + ")/" + lengthcount, alignment: 'right' })
             } else {
               measure.push({ text: length, alignment: 'right' })
             }
             if (widthcount > 1) {
               measure.push({ text: "(" + width + ")/" + widthcount, alignment: 'right' })
             } else {
               measure.push({ text: width, alignment: 'right' })
             }
             if (heightcount > 1) {
               measure.push({ text: "(" + height + ")/" + heightcount, alignment: 'right' })
             } else {
               measure.push({ text: height, alignment: 'right' })
             }
 
 
 
 
              */
            measure.push({ text: arr3210[l]['quantity'], alignment: 'right' });
            measure.push('')
            measure.push('')
            measure.push('')
            measure.push('')
            dd.content[dd.content.length - 1].table.body.push(measure);
          }
          var total = []
          total.push('');
          total.push({ text: 'S. TOTAL  ', alignment: 'left', bold: true });
          total.push('');
          total.push({ text: this.mainService.trunc((quan - totaal)), alignment: 'right', bold: true });

          total.push('')
          // total.push('')
          total.push('')
          total.push('')
          total.push('')
          total.push('')
          total.push({ text: totaal, alignment: 'right', bold: true });


          total.push({ text: quan, alignment: 'right', bold: true })
          // total.push({ text: Number((quan - totaal).toFixed(2)), alignment: 'right', bold: true })



          // total.push({ text: (quan - (quan - totaal)).toFixed(2), alignment: 'right', bold: true })
          // if ((data[i]['eff_quantity'] + data[i]['already_measured'] - (quan)) < 0) {
          //   total.push({ text: -1 * (data[i]['woq'] - (quan)), alignment: 'right', bold: true })
          // } else {
          //   total.push('')
          // }

          //new Code
          console.log(arr12.length, j);
          if (j < arr12.length - 1 || k < arr321.length - 1) {
            total.push('');
            total.push('');

          } else {
            total.push({ text: this.mainService.trunc((pay_quanobj[data[i]['sno']] + data[i]['already_measured'])), alignment: 'right', bold: true })

            //50,10,70
            if ((data[i]['eff_quantity'] + data[i]['already_measured'] - (quan)) < 0) {
              total.push({ text: this.mainService.trunc((data[i]['eff_quantity'] - pay_quanobj[data[i]['sno']])), alignment: 'right', bold: true })

            } else {
              total.push({ text: this.mainService.trunc(quan - this.mainService.trunc((pay_quanobj[data[i]['sno']] + data[i]['already_measured']))), alignment: 'right', bold: true })

            }

          }
          if ((data[i]['eff_quantity'] + data[i]['already_measured'] - (quan)) < 0) {
            total.push({ text: -1 * this.mainService.trunc((data[i]['eff_quantity'] + data[i]['already_measured'] - (quan))), alignment: 'right', bold: true })
          } else {
            total.push('')
          }


          dd.content[dd.content.length - 1].table.body.push(total);
        }

      }

    }


    dd.content.push({ text: " " });
    // dd.content.push(sig);
    this.spinner.hide()
    pdfMake.createPdf(dd).download("EMBReport");
  }
  workObj = {}
  async getAllWorkInfo(ebilluser) {
    this.spinner.show()
    var obj = new Object();
    obj['b_acct_id'] = ebilluser.b_acct_id;
    var resp = await this.masterDataService.getWorkInfo(JSON.stringify(obj));
    if (resp['error'] == false) {
      var dt = [];
      var temp = resp['data'];
     /*  for (var i = 0; i < temp.length; i++) {
        if (this.assignedWorks[temp[i]['id']] != undefined) {
          dt.push(temp[i])
        }

      } */
      this.allWork = temp;
      for (var i = 0; i < this.allWork.length; i++) {
        this.allWork[i]['work_des'] = this.allWork[i]['work_order_no'] + " - " + this.allWork[i]['work_order_name'];
        this.workObj[this.allWork[i]['id']] = this.allWork[i]

      }
      this.spinner.hide()

    } else {
      this.spinner.hide()
    }
  }
}
