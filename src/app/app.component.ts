import { AfterViewInit, Component, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { AuthenticationService } from "./authentication.service"
import { Helpers } from "./helpers";
import { SecurityService } from "910-shared-ngx/dist/security";

@Injectable()
@Component({
	selector: 'body',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit, AfterViewInit {
	title = 'app';
	constructor(private _router: Router, private AuthenticationService: AuthenticationService, private securitySVC: SecurityService) {
		this.getSystemModule();
		this.getAllLanguage();
		this.getAllLabel();
	}

	async ngOnInit() {
		// this.securitySVC.isAuthenticated();
		if (localStorage.getItem('erpUser') == undefined || localStorage.getItem('erpUser') == null) {
			this._router.navigate(['/login']);
		} else {
			var erpUser = JSON.parse(localStorage.getItem('erpUser'));
			if (erpUser['b_acct_id'] == 0) {
				this._router.navigate(['./solution-admin/index']);
			} else {
				this._router.navigate(['./index']);
			}
		}
		this._router.events.subscribe((route) => {
			if (route instanceof NavigationStart) {
				Helpers.setLoading(true);
				Helpers.bodyClass('fixed-navbar');
			}
			if (route instanceof NavigationEnd) {
				window.scrollTo(0, 0);
				Helpers.setLoading(false);

				// Initialize page: handlers ...
				Helpers.initPage();
			}

		});		
	}


	allLanguage = []
	async getAllLanguage() {
		var obj = new Object();
		var resp = await this.AuthenticationService.getAllLanguages(JSON.stringify(obj));
		if (resp['error'] == false) {
			this.AuthenticationService.allLanguage = resp.data;
			this.AuthenticationService.language_cd = resp.data[0]['language_cd']
		} else {

		}
	}

	async getSystemModule() {
		var obj = new Object();
		obj['b_acct_id'] = 0;
		var resp = await this.AuthenticationService.getModules(JSON.stringify(obj));
		if (resp['error'] == false) {
			var obj = new Object();
			for (let i = 0; i < resp.data.length; i++) {
				obj[resp.data[i]['module_cd']] = resp.data[i]['module_name']
			}
			this.AuthenticationService.allSystemModuleObj = obj;

		} else {

		}
	}
	allLabel = []
	async getAllLabel() {
		var obj = new Object();

		var resp = await this.AuthenticationService.getcomponentLabelvalueswithLanguage(JSON.stringify(obj));
		if (resp['error'] == false) {
			this.AuthenticationService.allLabel = resp.data;
			var obj = new Object();
			for (let i = 0; i < resp.data.length; i++) {
				obj[resp.data[i]['language_cd'] + resp.data[i]['component_cd'] + resp.data[i]['label_no']] = resp.data[i]['value_to_show'];
			}
			this.AuthenticationService.allLableShowObj = obj;

		} else {

		}
	}

	async ngAfterViewInit() {

	}


}
