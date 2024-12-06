import { useCustomization } from "@/stores";
import { computed, ref, watch } from "vue"
// import { hasClass, toggleClass } from "@/utils"



export const useTags = () => {
    const customization = useCustomization()

    const tabs = computed(() => {
        return customization.openTabs;
    })

    const activeIndex = computed(() => {
        return customization.activeTab.index
    })
    const hoverIndex = ref("");
    const iconIsActive = computed(() => {
        return (index: string) => {
            if (activeIndex.value == index) { return true }
            return index == hoverIndex.value
        };
    });

    function onMouseLeave(index: string) {
        hoverIndex.value = ""
    }

    const onMouseEnter = (index: string) => {
        if (index) hoverIndex.value = index;
    }

    const onActiveTab = (index: any) => {
        if (index == activeIndex.value) return
        customization.onChangeTab(index)
    }

    const onCloseTab = (id: string) => {
        customization.onCloseTabById(id)
    }

    return {
        tabs, activeIndex,
        iconIsActive,
        onCloseTab,
        hoverIndex, onMouseEnter, onMouseLeave, onActiveTab
    }

}