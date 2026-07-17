const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("cueDesktop", {
  platform: process.platform,
  isDesktopApp: true,
});
