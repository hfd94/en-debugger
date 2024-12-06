import { axios } from "./initAxios"
import { http } from "./http"
import { protobuf } from "./protobuf"
import { byteBuffer } from "./byteBuffer"
export const global = ` 
declare global {
    var pm: {
        environment: VOController
        variables: VOController
    } 
    ${axios}
    ${protobuf}
    ${byteBuffer}
    interface Window {
        pm: {
            environment: VOController
            variables: VOController
        }
    }  
    
    type BeforFunc = (context: HttpConstructor, biu: () => void) => void
    type AfterFunc = (ctx: axios.AxiosResponse<any, any>) => void

    namespace PM { 
        type WSock = {
            pbRoot(file: string): protobuf.Root | null

            lookupType(file: string, _type: string): protobuf.Type | null

            /** 
             * 设置一个变量,非全局
             */
            setVar(name: string, val: any): void,
 
            /**
             * 获得一个存储的变量,非全局
             */
            getVar(name: string): any | undefined,

            /**
             * 打印日志
             */
            log(...args:[]any): void
        }

        type WSockHandler = {
            // 编码
            encode?: () => ArrayBuff | Uint8Array | string
            // 解码
            decode?: (msg: any) => void
        }
    }

    ${http}
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
`