import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import HomePage from "@/views/HomeView/index.vue"
import HexEditor from "@/views/HexEditView/index.vue"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: 'home',
            component: HomePage
        },
        {
            path: "/hex-editor",
            name: 'hex-editor',
            component: HexEditor
        }
    ]
})

export default router