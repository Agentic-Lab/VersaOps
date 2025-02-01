const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  initSession: () => ipcRenderer.invoke('init-session'),
  getSdpResponse: (clientSecret, offer) => ipcRenderer.invoke('get-sdp-response', clientSecret, offer)
  // we can also expose variables, not just functions
})
