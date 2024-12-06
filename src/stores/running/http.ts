import axios from "axios"

export class Http {
    // private _eval: PM.Http = null!
    headers: Record<string, any> = {}
    private _after: AfterFunc | undefined = null!
    private _before: BeforFunc | undefined = null!
    public method: "get" | "post" = "get"
    url: string = ''
    private _axios: axios.AxiosInstance = null!
    body: Record<string, any> = {}

    constructor() {
        this._axios = axios.create({})
    }

    public get axios(): axios.AxiosInstance { return this.axios }

    // 准备数据 等待发送
    readySend(url: string, method: "get" | "post", code: string) {
        let ev = eval(code)
        if (typeof ev == "function") {
            let ret: PM.Http = ev()

            if (ret.headers) {
                this.headers = ret.headers
            }
            this.body = ret.body
            this._after = ret.afert
            this._before = ret.before
        }
        this.method = method
        this.url = url
        if (this._before) {
            this._before(this, () => { this.send() })
        }
    }



    public send() {
        this._axios[this.method](this.url, {
            headers: this.headers,
            data: this.body
        }).then(resp => {
            if (this._after) {
                this._after(resp)
            }
            this.requestComplate(resp)
        })
    }


    public requestComplate(resp: axios.AxiosResponse) {
        console.log("123123", resp)
    }
}