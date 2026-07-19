const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("cue", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  togglePin: (pinned) => ipcRenderer.send("window-toggle-pin", pinned),
  openExternal: (url) => ipcRenderer.send("open-external", url),
  openDashboard: () => ipcRenderer.send("open-dashboard"),
  onNavigate: (cb) => ipcRenderer.on("navigate", (_, page) => cb(page)),
  platform: process.platform,
});
