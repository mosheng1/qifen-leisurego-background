import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

//导入模块，并导出
export * from './modules/user'
export * from './modules/time'
export * from './modules/useWeatherStore'
export * from './modules/auditingData'
export * from './modules/recent_data'