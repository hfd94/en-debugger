export const http = `
declare class HttpConstructor {
    headers:Record<string, any>
    get axios(): axios.AxiosInstance
    method: "get" | "post" 
}
`