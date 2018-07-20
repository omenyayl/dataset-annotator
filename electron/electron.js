'use strict';
const electron = require('electron');
const globalShortcut = electron.globalShortcut;
const {autoUpdater} = require("electron-updater");
const dialog = require('electron').dialog;
const {ipcMain} = require('electron');

// Module to control application life.
const {
    app
} = electron;
// Module to create native browser window.
const {
    BrowserWindow
} = electron;
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1024,
        height: 720,
        minWidth: 820,
        minHeight: 600
    });
    let url = 'file://' + __dirname + '/../www/index.html';
    let Args = process.argv.slice(2);
    Args.forEach(function (val) {
        if (val === "test") {
            url = 'http://localhost:8100'
        }
    });
    // and load the index.html of the app.
    win.loadURL(url);
    // Open the DevTools.
    // win.webContents.openDevTools();
    // Emitted when the window is closed.

    global.shared = {hasUnsavedChanges: false};

    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    globalShortcut.register('CommandOrControl+r', function () {
    });

    globalShortcut.register('CommandOrControl+Shift+r', function () {
        console.log('CommandOrControl+Shift+r is pressed');
        win.reload()
    });

    ipcMain.on('close', () => {
        app.exit();
    });

    win.on('close', async (e) => {
        if (global.shared.hasUnsavedChanges){
            e.preventDefault();
            let button_id = await showSaveDialog();
            switch(button_id) {
                case 0:
                    app.exit();
                    break;
                case 1:
                    break;
                case 2:
                    win.webContents.send('saveAnnotations');
                    break;
            }
        }
    });


    autoUpdater.checkForUpdatesAndNotify();
}

function showSaveDialog() {
    return new Promise((resolve) => {
        dialog.showMessageBox({
            type: 'warning',
            buttons: ["Don't Save", "Cancel", "Save"],
            defaultId: 2,
            title: "You have unsaved annotations",
            message: "Do you want to save your changes?",
            detail: "Your changes will be lost if you don't save them.",
            cancelId: 1,
        }, (button_id) => {
            resolve(button_id);
        });
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {

    app.quit();

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
    // }
});
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});


// ipcMain.on('close', (event, hasUnsavedChanges) => {
//     if(hasUnsavedChanges) {
//         win.on('close', (e) => {
//             e.preventDefault();
//             dialog.showMessageBox({
//                 type: 'warning',
//                 buttons: ["Don't Save", "Cancel", "Save"],
//                 defaultId: 2,
//                 title: "You have unsaved annotations",
//                 message: "Do you want to save your changes?",
//                 detail: "Your changes will be lost if you don't save them.",
//                 cancelId: 1,
//             }, (button_id) => {
//                 switch (button_id) {
//                     case 0:
//                         app.quit();
//                         break;
//                     case 1:
//                         app.quit();
//
//                         break;
//                     case 2:
//                         app.quit();
//
//                         break;
//                 }
//             })
//         });
//     }
// });