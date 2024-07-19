import '../public/static/weather.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts/core';  
import pinia from '@/stores/index'
import {  
    CanvasRenderer  
} from 'echarts/renderers';  
 
// 注册渲染器  
echarts.use(  
    [CanvasRenderer]  
);

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
