declare global {
    var pm: {
        environment: VOController
        variables: VOController
    }

    interface Window {
        pm: {
            environment: VOController
            variables: VOController
        }
    }

    interface loadPanel {
        getConfig(): Promise<boolean>
    }

    interface Logger {
        level: number,
        time: string,
        value: string
    }

    interface WSLogger {
        direction: 0 | 1,
        time: string
        value: any
    }
    interface QuickCommand {
        parentId: string,
        name: string,
        command: string
    }

    type BeforFunc = (context: HttpConstructor, biu: () => void) => void
    type AfterFunc = (ctx: axios.AxiosResponse<any, any>) => void

    namespace PM {
        type Http = {
            headers: Record<string, any>,
            body: Record<string, any>,
            before?: BeforFunc
            afert?: AfterFunc
        }

        type WSock = {
            pbRoot(file: string): protobuf.Root | null
            lookupType(file: string, _type: string): protobuf.Type | null
        }

        type WSockHandler = {
            // 编码
            encode?: () => ArrayBuff | Uint8Array | string
            // 解码
            decode?: (msg: any) => void
        }
    }
}


export interface VOController {
    /**
     * 获取存放的对象
     *
     * @param {String} key - The name of the variable to get.
     * @returns {*} The value of the specified variable across scopes.
     */
    get(key: string): any
    set(key: string, val: any): void
    remove(key: string)
    clear()
}




class HttpConstructor {
    headers: Record<string, any>
    method: "get" | "post" | string
    url: string
    get axios(): axios.AxiosStatic
}