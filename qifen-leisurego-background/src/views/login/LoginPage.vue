<script setup lang="js">
import { onMounted, ref } from 'vue'
import {
    Lock,
    User,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { userLoginService,getUserInfoService } from '@/api/user.js'
import { useUserStore } from '@/stores' //引入userStore
import LoginBg from './components/LoginBg.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginRW = ref('35%')
const displayV = ref('block')

const form = ref()
//整个的用于提交的form数据对象
const formModel = ref({
    username: 'admin',
    password: 'admin'
})


//登录请求
const loginbtnloading = ref(false)
const userStore = useUserStore()
const login = async () => {
    try {
        await form.value.validate()
        // await userLoginService(formModel.value)
        loginbtnloading.value = true
        const  {data} = await userLoginService(formModel.value)
        const { data1 } = getUserInfoService(data.data.id)
        // console.log(data);
        loginbtnloading.value = false
        //保存token到store
        userStore.setToken(data.data.token)
        // userStore.user = data.data
        userStore.user.id = data.data.id
        userStore.user.name = data.data.name
        userStore.user.username = formModel.value.username
        userStore.user.sex = data.data.sex
        userStore.user.token = data.data.token
        userStore.user.image = data.data.image
        console.log(userStore.user);
        router.push('/')
    } catch (error) {
        ElMessage('登录错误')
        console.log(error)
    }
}
// const login = ()=>{
//     router.push('/homePage')
// }
// const login = () => {
//     userStore.setToken('admin')
//     console.log('登录成功', userStore.token);
// }

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度在2到10个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            pattern: /^\S{4,16}$/,
            message: '密码长度在4到16位的非空字符',
            trigger: 'blur'
        }
        // { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
    ]
}

const Sidebar_control = () => {
    const windowWidth = () => {
        if (window.innerWidth < 890) {
            loginRW.value = '70%'

        } else {
            loginRW.value = '25%'
            displayV.value = 'block'
        }
        if (window.innerWidth < 800) {
            displayV.value = 'none'
        }
    }
    windowWidth()
    window.addEventListener('resize', () => {
        windowWidth()
    });
}
Sidebar_control()



//让视频元素跟随鼠标移动做伪3D效果
const bgvido = ref(null)
const loginContainer = ref(null)
const videoMove = () => {
    const video = bgvido.value
    const container = loginContainer.value
    // if (!video) return
    const mousemove = (e) => {
        const x = e.clientX - video.offsetLeft
        const y = e.clientY - video.offsetTop
        video.style.transform = `perspective(500px) rotateX(${(10 * (y / video.offsetHeight - 0.5)) * -1}deg) rotateY(${(10 * (x / video.offsetWidth - 0.5)) * -1}deg)`
    }
    window.addEventListener('mousemove', mousemove)
}

// onMounted(() => {
//     videoMove()
// })

</script>

<template>
    <div class="login">
        <el-row class="login-container" ref="loginContainer" type="flex" justify="center" align="middle">
            <!-- <video src="/src/assets/login/bgv.mp4" autoplay loop muted class="bgvido" ref="bgvido"></video> -->
            <LoginBg></LoginBg>
            <!-- <img class="bg" src="/src/assets/login/mask.png" alt=""> -->
            <!-- <img class="bg1" src="https://gd-hbimg.huaban.com/0b4b3033f3acd57984fa2005d03b183ceb77e77a53bb08-k8F4Tw" 
            alt="">-->
            <div class="login-right">
                <el-form ref="form" :model="formModel" :rules="rules" class="login-form" label-position="top"
                    label-width="auto" >
                    <img class="logo" src="/src/assets/logo.svg" alt="">
                    <el-form-item label="" prop="username">
                        <el-input :prefix-icon="User" class="input" v-model="formModel.username" @keyup.enter.native="login"/>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input type="password" :prefix-icon="Lock" class="input" show-password
                            v-model="formModel.password" @keyup.enter.native="login" />
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loginbtnloading" style="width: 230px;font-size: 12px;border-radius: 16px;margin-top: 20px;"
                            color="rgb(255, 193, 0)" type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
.login {
    width: 100%;
    height: 100vh;
    position: fixed;
    background-color: rgb(255, 193, 7);
    // background: url('https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center center fixed;
    background-size: 100% 100%;
}

// .login-container:hover::before {
//     height: 100%;
// }

.login-container::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0px;
    background: linear-gradient(-45deg, #27a907 0%, #e5c704 100%);
    z-index: 0;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
}

.bgvido:hover~.bg {
    transform: scale(3);
    transition: all 3s ease;
}

// .bgvido:hover~.bg1 {
//     transform: scale(6);
//     transition: all 2s ease;
// }

.login-container {
    background: linear-gradient(-45deg, #036776 0%, #5fd6df 50%);
    height: calc(100vh - 80px);
    width: calc(100vw - 80px);
    margin: 40px;
    box-shadow: 5px 5px 30px 15px rgba(36, 36, 36, 0.3);
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    $bgwidth: 90vw;

    .bgvido {
        width: 120%;
        height: 120%;
        object-fit: cover;
        position: absolute;
        // top: -50px;
    }

    .bg {
        filter: drop-shadow(2px 2px 20px #03416b);
    }

    .bg,
    .bg1 {
        width: 100%;
        height: 100%;
        position: absolute;
        display: v-bind(displayV);
        object-fit: cover;
        left: -100px;
        pointer-events: none;
        transition: all 2s ease;
        transform: scale(1);
    }

    .login-right {
        height: 100%;
        width: v-bind(loginRW);
        position: absolute;
        right: 0;
        top: 0;
        // margin: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 15px;
        overflow: hidden;
        // background: url('/src/assets/login/leftbg.png');
        transition: all 0.5s ease-in-out;
        z-index: 999;
        box-shadow: 1px 1px 5px 5px rgba(4, 100, 226, 0.1);

        // .login-form::before {
        //     content: "";
        //     position: absolute;
        //     left: 0;
        //     top: 0;
        //     width: 100%;
        //     height: 100%;
        //     z-index: 0;
        //     border-radius: 15px;
        //     background-color: rgba(255, 255, 255, 0.8);
        //     background-size: 100% 100%;
        //     // filter: blur(5px);
        //     backdrop-filter: blur(100px);
        // }

        .login-form {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background-color: rgb(255, 255, 255);

            z-index: 999;
            .el-form-item{
                width: 220px;
            }
            ::v-deep .el-input__wrapper {
                box-shadow: none;
                border-radius: 0;
                border-bottom: 1px solid rgba($color: #0b0b0b, $alpha: 0.5);
                background-color: rgba($color: #060606, $alpha: 0);

                .el-input__icon {
                    color: #0d0d0d;
                }
            }

            .logo {
                width: 120px;
                height: 85px;
                margin-bottom: 50px;
                z-index: 999;
            }

            .radio-group {
                position: absolute;
                top: 15px;
            }
        }
    }

}
</style>