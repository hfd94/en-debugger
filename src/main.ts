import App from './App.vue'
// Composables
import { createApp } from 'vue'
import "./styles/index.css"
import { registerStore } from './stores'
import { registerPlugins } from './plugins'
import router from './router'
import { InjectRuntime } from './utils/initRuntime';
import 'vfonts/Lato.css'


const app = createApp(App)

registerStore(app)
registerPlugins(app)
app.use(router)
InjectRuntime()
app.mount('#app')
