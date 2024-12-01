import App from './App.vue'

// Composables
import { createApp } from 'vue'
import "./styles/index.css"
import { registerStore } from '@/stores'
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerStore(app)
registerPlugins(app)

app.mount('#app')
