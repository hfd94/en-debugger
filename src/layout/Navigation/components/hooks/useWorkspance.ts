import { useCustomization } from "@/stores";
import { computed, reactive, ref, nextTick, effect } from "vue"

export const useWorkSpace = () => {
    const customization = useCustomization()

    const datas = computed(() => {
        return customization.workDatas;
    })


    interface Menu {
        item: VnsDebug.WorkItem | null
        type: 0 | 1
        active: boolean
    }

    const menu = reactive<Record<string, any> & Menu>({
        x: 0,
        y: 0,
        type: 0, //0 是文件夹类型， 1 是节点类型 
        selectId: "",
        active: false,
        item: null,
        isRightClick: false
    })


    const modal = reactive({
        showApi: false,
        showFolder: false,
        isRename: false,
        fileName: "",
        selectType: "",
        requestUrl: '',
    })

    const initiallyOpen = ref([""]);
    const colorConf: Record<string, { color: string, title: string }> = {
        get: { color: "success", title: "get" },
        post: { color: "success", title: "post" },
        websocket: { color: "info", title: "wsock" },
    };


    const hideMenu = () => {
        menu.active = false
    }

    // 显示右键菜单
    const onShowRightMenu = ($event: PointerEvent, item: VnsDebug.WorkItem, type: number = 0) => {
        $event.preventDefault()
        hideMenu()
        Object.assign(menu, {
            right: item.id,
            x: $event.clientX,
            y: $event.clientY,
            item,
            type
        })
        nextTick(() => {
            menu.active = true
        })
    }

    // 打开创建文件集合
    const onOpenCreateFolder = (isRight = false) => {
        Object.assign(modal, {
            showFolder: true,
            fileName: "",
            isRename: false,
        })
        menu.isRightClick = isRight
        if (isRight) { menu.active = false }
    }
    // 打开创建Api
    const onOpenCreateApiModal = () => {
        Object.assign(modal, {
            showApi: true,
            showFolder: false,
            fileName: "",
            selectType: "",
            requestUrl: '',
            isRename: false,
        })
        hideMenu()
    }

    const onOpenRename = () => {
        Object.assign(modal, {
            showApi: false,
            showFolder: true,
            fileName: menu.item?.title,
            selectType: "",
            requestUrl: '',
            isRename: true,
        })
        hideMenu()
    }

    // 提交创建
    const onCreateFolder = async () => {
        if (!modal.isRename) {
            await window.ipcRenderer.invoke("insert-menu-folder", {
                name: modal.fileName,
                parentId: !menu.isRightClick ? "" : menu.item!.id,
            });
            await customization.GetWorkMenu()
            onCancelFolder()
        } else {
            console.log("update:", menu.item?.id)
        }
    };

    // 取消
    const onCancelFolder = () => {
        modal.showFolder = false;
    };

    const onPostCreateApi = async () => {
        await window.ipcRenderer.invoke("insert-menu-folder", {
            name: modal.fileName,
            parentId: menu.item!.id,
            type: modal.selectType.toLocaleLowerCase(),
            url: modal.requestUrl,
        });
        await customization.GetWorkMenu()
        modal.showApi = false
    }

    const onDeleteMenuItem = async (isClear: boolean = false) => {
        const tab: string[] = []
        const page: string[] = []
        if (!isClear) {
            tab.push(menu.item?.id!)
        }

        const getMenuId = (item: VnsDebug.WorkItem) => {
            if (item.children) {
                item.children.forEach(v => {
                    tab.push(v.id)
                    if (v.type) {
                        page.push(v.id)
                    }
                    getMenuId(v)
                })
            }
        }
        getMenuId(menu.item!)
        if (page.length > 0) {
            customization.onDeleteMenu(page)
        }
        await window.ipcRenderer.invoke("delete-menu", { tab, page });
        await customization.GetWorkMenu()
        hideMenu()
    }

    const onClickItem = (path: string[]) => {
        let obj: any = datas.value
        path.forEach(v => {
            const ele = obj.find((v2: { id: string; }) => {
                return v2.id == v
            })
            if (!ele) { return }
            if (ele.children) {
                obj = ele.children
            } else {
                obj = ele
            }
        })

        console.log(obj)
        customization.onOpenTabs(obj)
    }




    return {
        modal,
        menu,
        datas,
        initiallyOpen,
        colorConf,
        onOpenRename,
        onClickItem,
        onShowRightMenu,
        onCreateFolder,
        onOpenCreateFolder,
        onCancelFolder,
        onOpenCreateApiModal,
        onPostCreateApi,
        onDeleteMenuItem
    }
}