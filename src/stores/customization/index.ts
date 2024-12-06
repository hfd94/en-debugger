import { defineStore } from "pinia";
import { markRaw, nextTick, reactive, ref, toRaw, type Component } from "vue";

import WorkSpace from "@/layout/Navigation/components/WorkSpace.vue";
import Environment from "@/layout/Navigation/components/Environment.vue"
import Toolbox from "@/layout/Navigation/components/Toolbox.vue"
import { useRunningStore } from "@/stores/running";
import { useApplication } from "@/stores/application";



export const useCustomization = defineStore("customization", () => {
    const running = useRunningStore()
    const app = useApplication()

    const openTabs = ref<Array<VnsDebug.Tabs>>([])
    const activeTab = reactive({
        index: ""
    })
    const workDatas = ref<VnsDebug.WorkItem[]>([]);
    const state = reactive<{
        expanded: boolean,
        component: Component | undefined
    }>({
        expanded: false,
        component: undefined
    })

    const menus = [
        { name: "work", icon: "mdi-dots-grid", tooltip: "工作台(F1)", component: markRaw(WorkSpace) },
        { name: "variable", icon: "mdi-variable", tooltip: "环境变量(F2)", component: markRaw(Environment) },
        { name: "protobuf", icon: 'mdi-package-variant', tooltip: "PB设置(F4)", component: markRaw(Toolbox) },
        { name: "tools", icon: "mdi-tools", tooltip: "工具箱(F3)", component: markRaw(Toolbox) },
    ]


    const onSelectNav = (val: any) => {
        Object.assign(state, {
            expanded: val != undefined,
            component: val != undefined ? menus[val].component : state.component,
        })
    }

    const onChangeTab = (args: any) => {
        activeTab.index = args
        console.log(activeTab.index)
    }

    const onOpenTabs = async (item: VnsDebug.WorkItem) => {
        const ret = openTabs.value.find((v) => {
            return v.title == item.title
        })
        if (!ret) {
            app.show()
            const panel = running.newTableData(item.id, item.type!)
            const ret = await panel.getConfig()
            if (ret) {
                openTabs.value.push({
                    title: item.title,
                    type: item.type!,
                    id: item.id
                })
                nextTick(() => {
                    activeTab.index = item.id
                })
            } else {
                running.removeTabData(item.id, item.type!)
            }

            app.hide()
        } else {
            activeTab.index = ret.id
        }
    }

    const onCloseTabById = (id: string) => {
        const index = openTabs.value.findIndex(v => {
            return v.id == id
        })
        if (index != -1) {
            const ele = openTabs.value.splice(index, 1)

            if (ele[0].id == activeTab.index) {
                if (openTabs.value.length > 0) {
                    if (openTabs.value[index]) {
                        nextTick(() => {
                            activeTab.index = toRaw(openTabs.value[index].id)
                        })
                    } else {
                        const len = openTabs.value.length
                        nextTick(() => {
                            activeTab.index = toRaw(openTabs.value[len - 1].id)
                        })

                    }
                }
            }
        }
    }

    // 被删除的页面
    const onDeleteMenu = (pages: string[]) => {
        for (let i = 0; i < pages.length; i++) {
            const index = openTabs.value.findIndex(v => {
                return v.id == pages[i]
            })
            if (index != -1) {
                openTabs.value.splice(index, 1)
            }
        }
    }

    const GetWorkMenu = () => {
        window.ipcRenderer.invoke("get-work-menus").then(ret => {
            console.log(ret)
            workDatas.value = ret
        })
    }

    const initCustomization = async () => {
        GetWorkMenu()
    }

    initCustomization()

    return {
        openTabs,
        activeTab,
        workDatas,
        menus,
        state,
        onCloseTabById,
        GetWorkMenu,
        onChangeTab,
        onSelectNav,
        onOpenTabs,
        onDeleteMenu
    }
})

