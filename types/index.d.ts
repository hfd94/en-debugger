declare module VnsDebug {
    export type TabsType = "get" | "post" | "websocket" | "socket"
    export interface Tabs {
        id: string
        title: string
        type: TabsType
    }


    export interface WorkItem {
        id: string
        title: string
        children?: WorkItem[]
        type?: TabsType,
    }
}