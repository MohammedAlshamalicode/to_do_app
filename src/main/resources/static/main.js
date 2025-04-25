const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile("index.html"); // واجهتك هنا
}

app.whenReady().then(createWindow);
