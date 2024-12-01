import { defineStore } from "pinia";
import { markRaw, reactive, ref, type Component } from "vue";

import WorkSpace from "@/layout/Navigation/components/WorkSpace.vue";
import Environment from "@/layout/Navigation/components/Environment.vue"
import Toolbox from "@/layout/Navigation/components/Toolbox.vue"



export const useCustomization = defineStore("customization", () => {
    const openTabs = ref<Array<VnsDebug.Tabs>>([])
    const activeTabIndex = ref("")
    const workDatas = ref<VnsDebug.WorkItem[]>([
        {
            title: ".git",
            children: [
                {
                    title: ".git1",
                    children: [
                        {
                            title: ".git2",
                            children: [],
                        },
                    ],
                },
                {
                    title: ".post",
                    type: "post",
                },
                {
                    title: ".socket",
                    type: "websocket",
                },
            ],
        },
        {
            title: "node_modules",
            children: [],
        },
    ]);
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
        activeTabIndex.value = args
        console.log(activeTabIndex.value)
    }

    const onOpenTabs = (item: VnsDebug.WorkItem) => {
        const ret = openTabs.value.find((v) => {
            return v.name == item.title
        })
        if (!ret) {
            openTabs.value.push({
                name: item.title,
                type: item.type!,
                id: item.title
            })
            activeTabIndex.value = item.title
        } else {
            activeTabIndex.value = ret.name
        }

    }

    return {
        openTabs,
        activeTabIndex,
        workDatas,
        menus,
        state,
        onChangeTab,
        onSelectNav,
        onOpenTabs
    }
})

