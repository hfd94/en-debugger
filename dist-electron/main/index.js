"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_module = require("node:module");
const node_url = require("node:url");
const path$1 = require("node:path");
const os = require("node:os");
const path = require("path");
const sqlite3 = require("sqlite3");
const node_crypto = require("node:crypto");
var _documentCurrentScript =
  typeof document !== "undefined" ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: () => e[k],
              }
        );
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
      this.db.run(sql, values, function (err) {
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
      const entries = Object.entries(param.data)
        .map(([key, value]) => `${key} = ?`)
        .join(",");
      const params = Object.values(param.data);
      const sql = `UPDATE ${param.table} SET ${entries} WHERE ${param.condition}`;
      this.db.run(sql, params, function (err) {
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
      console.log(sql);
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
      sql: `
            CREATE TABLE IF NOT EXISTS work_menus ( id TEXT PRIMARY KEY, name TEXT NOT NULL, parentId TEXT, type TEXT );
            `,
    });
    await db.query({
      sql: `CREATE TABLE IF NOT EXISTS work_panel ( id TEXT PRIMARY KEY, url TEXT NOT NULL, type TEXT,  script TEXT );`,
    });
    await db.query({
      sql: `CREATE TABLE IF NOT EXISTS work_quick (id INTEGER PRIMARY KEY AUTOINCREMENT,parentId INTEGER,name TEXT,command TEXT)`,
    });
    await db.query({
      sql: `INSERT INTO work_menus (id, name) VALUES ('1b85da56-5fb6-4d6f-b9b5-295db5530882','测试存放');`,
    });
    await db.query({
      sql: `INSERT INTO work_menus (id, name) VALUES ('1b85da56-5fb6-4d6f-b9b5-295db5530881','演示二级目录');`,
    });
    await db.query({
      sql: `INSERT INTO work_menus (id, name,parentId) VALUES ('1b85da56-5fb6-4d6f-b9b5-295db5530880','二级目录','1b85da56-5fb6-4d6f-b9b5-295db5530881');`,
    });
    await db.query({
      sql: `INSERT INTO work_menus (id, name,parentId,type) VALUES ('1b85da56','WebSocket','1b85da56-5fb6-4d6f-b9b5-295db5530882','websocket');`,
    });
    await db.query({
      sql: `INSERT INTO work_menus (id, name,parentId,type) VALUES ('1b85da51','Http-Get','1b85da56-5fb6-4d6f-b9b5-295db5530882','get');`,
    });
    await db.query({
      sql: `INSERT INTO work_panel (id, url,type) VALUES ('1b85da56','ws://127.0.0.1:3000','websocket');`,
    });
    await db.query({
      sql: `INSERT INTO work_panel (id, url,type) VALUES ('1b85da51','http://www.baidu.com','get');`,
    });
    console.log("Database initialized.");
  } catch (err) {
    console.error("Error opening database:", err);
  }
};
const sqQuery = db.query.bind(db);
const sqInsert = db.insert.bind(db);
db.update.bind(db);
const sqDelete = db.delete.bind(db);
node_module.createRequire(
  typeof document === "undefined"
    ? require("url").pathToFileURL(__filename).href
    : (_documentCurrentScript &&
        _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" &&
        _documentCurrentScript.src) ||
        new URL("index.js", document.baseURI).href
);
const __dirname$1 = path$1.dirname(
  node_url.fileURLToPath(
    typeof document === "undefined"
      ? require("url").pathToFileURL(__filename).href
      : (_documentCurrentScript &&
          _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" &&
          _documentCurrentScript.src) ||
          new URL("index.js", document.baseURI).href
  )
);
const HexEditor = "hex-editor";
process.env.APP_ROOT = path$1.join(__dirname$1, "../..");
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path$1.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;
if (os.release().startsWith("6.1")) electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
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
      webSecurity: false,
      devTools: true,
      // nodeIntegration: true,
      // contextIsolation: true,
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null
      ? void 0
      : win.webContents.send(
          "main-process-message",
          /* @__PURE__ */ new Date().toLocaleString()
        );
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
const subWindows = {};
electron.ipcMain.handle("dialog:openFile", async (event) => {
  const result = await electron.dialog.showOpenDialog({
    title: "选择Proto文件",
    filters: [
      { name: "proto文件", extensions: ["proto"] },
      { name: "所有文件", extensions: ["*"] },
    ],
    properties: ["openFile", "multiSelections"],
  });
  return result.filePaths;
});
electron.ipcMain.handle("open-win", (_, arg) => {
  if (!Object.hasOwn(subWindows, arg)) {
    const childWindow = new electron.BrowserWindow({
      autoHideMenuBar: true,
      frame: false,
      parent: win,
      webPreferences: {
        preload,
        nodeIntegration: true,
        // 允许使用 Node.js 功能
        // contextIsolation: false // 确保渲染进程的 JS 可以访问 Node.js API
      },
    });
    if (VITE_DEV_SERVER_URL) {
      console.log(`${VITE_DEV_SERVER_URL}#${arg}`);
      childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
    } else {
      childWindow.loadFile(indexHtml, { hash: arg });
    }
    subWindows[arg] = childWindow;
  }
});
electron.ipcMain.handle("open-hex-editor", (_, args) => {
  let exist = subWindows[HexEditor];
  if (!exist) {
    const childWindow = new electron.BrowserWindow({
      autoHideMenuBar: true,
      frame: false,
      parent: win,
      webPreferences: {
        preload,
        nodeIntegration: true,
        // 允许使用 Node.js 功能
        // contextIsolation: false // 确保渲染进程的 JS 可以访问 Node.js API
      },
    });
    if (VITE_DEV_SERVER_URL) {
      console.log(`${VITE_DEV_SERVER_URL}#hex-editor`);
      childWindow.loadURL(`${VITE_DEV_SERVER_URL}#hex-editor`);
    } else {
      childWindow.loadFile(indexHtml, { hash: "hex-editor" });
    }
    subWindows[HexEditor] = childWindow;
    exist = childWindow;
    exist.webContents.on("did-finish-load", () => {
      exist.webContents.send("data-from-main", { key: args });
    });
  } else {
    exist.webContents.send("data-from-main", { key: args });
  }
});
electron.ipcMain.on("window-min", function () {
  if (win) {
    win.minimize();
  }
});
electron.ipcMain.on("window-max", function () {
  if (!win) {
    return;
  }
  if (win.isMaximized()) {
    win.restore();
  } else {
    win.maximize();
  }
});
electron.ipcMain.on("window-close", (event, ...args) => {
  console.log(args);
  if (args[0]) {
    if (Object.hasOwn(subWindows, args[0])) {
      subWindows[args[0]].close();
      delete subWindows[args[0]];
    }
  } else {
    if (!win) {
      return;
    }
    if (process.platform !== "darwin") electron.app.quit();
  }
});
electron.ipcMain.handle("insert-menu-folder", async (_, data) => {
  data.id = node_crypto.randomUUID();
  let url = "";
  if (data.type) {
    url = data.url;
    delete data.url;
  }
  await sqInsert({ table: "work_menus", data });
  if (data.type) {
    await sqInsert({
      table: "work_panel",
      data: {
        id: data.id,
        url,
        type: data.type,
      },
    });
  }
});
const buildMenuTree = (menus) => {
  const map = /* @__PURE__ */ new Map();
  const roots = [];
  menus.forEach((menu) => {
    map.set(menu.id, {
      id: menu.id,
      title: menu.name,
      type: menu.type,
      children: menu.type === null ? [] : null,
    });
  });
  menus.forEach((menu) => {
    const menuItem = map.get(menu.id);
    if (menu.parentId) {
      const parentItem = map.get(menu.parentId);
      if (parentItem.children !== null) {
        parentItem.children.push(menuItem);
      }
    } else {
      roots.push(menuItem);
    }
  });
  return roots;
};
electron.ipcMain.handle("get-work-menus", async (_, data) => {
  const ret = await sqQuery({ sql: `SELECT * FROM work_menus;` });
  const result = buildMenuTree(ret);
  return result;
});
electron.ipcMain.handle("delete-menu", async (_, data) => {
  const strs = [];
  data.tab.forEach((v) => {
    strs.push(`'${v}'`);
  });
  await sqDelete({
    table: "work_menus",
    condition: `id in (${strs.join(",")})`,
  });
  if (data.page.length > 0) {
    strs.length = 0;
    data.page.forEach((v) => {
      strs.push(`'${v}'`);
    });
    await sqDelete({
      table: "work_panel",
      condition: `id in (${strs.join(",")})`,
    });
  }
});
electron.ipcMain.handle("get-panel-info", async (_, data) => {
  const sql = `SELECT * FROM work_panel where id = '${data.id}';`;
  const ret = await sqQuery({ sql });
  return ret;
});
electron.ipcMain.handle("get-quick-info", async (_, data) => {
  const sql = `SELECT * FROM work_quick where parentId = '${data.id}';`;
  const ret = await sqQuery({ sql });
  return ret;
});
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
//# sourceMappingURL=index.js.map
