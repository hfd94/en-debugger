import App from './App.vue'
// Composables
import { createApp } from 'vue'
import "./styles/index.css"
import { registerPlugins } from './plugins'
import 'vfonts/Lato.css'


const app = createApp(App)
registerPlugins(app)

app.mount('#app')
