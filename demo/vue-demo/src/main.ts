import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import FastJsonUI, { registerComponent } from 'fast-json-ui-vue'

//注册自定义 Vue
import CustomComponent from './components/custom/CustomComponent.vue'
registerComponent('CustomType', CustomComponent)
registerComponent('CustomCard', CustomComponent)

const app = createApp(App)

// Register all components from the Fast-JSON-UI library
app.use(FastJsonUI)

app.mount('#app')
