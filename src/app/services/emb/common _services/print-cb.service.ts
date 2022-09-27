import { Injectable } from '@angular/core';
import { EbillService } from '../service/ebill.service';
import { MasterDataService } from '../service/master-data.service';
import { TenderService } from '../service/tender.service'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class PrintCbService {

  constructor(
    private ebillService: EbillService,
    private tenderService: TenderService,
    private masterDataService: MasterDataService,
    private spinner:NgxSpinnerService
  ) { }
}
