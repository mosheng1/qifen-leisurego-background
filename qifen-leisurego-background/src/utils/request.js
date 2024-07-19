import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores'
import { ref } from 'vue'

// const baseURL = 'http://39.104.26.184:51001/background'
// const baseURL = 'http://localhost:8080/background'
const baseURL = 'http://mos.c1.sidoc.cn/background'
// const baseURL = 'https://mock.apipark.cn/m1/4249943-0-default'
// const baseURL = 'http://localhost:8080'
// const baseURL = 'https://quan.h1.sidoc.cn/background'
const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    // 'Authorization': `Bearer ${userStore.token}`,
  }
})

// 处理请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.token = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 处理响应拦截器
instance.interceptors.response.use(
  (response) => {
    // ElMessage.success('请求成功')
    return response
  },
  (error) => {
    const status = error.response ? error.response.status : null
    if (status === 401) {
      // 清除用户令牌并重定向到登录页面
      const userStore = useUserStore()
      userStore.removeToken() // 清除用户令牌
      ElMessage.error('令牌已过期或无效。请重新登录。')
      router.push('/login') // 重定向到登录页面
    } else {
      ElMessage.error('发生错误。请稍后再试。')
    }
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
