import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { initSqlite, sqDelete, sqInsert, sqQuery } from './sqlite'
import { randomUUID } from 'node:crypto'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const HexEditor = "hex-editor"

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.js')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
    win = new BrowserWindow({
        title: 'Main window',
        autoHideMenuBar: true,
        icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
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
    })

    if (VITE_DEV_SERVER_URL) { // #298
        win.loadURL(VITE_DEV_SERVER_URL)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
    // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(async () => {
    await initSqlite();
    createWindow();
})

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})
const subWindows: Record<string, BrowserWindow> = {}

ipcMain.handle('dialog:openFile', async (event) => {
    const result = await dialog.showOpenDialog({
        title: '选择Proto文件',
        filters: [
            { name: 'proto文件', extensions: ['proto'] },
            { name: '所有文件', extensions: ['*'] },
        ],
        properties: ['openFile', 'multiSelections']
    });

    return result.filePaths; // 返回选中的文件路径
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    if (!Object.hasOwn(subWindows, arg)) {
        const childWindow = new BrowserWindow({
            autoHideMenuBar: true,
            frame: false,
            parent: win!,
            webPreferences: {
                preload,
                nodeIntegration: true,   // 允许使用 Node.js 功能
                // contextIsolation: false // 确保渲染进程的 JS 可以访问 Node.js API
            },
        })

        if (VITE_DEV_SERVER_URL) {
            console.log(`${VITE_DEV_SERVER_URL}#${arg}`)
            childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
        } else {
            childWindow.loadFile(indexHtml, { hash: arg })
        }
        subWindows[arg] = childWindow
    }

})

// 如果没有打开HexEditor窗口则打开, 如果打开了则传数据
ipcMain.handle("open-hex-editor", (_, args) => {
    let exist = subWindows[HexEditor]
    if (!exist) {
        const childWindow = new BrowserWindow({
            autoHideMenuBar: true,
            frame: false,
            parent: win!,
            webPreferences: {
                preload,
                nodeIntegration: true,   // 允许使用 Node.js 功能
                // contextIsolation: false // 确保渲染进程的 JS 可以访问 Node.js API
            },
        })

        if (VITE_DEV_SERVER_URL) {
            console.log(`${VITE_DEV_SERVER_URL}#hex-editor`)
            childWindow.loadURL(`${VITE_DEV_SERVER_URL}#hex-editor`)
        } else {
            childWindow.loadFile(indexHtml, { hash: "hex-editor" })
        }
        subWindows[HexEditor] = childWindow
        exist = childWindow
        exist.webContents.on('did-finish-load', () => {
            // 通过子窗口的 `webContents.send` 向子窗口发送数据
            exist.webContents.send('data-from-main', { key: args });
        });
    } else {
        exist.webContents.send('data-from-main', { key: args });
    }

})

ipcMain.on('window-min', function () {
    if (win) {
        win.minimize();
    }
})

ipcMain.on('window-max', function () {
    if (!win) { return }
    if (win.isMaximized()) {
        win.restore();
    } else {
        win.maximize();
    }
})
ipcMain.on('window-close', (event: any, ...args) => {
    console.log(args)
    if (args[0]) {
        if (Object.hasOwn(subWindows, args[0])) {
            subWindows[args[0]].close()
            delete (subWindows[args[0]])
        }
    } else {
        if (!win) { return }
        if (process.platform !== 'darwin') app.quit()
    }
})


ipcMain.handle("insert-menu-folder", async (_, data) => {
    data.id = randomUUID()
    let url = ""
    if (data.type) {
        url = data.url
        delete (data.url)
    }
    await sqInsert({ table: "work_menus", data })
    if (data.type) {
        await sqInsert({
            table: "work_panel", data: {
                id: data.id,
                url: url,
                type: data.type,
            }
        })
    }

})
interface Menu {
    id: string,
    name: string
    parentId?: string
    type?: string
    configure?: string
}
const buildMenuTree = (menus: Menu[]) => {
    const map = new Map();
    const roots: any[] = [];

    // 初始化每个菜单项
    menus.forEach(menu => {
        // 为每个菜单项创建一个新对象（避免修改原始数据）
        map.set(menu.id, { id: menu.id, title: menu.name, type: menu.type, children: menu.type === null ? [] : null });
    });

    // 构建层级关系
    menus.forEach(menu => {
        const menuItem = map.get(menu.id);
        if (menu.parentId) {
            // 如果有父节点，将当前节点添加到父节点的 children 中
            const parentItem = map.get(menu.parentId);
            if (parentItem.children !== null) {
                parentItem.children.push(menuItem);
            }
        } else {
            // 如果没有父节点，说明是顶级菜单
            roots.push(menuItem);
        }
    });

    return roots;
};
ipcMain.handle("get-work-menus", async (_, data) => {
    const ret: Array<Menu> = await sqQuery({ sql: `SELECT * FROM work_menus;` })
    const result = buildMenuTree(ret)
    return result
})


ipcMain.handle("delete-menu", async (_, data: { tab: string[], page: string[] }) => {
    const strs: string[] = []
    data.tab.forEach(v => {
        strs.push(`'${v}'`)
    })
    await sqDelete({ table: "work_menus", condition: `id in (${strs.join(',')})` })

    if (data.page.length > 0) {
        strs.length = 0
        data.page.forEach(v => {
            strs.push(`'${v}'`)
        })
        await sqDelete({ table: "work_panel", condition: `id in (${strs.join(',')})` })
    }
})

ipcMain.handle('get-panel-info', async (_, data: { id: string }) => {
    const sql = `SELECT * FROM work_panel where id = '${data.id}';`
    const ret: Array<Menu> = await sqQuery({ sql })
    return ret
})

ipcMain.handle('get-quick-info', async (_, data: { id: string }) => {
    const sql = `SELECT * FROM work_quick where parentId = '${data.id}';`
    const ret: Array<Menu> = await sqQuery({ sql })
    return ret
})