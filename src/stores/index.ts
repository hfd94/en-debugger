export * from "./customization"
import { createPinia } from "pinia";
import type { App } from "vue";


const store = createPinia()

export const registerStore = (app: App) => {
    app.use(store)
}

export { store }