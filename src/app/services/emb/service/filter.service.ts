import { Injectable } from '@angular/core';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private mainService: MainService) { }
  filterData = [];

  filterObj = { 'project': [], 'work': [], 'zone': [] };

  async FilterDataFunction(data) {
    this.filterData = data;
    this.filterObj = { 'project': [], 'work': [], 'zone': [] };

    console.log(this.filterData);
    var ProjectcodeValue = this.mainService.codeValueTechObj['EMB001'];
    var ZonecodeValue = this.mainService.codeValueTechObj['EMB003'];


    var allproject = {};
    var allWork = {};
    var allZone = {};
    for (let i = 0; i < this.filterData.length; i++) {
      allproject[this.filterData[i]['proj_cd']] = this.filterData[i]['proj_cd'];
      allWork[this.filterData[i]['work_id']] = this.filterData[i]['work_id'];
      allZone[this.filterData[i]['zone_cd']] = this.filterData[i]['zone_cd'];

    }

    var tempP = Object.keys(allproject);
    for (let j = 0; j < tempP.length; j++) {
      for (let i = 0; i < ProjectcodeValue.length; i++) {
        if (tempP[j] == ProjectcodeValue[i]['code']) {
          this.filterObj['project'].push(ProjectcodeValue[i])
        }
      }
    }


    var tempW = Object.keys(allWork);
    var unique = tempW.filter((v, i, a) => a.indexOf(v) === i);
    this.filterObj['work'] = unique;

    var tempZ = Object.keys(allZone);
    for (let j = 0; j < tempZ.length; j++) {
      for (let i = 0; i < ZonecodeValue.length; i++) {
        if (tempZ[j] == ZonecodeValue[i]['code']) {
          this.filterObj['zone'].push(ZonecodeValue[i])
        }
      }
    }


    console.log(this.filterObj);




  }
  async FilterDataFunctionForCodeValue() {
    this.filterObj = { 'project': [], 'work': [], 'zone': [] };

    console.log(this.filterData);
    var ProjectcodeValue = this.mainService.codeValueTechObj['EMB001'];
    var ZonecodeValue = this.mainService.codeValueTechObj['EMB003'];

    var allproject = {};
    var allWork = {};
    var allZone = {};
    for (let i = 0; i < this.filterData.length; i++) {
      allproject[this.filterData[i]['proj_cd']] = this.filterData[i]['proj_cd'];
      allWork[this.filterData[i]['work_id']] = this.filterData[i]['work_id'];
      allZone[this.filterData[i]['zone_cd']] = this.filterData[i]['zone_cd'];

    }

    var tempP = Object.keys(allproject);
    for (let j = 0; j < tempP.length; j++) {
      for (let i = 0; i < ProjectcodeValue.length; i++) {
        if (tempP[j] == ProjectcodeValue[i]['code']) {
          this.filterObj['project'].push(ProjectcodeValue[i])
        }
      }
    }


    var tempW = Object.keys(allWork);
    var unique = tempW.filter((v, i, a) => a.indexOf(v) === i);
    this.filterObj['work'] = unique;

    var tempZ = Object.keys(allZone);
    for (let j = 0; j < tempZ.length; j++) {
      for (let i = 0; i < ZonecodeValue.length; i++) {
        if (tempZ[j] == ZonecodeValue[i]['code']) {
          this.filterObj['zone'].push(ZonecodeValue[i])
        }
      }
    }
    console.log(this.filterObj);
  }
}
