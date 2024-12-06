import ts from "typescript"
import { ref } from "vue"
import * as protobuf from "protobufjs";
// import { dialog, ipcMain } from "electron";
import { basename } from 'path-browserify';
import { ByteBuffer, formatData } from "@/utils";
import * as monaco from "monaco-editor"; // 全部导入



export const UseWSSocket = (id: string) => {
    const panel_id = id

    const url = ref("")
    let wsClient: WebSocket = null!
    let hookSend: (data: any) => any = null!
    let hookMessage: (data: any) => any = null!

    let protpFiles: Record<string, { path: string, root: protobuf.Root }> = {}
    const variable: Record<string, any> = {}    // 内部变量容器
    const loggers = ref<Array<Logger>>([])      // 普通日志消息
    const wsLoggers = ref<WSLogger[]>([])       // 发送日志消息
    const isConnected = ref(false)              // ws连接状态
    const quickCmds = ref<QuickCommand[]>([])   // 快捷命令


    // {id: 2, parentId: 'dfaf7e0c-270b-4f39-8922-f549a47d2b30', name: '获取用户请求', command: '{}'}
    let userScript: monaco.editor.IStandaloneCodeEditor = null!
    let commandScript: monaco.editor.IStandaloneCodeEditor = null!
    const commandScriptText = ref("")

    let dbScript = ""

    const setScriptElement = (val: any) => {
        userScript = val
        userScript.setValue(dbScript)
    }

    const setCommandElement = (val: any) => {
        commandScript = val
    }

    const onDidCommandValue = (v: string) => {
        commandScriptText.value = v
    }

    const onResetCommandValue = (val: string) => {
        commandScript.setValue(val)
    }

    function input(leval: number, text: any) {
        if (typeof text != "string") {
            text = JSON.stringify(text)
        }
        const time = formatData(new Date, "yyyy-MM-dd hh:mm:ss")
        loggers.value.push({ level: leval, time, value: text })
    }
    // 暴露给用户的方法
    const exports = {
        pbRoot(file: string): protobuf.Root | null {
            const messages = protpFiles[file]
            if (!messages) { return null }
            return messages.root
        },
        lookupType(file: string, _type: string): protobuf.Type | null {
            const messages = protpFiles[file]
            if (!messages) { return null }
            return messages.root.lookupType(_type)
        },
        //设置变量
        setVar(name: string, val: any) {
            variable[name] = val
        },
        getVar(name: string): any | undefined {
            return variable[name]
        },
        log: (value: any) => { input(0, value) },
        warn: (value: any) => { input(1, value) },
        err: (value: any) => { input(2, value) },
        ByteBuffer
    }

    const LoadProtobuf = async () => {
        const filePaths = await window.ipcRenderer.invoke('dialog:openFile');
        for (let i = 0; i < filePaths.length; i++) {
            let p: string = filePaths[i]
            protobuf.load(p, (err, root) => {
                p = (p as any).replaceAll("\\", "/")
                const name = basename(p).split(".")[0]
                protpFiles[name] = {
                    path: p,
                    root: root!
                }
            })
        }
    }

    const SetUserScriptCode = (code: string) => {
        code = ts.transpile(code)
        try {
            const fn = eval(code) as Function
            if (typeof fn != "function") { return }
            const ret: PM.WSockHandler = fn.bind(exports)(exports)
            if (!ret) {
                return
            }
            if (!!ret.encode) {
                hookSend = ret.encode
            }
            if (!!ret.decode) {
                hookMessage = ret.decode
            }
        } catch (e) { }
    }

    const Connected = () => {
        wsClient = new WebSocket(url.value)
        wsClient.binaryType = "arraybuffer"
        wsClient.onclose = onClose
        wsClient.onopen = onConnected
        wsClient.onmessage = onMessage
        wsClient.onerror = onClose
    }

    const onClose = () => {
        const date = formatData(new Date, "hh:mm:ss.S")
        isConnected.value = false
        wsLoggers.value.push({
            direction: 1,
            time: date,
            value: 'Closed'
        })
    }

    const onConnected = () => {
        const date = formatData(new Date, "hh:mm:ss.S")
        isConnected.value = true
        wsLoggers.value.push({
            direction: 0,
            time: date,
            value: 'Connected Success'
        })
    }

    const onMessage = (evt: { data: any }) => {
        if (!!hookMessage) {
            evt = hookMessage(evt)
        }
        console.log(evt)
        const date = formatData(new Date, "hh:mm:ss.S")
        //打印日志
        wsLoggers.value.push({
            direction: 1,
            time: date,
            value: evt.data
        })
    }

    const onSendMessage = (data: any) => {
        if (wsClient.readyState != 1) { return }
        if (!!hookSend) {
            data = hookSend(data)
        }
        const date = formatData(new Date, "hh:mm:ss.S")

        wsLoggers.value.push({
            direction: 0,
            time: date,
            value: data
        })
        wsClient.send(data)
    }

    const Closed = () => {
        if (wsClient.readyState == 1) {
            wsClient.close()
        }
    }

    const onClearWsLogger = () => {
        wsLoggers.value.length = 0
    }

    const onClearLogger = () => {
        loggers.value.length = 0
    }


    const SaveConfigure = () => {
    }


    const getConfig = async () => {
        const quickCommand: QuickCommand[] = await window.ipcRenderer.invoke("get-quick-info", { id: panel_id })
        for (let i = 0; i < quickCommand.length; i++) {
            const ele = quickCommand[i]
            quickCmds.value.push(ele)
        }
        const runSc = await window.ipcRenderer.invoke("get-panel-info", { id: panel_id })
        if (runSc.length == 0) {
            return false
        }
        dbScript = runSc[0].script
        url.value = runSc[0].url
        return true
    }

    return {
        commandScriptText,
        quickCmds,
        wsLoggers,
        loggers,
        isConnected,
        url,
        SetUserScriptCode,
        Connected,
        LoadProtobuf,
        onSendMessage,
        Closed,
        onClearWsLogger,
        onClearLogger,
        getConfig,
        setScriptElement,
        setCommandElement,
        onDidCommandValue,
        onResetCommandValue
    }
}
