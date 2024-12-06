
import { UseWSSocket } from "@/stores/running/WSocket";
import { defineStore } from "pinia";
import { reactive, ref, type PropType } from "vue";

export const useRunningStore = defineStore("runningStore", () => {
    const openWScoket = reactive<Record<string, ReturnType<typeof UseWSSocket>>>({})

    const newTableData = (id: string, types: VnsDebug.TabsType): loadPanel => {
        if (types == "websocket") {
            const cls = UseWSSocket(id)
            openWScoket[id] = cls
            return cls
        } else {
            const cls = UseWSSocket(id)
            openWScoket[id] = cls
            return cls
        }
    }

    const removeTabData = (id: string, types: VnsDebug.TabsType) => {
        if (types == "websocket") {
            delete openWScoket[id]
        } else {

            delete openWScoket[id]
        }
    }

    return {
        openWScoket,
        newTableData,
        removeTabData
    }
})