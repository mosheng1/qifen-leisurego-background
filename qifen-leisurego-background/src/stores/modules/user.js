import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserStore = defineStore(
  'qifen-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const user = ref({
      id:'',
      name: '',
      username: '',
      sex: 1,
      token: '',
      image:''
    })
 
    const setUser = (newUser) => {
      user.value = newUser
    }

    return {
      token,
      setToken,
      removeToken,
      setUser,
      user,
    }
  },
  {
    //配置持久化
    persist: true
  }
)
