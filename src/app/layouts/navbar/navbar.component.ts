import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Principal } from 'app/core';
import { AccountService } from 'app/core/auth/account.service';


@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.css']
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    version: string;

    constructor(
        private principal: Principal,
        private router: Router,
        private accountService: AccountService,
    ) {
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
    }

    isAuthenticated(): boolean {
        return this.accountService.isAuthenticated();
    }

    async logout() {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("workspaceURL");
        window.localStorage.removeItem("workspaceToken");
        await this.accountService.identity(true).toPromise();
        this.router.navigate(['/home']);
    }
}
