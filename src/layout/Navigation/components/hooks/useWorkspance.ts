import { useCustomization } from "@/stores";
import { computed, reactive, ref, nextTick } from "vue"

export const useWorkSpace = () => {
    const customization = useCustomization()
    const menu = reactive({
        right: "",
        show: false,
        x: 0,
        y: 0
    })

    const datas = computed(() => {
        return customization.workDatas;
    })

    const initiallyOpen = ref([""]);
    const colorConf: Record<string, { color: string, title: string }> = {
        get: { color: "success", title: "get" },
        post: { color: "success", title: "post" },
        websocket: { color: "info", title: "wsock" },
    };

    const active = ref(false)


    const onClickItem = (path: string[]) => {
        let obj: any = datas.value
        path.forEach(v => {
            const ele = obj.find((v2: { title: string; }) => {
                return v2.title == v
            })
            if (ele.children) {
                obj = ele.children
            } else {
                obj = ele
            }
        })

        console.log(obj)
        customization.onOpenTabs(obj)
    }

    const onRightClick = ($event: PointerEvent, item: VnsDebug.WorkItem) => {
        $event.preventDefault()
        menu.show = false
        Object.assign(menu, {
            right: item.title,
            x: $event.clientX,
            y: $event.clientY,
        })
        nextTick(() => {
            menu.show = true
        })
        console.log(menu)
    }



    return {
        menu,
        datas,
        initiallyOpen,
        colorConf,
        active,
        onClickItem,
        onRightClick
    }
}