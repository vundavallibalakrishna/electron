import { app, BrowserWindow, screen, ipcMain } from 'electron';
// const { session } = require('electron');
// import { v4 as uuidv4 } from 'uuid';
// const log = require('electron-log');

import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;

// let authToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3c2NybUBhdmFuY2V1bmxpbWl0ZWQuY29tIiwiYXV0aCI6IlJPTEVfRE9XTkxPQUQsUk9MRV9KT0JfUFJPVklERVIsUk9MRV9URUFNX0NSRUFUT1IsUk9MRV9VU0VSIiwib2xkRW1haWxzIjoiIiwiZXhwIjoxNjAyMjQwNjY0fQ.cdBKh3vb5IfEdRrcQ6Ed_D3aazI-K03e58OddIH11m1osoPbfzyWtyAUZHfgDptzW2v3QX_OVpUyIH1IyZBjVQ";



const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');



const options = {
  type: 'question',
  buttons: ['ok'],
  defaultId: 2,
  title: 'Error',
  message: "hey",
  detail: "hey",
};


function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.

  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      webSecurity: false,
      enableRemoteModule: false // true if you want to use remote module in renderer context (ie. Angular)
    },
  });

  /*const urls = { "urls": ["*://*.wisestep.co/*", "*://*.wisestep.com/*"] };

  session.defaultSession.webRequest.onBeforeSendHeaders(urls, (details, callback) => {
    const token: string = uuidv4();
    details.requestHeaders['User-Agent'] = 'Ignite'
    details.requestHeaders['Cookie'] = 'SameSite=none; XSRF-TOKEN=' + token;
    details.requestHeaders['X-XSRF-TOKEN'] = token;
    callback({ requestHeaders: details.requestHeaders });
  });*/

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.webContents.openDevTools();
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947

  app.on('ready', () => setTimeout(createWindow, 400));


  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('open-url', function (event, data) {
    // authToken = data;
    event.preventDefault();
  });

  app.setAsDefaultProtocolClient('ignite');

  // module.exports.getLink = () => link;

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  /*ipcMain.on('select-dirs', async (event, _arg) => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    });
    console.log('directories selected', result);
    event.returnValue = result.filePaths;
  });

  ipcMain.on('get-auth-token', (event, arg) => {
    console.log('Returnung token ' + authToken);
    event.returnValue = authToken;
  })*/


} catch (e) {
}
