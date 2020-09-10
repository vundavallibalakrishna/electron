import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { shell } from 'electron';
import { WorkpaceService } from './workspace.service'
import { Principal } from 'app/core';
import { AccountService } from 'app/core/auth/account.service';
import { takeUntil } from 'rxjs/operators';
import { SERVER_API_URL } from 'app/app.constants'
import { IWorkspace } from "app/shared/models/workspace.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  account?: Account | null;
  authenticated: any;
  currentUserWorkspaces: IWorkspace[];
  subscription?: Subscription;
  unsubscribe$ = new Subject();
  done = false;

  constructor(
    private accountService: AccountService,
    private workspaceService: WorkpaceService,
    private principal: Principal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.accountService
      .identity()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(account => {
        this.account = account;
        if (!account || !this.isAuthenticated()) {
          this.login();
        } else {
          this.loadWorkspaces();
        }
        this.done = true;
      });
  }

  login(): void {

  }

  loadWorkspaces(): void {
    this.workspaceService.loadUserWorkspaces().subscribe(res => {
      this.currentUserWorkspaces = res.body;
    });
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  openLoginWindow(): void {
    shell.openExternal("http://www.myhost.com:8081/#/login?app=ignite");
  }

  async selectWorkspace(workspace: IWorkspace): Promise<number> {
    window.localStorage.setItem("workspaceURL", SERVER_API_URL.replace("recruiter", workspace.link));
    await this.workspaceService.authenticateCurrentWorkspace().toPromise();
    this.router.navigate(['bulk-upload']);
    return Promise.resolve(1);
  }

}
