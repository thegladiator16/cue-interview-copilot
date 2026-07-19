const { app, BrowserWindow, shell, Menu, Tray, nativeImage, ipcMain, screen } = require("electron");
const path = require("path");

const APP_URL = "https://cue-interview-copilot.vercel.app";
const isDev = !app.isPackaged;

let mainWindow = null;
let tray = null;

function createWindow() {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 420,
    height: 700,
    minWidth: 380,
    minHeight: 500,
    maxWidth: 500,
    x: screenW - 440,
    y: 20,
    title: "Cue",
    icon: path.join(__dirname, "icon.png"),
    frame: false,
    transparent: false,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: "#ffffff",
    roundedCorners: true,
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, "overlay.html"));

  mainWindow.once("ready-to-show", () => {
    mainWindow.setAlwaysOnTop(true, "floating");
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("close", (e) => {
    if (process.platform === "darwin") {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  Menu.setApplicationMenu(null);
}

function createTray() {
  const iconPath = path.join(__dirname, "tray-icon.png");
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip("Cue — Interview Copilot");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Cue",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: "New Session",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send("navigate", "create");
        }
      },
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on("window-close", () => mainWindow?.hide());
ipcMain.on("window-toggle-pin", (_, pinned) => {
  mainWindow?.setAlwaysOnTop(pinned, "floating");
});
ipcMain.on("open-external", (_, url) => {
  shell.openExternal(url);
});
ipcMain.on("open-dashboard", () => {
  shell.openExternal(`${APP_URL}/dashboard`);
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (mainWindow) mainWindow.show();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  mainWindow?.removeAllListeners("close");
});
