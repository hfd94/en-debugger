import { useCustomization } from "@/stores";
import { computed, ref, watch } from "vue"
// import { hasClass, toggleClass } from "@/utils"



export const useTags = () => {
    const customization = useCustomization()

    const tabs = computed(() => {
        return customization.openTabs;
    })

    const activeIndex = computed(() => {
        return customization.activeTabIndex
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

    return {
        tabs, activeIndex,
        iconIsActive,
        hoverIndex, onMouseEnter, onMouseLeave, onActiveTab
    }

}