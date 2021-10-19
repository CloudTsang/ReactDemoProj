global.electron = require('electron');
window.remote = require('electron').remote;
window.shell = require('electron').shell;
require('electron').webFrame.setLayoutZoomLevelLimits(1, 1);
require('electron').webFrame.setLayoutZoomLevelLimits(0, 0);

const { ipcRenderer: ipc } = require('electron');
const os = require('os');


const { promisify } = require('util')

const path = require('path');
const fs = require('fs');
const { protocol, app } = require('electron');
const process = require('process');
const { remote } = require('electron');



//@ts-ignore
const p = require("../package.json");

window.ipc = ipc;
window.path = path;
window.fs = fs;
window.protocol = protocol;
window.app = app;
window.apppath = process.cwd();
window.remote = remote;
window.osname = os.release();
window.appname = p.name
window.appver = p.version
window.netRemote = p.isremote
window.appid = p.appid
window.devtest = true

const AdmZip = require('adm-zip');


window.ipc.on('appPath', (event, args) => {
    const appPath = args[0];
    const logPath = path.join(appPath, `log`, `demo.log`)
    const dstPath = path.join(appPath, `log`, `demo.log.zip`)
    window.dstPath = dstPath;
    window.logPath = logPath;
})

window.ipc.on('onWindowsId', (event, args) => {
    console.log('onWindowsId :', args)
    window.windowId = args[0]
})

const doGzip = async() => {
    const zip = new AdmZip();
    console.log("log path : ", window.logPath, window.dstPath)
    try {
        zip.addLocalFile(window.logPath)
    } catch (err) {
        console.error(err)
        fs.writeFileSync(window.logPath, "")
    }

    zip.writeZip(window.dstPath)
    return promisify(fs.readFile)(window.dstPath)
}

window.doGzip = doGzip;