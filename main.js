const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { initSession, getSdpResponse } = require('./realtime.js')

const createWindow = () => {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1024,
    height: 768,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('init-session', initSession)
ipcMain.handle('get-sdp-response', getSdpResponse)
