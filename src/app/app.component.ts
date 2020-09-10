import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
const { ipcRenderer } = require('electron');
import { Principal } from 'app/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private principal: Principal,
  ) {
    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);
    const token: string = ipcRenderer.sendSync('get-auth-token');
    window.localStorage.setItem("token", token);
    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
    principal.identity(true);
  }
}
