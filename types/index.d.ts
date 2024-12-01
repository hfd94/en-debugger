declare module VnsDebug {

    export type TabsType = "get" | "post" | "websocket" | "socket"
    export interface Tabs {
        name: string
        type: TabsType
        id: string
    }


    export interface WorkItem {
        id?: string
        title: string
        children?: WorkItem[]
        type?: TabsType,
    }

}