"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_module = require("node:module");
const node_url = require("node:url");
const path$1 = require("node:path");
const os = require("node:os");
const path = require("path");
const sqlite3 = require("sqlite3");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const sqlite3__namespace = /* @__PURE__ */ _interopNamespaceDefault(sqlite3);
const userDataPath = electron.app.getPath("userData");
console.log(userDataPath);
const dbPath = path__namespace.join(userDataPath, "Storage.bin");
console.log("Database path:", dbPath);
class Database {
  constructor() {
    __publicField(this, "db");
    this.db = new sqlite3__namespace.Database(dbPath);
  }
  open() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("PRAGMA foreign_keys = ON");
        console.log("Connected to the database.");
        resolve();
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Database closed.");
          resolve();
        }
      });
    });
  }
  query(param) {
    return new Promise((resolve, reject) => {
      this.db.all(param.sql, param.params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  insert(param) {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(param.data);
      const values = Object.values(param.data);
      const placeholders = keys.map(() => "?").join(",");
      const sql = `INSERT INTO ${param.table} (${keys.join(
        ","
      )}) VALUES (${placeholders})`;
      this.db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
  update(param) {
    return new Promise((resolve, reject) => {
      const entries = Object.entries(param.data).map(([key, value]) => `${key} = ?`).join(",");
      const params = Object.values(param.data);
      const sql = `UPDATE ${param.table} SET ${entries} WHERE ${param.condition}`;
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
  delete(param) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${param.table} WHERE ${param.condition}`;
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
const db = new Database();
const initSqlite = async () => {
  try {
    await db.open();
    await db.query({
      sql: `CREATE TABLE tree (
                    id TEXT PRIMARY KEY,       -- 节点的唯一标识符（字符串）
                    name TEXT NOT NULL,        -- 节点名称
                    parentId TEXT,             -- 父节点 ID，如果是根节点，则为 NULL
                    type TEXT,                 -- 节点类型（可选）
                    configure TEXT,            -- 配置
                    FOREIGN KEY (parentId) REFERENCES tree(id) -- 外键约束，确保 parentId 是有效的 id
                );`
    });
    console.log("Database initialized.");
  } catch (err) {
    console.error("Error opening database:", err);
  }
};
db.query.bind(db);
db.insert.bind(db);
db.update.bind(db);
db.delete.bind(db);
node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("index.js", document.baseURI).href);
const __dirname$1 = path$1.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("index.js", document.baseURI).href));
process.env.APP_ROOT = path$1.join(__dirname$1, "../..");
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
if (os.release().startsWith("6.1")) electron.app.disableHardwareAcceleration();
if (process.platform === "win32") electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
const preload = path$1.join(__dirname$1, "../preload/index.js");
const indexHtml = path$1.join(RENDERER_DIST, "index.html");
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Main window",
    autoHideMenuBar: true,
    icon: path$1.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 1120,
    height: 720,
    minWidth: 1120,
    minHeight: 720,
    frame: false,
    webPreferences: {
      devTools: true,
      // nodeIntegration: true,
      // contextIsolation: true,
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) electron.shell.openExternal(url);
    return { action: "deny" };
  });
}
electron.app.whenReady().then(async () => {
  await initSqlite();
  createWindow();
});
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
electron.ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new electron.BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
electron.ipcMain.on("window-min", function() {
  if (win) {
    win.minimize();
  }
});
electron.ipcMain.on("window-max", function() {
  if (!win) {
    return;
  }
  if (win.isMaximized()) {
    win.restore();
  } else {
    win.maximize();
  }
});
electron.ipcMain.on("window-close", function() {
  if (!win) {
    return;
  }
  win.close();
});
electron.ipcMain.handle("insetWorkDir", (_, args) => {
  console.log(args);
  return "hello world";
});
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
//# sourceMappingURL=index.js.map
