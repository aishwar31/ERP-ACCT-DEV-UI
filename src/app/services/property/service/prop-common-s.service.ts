import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PropCommonSService {

  constructor() { }
  level1 = []
  level2 = []
  level3 = []
  level4 = []
  level5 = []
  level6 = []
  level7 = []
  refresh(allHier) {
    let temp = []
    this.level1 = []
    for (let i = 0; i < allHier.length; i++) {
      if (!temp.includes(allHier[i]['lvl1_cd'])) {
        temp.push(allHier[i]['lvl1_cd'])
        if (allHier[i]['lvl1_cd']) {
          this.level1.push(allHier[i])
        }
      }
    }
    this.level2 = []
    this.level3 = []
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []
    return this.removeSpace(this.level1)
  }
  async onChangeLvl1(allHier, Obj) {
    console.log('called')
    for (let i = 0; i < allHier.length; i++) {
      if (allHier[i]['lvl1_cd'] == Obj['lvl1_cd']) {
        Obj['lvl1_value'] = allHier[i]['lvl1_value']
        Obj['lvl1_node_type'] = allHier[i]['leaf_node_type']
        Obj['lvl1_node_type'] = allHier[i]['leaf_node_type']
      }
    }
    let temp = []
    this.level2 = []
    for (let i = 0; i < allHier.length; i++) {
      if (allHier[i]['lvl1_cd'] == Obj['lvl1_cd']) {
        if (!temp.includes(allHier[i]['lvl2_cd'])) {
          temp.push(allHier[i]['lvl2_cd'])
          let ob = new Object()
          if (allHier[i]['lvl2_cd']) {
            this.level2.push(allHier[i])
          }
        }
      }
    }
    this.level3 = []
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []
    return this.removeSpace(this.level2)

  }
  async onChangeLvl2(allHier, Obj) {
    console.log('called')

    for (let i = 0; i < this.level2.length; i++) {
      if (this.level2[i]['lvl2_cd'] == Obj['lvl2_cd']) {
        Obj['lvl2_value'] = this.level2[i]['lvl2_value']
        Obj['lvl2_node_type'] = this.level2[i]['leaf_node_type']

      }
    }
    let temp = []
    this.level3 = []
    for (let i = 0; i < allHier.length; i++) {
      if (allHier[i]['lvl2_cd'] == Obj['lvl2_cd']) {
        if (!temp.includes(allHier[i]['lvl3_cd'])) {
          temp.push(allHier[i]['lvl3_cd'])
          if (allHier[i]['lvl3_cd']) {
            this.level3.push(allHier[i])
          }
        }
      }
    }
    this.level4 = []
    this.level5 = []
    this.level6 = []
    this.level7 = []
    return this.removeSpace(this.level3)
  }
  async onChangeLvl3(allHier, Obj) {
    console.log('called')

    for (let i = 0; i < this.level3.length; i++) {
      if (this.level3[i]['lvl3_cd'] == Obj['lvl3_cd']) {
        Obj['lvl3_value'] = this.level3[i]['lvl3_value']
        Obj['lvl3_node_type'] = this.level3[i]['leaf_node_type']

      }
    }
    let temp = []
    this.level4 = []
    for (let i = 0; i < allHier.length; i++) {
      if (allHier[i]['lvl3_cd'] == Obj['lvl3_cd']) {
        if (!temp.includes(allHier[i]['lvl4_cd'])) {
          temp.push(allHier[i]['lvl4_cd'])
          if (allHier[i]['lvl4_cd']) {
            this.level4.push(allHier[i])
          }
        }
      }

    }
    this.level5 = []
    this.level6 = []
    this.level7 = []

    return this.removeSpace(this.level4)
  }

  async onChangeLvl4(allHier, Obj) {
    for (let i = 0; i < this.level4.length; i++) {
      if (this.level4[i]['lvl4_cd'] == Obj['lvl4_cd']) {
        Obj['lvl4_value'] = this.level4[i]['lvl4_value']
        Obj['lvl4_node_type'] = this.level4[i]['leaf_node_type']
        Obj['lvl4_node_type'] = this.level4[i]['leaf_node_type']
      }
    }
    let temp = []
    this.level5 = []
    for (let i = 0; i < allHier.length; i++) {
      if (allHier[i]['lvl4_cd'] == Obj['lvl4_cd']) {
        if (!temp.includes(allHier[i]['lvl5_cd'])) {
          temp.push(allHier[i]['lvl5_cd'])
          if (allHier[i]['lvl5_cd']) {
            this.level5.push(allHier[i])
          }
        }
      }

    }
    this.level6 = []
    this.level7 = []
    return this.removeSpace(this.level5)
  }

  async onChangeLvl5(allHier, Obj) {
    for (let i = 0; i < this.level5.length; i++) {
      if (this.level5[i]['lvl5_cd'] == Obj['lvl5_cd']) {
        Obj['lvl5_value'] = this.level5[i]['lvl5_value']
        Obj['lvl5_node_type'] = this.level5[i]['leaf_node_type']

      }
    }
    let temp = []
    this.level6 = []
    for (let i = 0; i < allHier.length; i++) {
      if (allHier[i]['lvl5_cd'] == Obj['lvl5_cd']) {
        if (!temp.includes(allHier[i]['lvl6_cd'])) {
          temp.push(allHier[i]['lvl6_cd'])
          let ob = new Object()
          if (allHier[i]['lvl6_cd']) {
            this.level6.push(allHier[i])
          }
        }
      }

    }
    this.level7 = []
    return this.removeSpace(this.level6)
  }


  async onChangeLvl6(allHier, Obj) {
    for (let i = 0; i < this.level6.length; i++) {
      if (this.level6[i]['lvl6_cd'] == Obj['lvl6_cd']) {
        Obj['lvl6_value'] = this.level6[i]['lvl6_value']
        Obj['lvl6_node_type'] = this.level6[i]['leaf_node_type']

      }
    }
    let temp = []
    this.level7 = []
    for (let i = 0; i < allHier.length; i++) {
      if (allHier[i]['lvl6_cd'] == Obj['lvl6_cd']) {
        if (!temp.includes(allHier[i]['lvl7_cd'])) {
          temp.push(allHier[i]['lvl7_cd'])
          let ob = new Object()
          if (allHier[i]['lvl7_cd']) {
            this.level7.push(allHier[i])
          }
        }
      }
    }
    return this.removeSpace(this.level7)
  }

  removeSpace(arr) {
    console.log(arr,'arr')
    let dummy = []
    for (let i = 0; i < arr.length; i++) {
      if (Object.keys(arr[i]).length > 0) {
        dummy.push(arr[i])
      }
    }
    return dummy
  }


}
