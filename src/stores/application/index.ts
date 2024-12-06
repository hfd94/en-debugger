import { defineStore } from "pinia";
import { ref } from "vue";

export const useApplication = defineStore("application", () => {

    const isLoading = ref(false)

    const show = () => {
        isLoading.value = true
    }

    const hide = () => {
        isLoading.value = false
    }

    return {
        isLoading,
        show, hide
    }
})