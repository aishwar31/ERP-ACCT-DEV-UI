import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpUrl;
  httpUrl1
  system_url;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/usermanagement';
    // this.httpUrl1 = this.main.httpUrl+'/profile';

  }

  ///new Code Shubham


  //users

  async getUserAuthForLevel(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/user/getUserAuthForLevel' + acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllWorkRelatedUser(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/AccountRoles/getAllWorkRelatedUser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getAllRolesWIthResource(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/AccountRoles/getAllRolesWIthResource' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addAccountUserRole(obj) {

    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/AccountRoles/addAccountUserRole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  } async updateAccountUserRole(obj) {

    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/AccountRoles/updateAccountUserRole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async updateUserInfo(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/user/updateUserInfo', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getUsers(acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/user/getAllUsers' + acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 

  async getUserAllDetails(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/user/getUserAllDetails' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteUser(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl + '/administration/user/deleteUser' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async createUser(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/user/createUser', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async addExistingUserRole(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/user/addExistingUserRole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  //support

  async addHelpData(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl2 + '/systemdata/help/addHelpData', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateHelpData(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl2 + '/systemdata/help/updateHelpData', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteHelpData(obj) {
    const resp = await this.http.delete<any>(this.main.httpUrl2 + '/systemdata/help/deleteHelpData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getHelpData(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl2 + '/systemdata/help/getHelpData' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  
  async gethelpDocument(obj) {
    const resp = await this.http.post(this.main.httpUrl2 + '/systemdata/help/gethelpDocument', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }


  //roles

  async getUsersRoles(acct_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/administration/roles/getAllUserRoles' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }


  async updateUserRole(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/roles/updateUserRole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  ///new Code Shubham

  async sendotp(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/authentication/sendotp', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteCreatedRole(role_id) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteRole' + role_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deleteUnUsedRole(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/AccountRoles/deleteRole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateRole(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/updaterole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addNewRole(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/addnewrole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllRoles(acct_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/getAllRoles' + acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllInterfaces() {
    const resp = await this.http.get<any>(this.httpUrl + '/getSystemInterfaces').toPromise().then(res => {
      return res;
    });
    return resp;
  }
  // async getUsers(acct_id){
  //   const resp = await this.http.get<any>(this.httpUrl + '/getallusers'+acct_id).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  //    async getRoles(acct_id){
  //   const resp = await this.http.get<any>(this.httpUrl + '/getAllRoles'+acct_id).toPromise().then(res => {
  //       return res;
  //      });
  //      return resp;
  //    }

  //    async getUsersRoles(acct_id){
  //     const res = await this.http.get<any>(this.httpUrl + '/getalluserrole'+acct_id).toPromise().then(res => {
  //        return res;
  //     });
  //      return res;
  //  }
  // async deleteUser(user_id){
  //   const resp = await this.http.delete<any>(this.httpUrl + '/deleteuser'+user_id).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }

  async deleteRole(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/deleteRoleofuser', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getRoles(b_acct_id) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/roles/getRoles' + b_acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async signup(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/authentication/signup', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async getuserAccountInfo(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/accountInfo/getAccountInfo' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async getProcessingGroup(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/ProcessingGroup/getProcessingGroups' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async createAccountInfo(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/authentication/createAccountInfo', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async createProcessingGroup(obj) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/ProcessingGroup/createProcessingGroup', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async assignRole(obj) {

    const resp = await this.http.post<any>(this.httpUrl + '/assignrole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  // async updateUserRole(obj){
  //   const resp = await this.http.post<any>(this.httpUrl + '/updateuserRole', obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }


  // authorization component
  async getAllResources(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/resource/getResources').toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async forAssignResources(obj) {

    const resp = await this.http.post<any>(this.main.httpUrl + '/administration/resource/createresources', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllAssignedResources(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/administration/resource/getxrefResources' + obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updateAssignedResource(obj) {
    const resp = await this.http.put<any>(this.main.httpUrl + '/administration/resource/updateresource', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

}