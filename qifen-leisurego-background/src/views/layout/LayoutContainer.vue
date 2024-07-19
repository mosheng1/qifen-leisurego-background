<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  Expand,
  Fold,
  House,
  Clock,
  Warning,
  Coin,
  Search,
  ArrowDown,
  Monitor
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { Plus } from '@element-plus/icons-vue'
import { modifyUserInfoService ,uploadAvatarService} from '@/api/user.js'
const userStore = useUserStore()
//发送请求获取用户信息
// console.log(userStore.user);
const title = ([
  { title: '首页', type: 'success', path: 'homePage', icon: House },
  {
    title: '平台审核', type: 'warning', path: 'auditing', icon: Clock,
    submenu: [
      { title: '用户信息审核', type: 'warning', path: 'auditing', icon: Clock },
      { title: '发布内容审核', type: 'warning', path: 'auditing', icon: Clock },
    ]
  },
  { title: '违规内容', type: 'danger', path: 'violation', icon: Warning },
  { title: '信息查询', type: 'info', path: 'query', icon: Search },
  { title: '平台管理', type: 'primary', path: 'management', icon: Coin },
])
const isCollapse = ref(false)

const iconpadding = ref("0px");

const updateSidebarState = (collapse) => {
  isCollapse.value = collapse;
  iconpadding.value = collapse ? "0px" : "15px";
};
// 监听浏览器大小，改变侧边栏收缩状态
const Sidebar_control = () => {
  const windowWidth = () => {
    if (window.innerWidth < 900) {
      updateSidebarState(true);
    } else {
      updateSidebarState(false);
    }
  };
  windowWidth();
  window.addEventListener('resize', windowWidth);
};

Sidebar_control();

const isCollapseSwitch = (sw) => {
  updateSidebarState(sw);
};

// const Sidebar_control = () => {
//   const windowWidth = () => {
//     if (window.innerWidth < 900) {
//       isCollapse.value = true;
//     } else {
//       isCollapse.value = false;
//     }
//   }
//   windowWidth()
//   window.addEventListener('resize', () => {
//     windowWidth()
//   });
// }
// Sidebar_control()
// const iconpadding = ref(0)
// const isCollapseSwitch = (sw) => {
//   if (sw == true) {
//     iconpadding.value = "0px"
//     isCollapse.value = true
//   } else {
//     iconpadding.value = "15px"
//     isCollapse.value = false
//   }
// }

const path = ref('')  // 初始化路径变量
// 获取当前路由
const route = useRoute()
const router = useRouter()
onMounted(() => {
  // 在页面加载时获取当前路由的路径并设置给path变量
  path.value = route.path
  //去除路径中的'/'
  path.value = path.value.replace('/', '')
})
//监视路由变化
watch(
  () => route.path,
  (newVal) => {
    // 监听路由变化，更新path变量
    path.value = newVal.replace('/', '')
  }
)

const logout = () => {
  // userStore.removeToken() //清除token
  // userStore.setUser({})
  // 退出登录清除用户信息
  localStorage.removeItem('qifen-user');
  router.push('/login')
}
const userInfoDrawer = ref(false)
// 个人信息表单
const userForm = ref({
  id: userStore.user.id,
  name: userStore.user.name,
  username: userStore.user.username,
  image: userStore.user.image,
})
// 打开个人信息弹窗
const personalInfo = async () => {
  userInfoDrawer.value = true
}
// 更新用户信息
const updateLoading = ref(false)
const updateUserInfo = async () => {
  updateLoading.value = true
  await modifyUserInfoService(userForm.value)
  updateLoading.value = false
  userStore.setUser(userForm.value)
  userInfoDrawer.value = false
}
const imgUrl = ref('')
// 加载当前用户的头像
imgUrl.value = userStore.user.image
const imageUrl = ref('')
// 上传头像
const onSelectFile = (uploadFile) => {
  console.log(userStore.token);
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // const data = uploadAvatarService(uploadFile.raw)
  // console.log(data);
}
// 关闭个人信息弹窗时更新头像
const drawerOff = () => {
  imgUrl.value = userStore.user.image
}

const headers = ref({
  // 'Content-Type': 'application/json;charset=UTF-8',
  'token': userStore.token
})
const onSuccess = (response) => {
  console.log(response);
  userForm.value.image = response.data
}
</script>

<template>
  <el-container class="layout-container">
    <el-header>
      <div class="logo-item"><img class="logo-img" src="@/assets/logo.svg" alt=""><b
          style="font-family:'FZXiDengXian-Z06S';margin: 5px 0 0 15px;color: #3c3c3c;">管理系统</b>
        <span
          style="border-bottom: 2px solid #3C3C3C;border-radius: 2px solid #3C3C3C;border-radius:5px 0;display: block;position:absolute;top:35px;left: 60px;height: 10px;width: 115px;">
        </span>
        <el-icon style="position: absolute; left: 210px;color: #343744;" size="30px" v-if="isCollapse"
          @click="isCollapseSwitch(false)">
          <Expand />
        </el-icon>
        <el-icon style="position: absolute; left: 210px;color: #343744;" size="30px" v-else
          @click="isCollapseSwitch(true)">
          <Fold />
        </el-icon>
      </div>
      <div class="user-item">
        <el-avatar :src='userStore.user.image' />
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ userStore.user.name }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-button style="border: none;" @click="personalInfo" class="m-2">个人信息</el-button>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-drawer @close="drawerOff" v-model="userInfoDrawer" title="个人信息" with-header>
      <div class="user-info">
        <div><el-avatar :size="100" :src="userStore.user.image" /></div>
        <div>昵称：{{ userStore.user.name }}</div>
        <div>账号：{{ userStore.user.username }}<br>性别：男</div>
      </div>
      <el-divider content-position="left">修改个人信息</el-divider>
      <div>
        <el-form :model="userForm">
          <el-form-item label="昵称">
            <el-input v-model="userForm.name" placeholder="请输入昵称" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="userForm.username" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" :show-file-list="false" :method="post" :on-success="onSuccess" :headers="headers" :action="'/background/api/bg/user/upload'" :auto-upload="true" :on-change="onSelectFile" >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo" :loading="updateLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--  @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" -->
        <el-menu :router="true" :default-active="path" class="el-menu-vertical-demo" :collapse="isCollapse"
          text-color="fff">
          <el-menu-item index="homePage">
            <!-- 图标 -->
            <el-icon>
              <House />
            </el-icon>
            <template #title>首页</template>
          </el-menu-item>
          <el-sub-menu>
            <template #title>
              <el-icon>
                <Clock />
              </el-icon>
              <span>平台审核</span>
            </template>
            <el-menu-item index="auditingUser">
              用户信息审核</el-menu-item>
            <el-menu-item index="auditingPublish">
              发布内容审核</el-menu-item>
            <el-menu-item index="auditingComment">
              发布评论审核</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="violation">
            <!-- 图标 -->
            <el-icon>
              <Warning />
            </el-icon>
            <template #title>违规内容</template>
          </el-menu-item>
          <el-menu-item index="query">
            <!-- 图标 -->
            <el-icon>
              <Search />
            </el-icon>
            <template #title>信息查询</template>
          </el-menu-item>
          <el-menu-item index="management">
            <!-- 图标 -->
            <el-icon>
              <Monitor />
            </el-icon>
            <template #title>平台管理</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="font-size: 80px;">
        <transition style="transition: all 0.5s ease;" name="el-zoom-in-top" mode="out-in">
          <router-view>
          </router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep(.my-label) {
  background-color: #FFC100 !important;
}

:deep(.my-content) {
  background-color: #FFC100 !important;
}

// 个人信息
.user-info {
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  background-color: #FFC100;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 1px 1px 10px rgba(106, 105, 105, 0.3);

  // div {
  //   background-color: red;
  // }

  div:nth-child(1) {
    grid-row: 1/3;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div:nth-child(2) {
    font-size: 22px;
  }

  div:nth-child(3) {
    font-size: 14px;
  }

  div:nth-child(2),
  div:nth-child(3) {
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 10px;
    border-bottom: 1px solid #e6e6e6;
    color: #0d0d0c;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}

//  .el-menu--popup-container{
//   border: none;
//   width: 50px !important;
// }
.el-popper.is-light {
  background: none !important;
  border: none !important;
}

// 弹出的二级菜单
.el-menu--popup {
  // background-color: rgb(52, 55, 68);
  border: none;
  color: #fff;
  // overflow: hidden;
  // width: 10px !important;
  min-width: 120px !important;
  background: rgb(52, 55, 68) !important;
  border-radius: 6px;

  .el-menu-item {
    width: 110px;
    height: 45px;
    margin: 0 auto;
    text-align: center !important;
    padding-left: 12px !important;
  }

  .el-menu-item:hover {
    background-color: rgba(255, 193, 0, 0.2) !important;
    border-radius: 6px;
  }
}

.layout-container {
  height: 100vh;
  background-color: #ebebeb;

  .logo-item {
    width: 200px;
    height: 60px;
    line-height: 60px;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .logo-img {
    width: 30%;
    height: 60%;
  }

  .el-aside {
    background-color: rgb(52, 55, 68);
    transition: all 0.3s ease;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    user-select: none;
    // width: 180px;



    .el-menu-vertical-demo {
      margin-top: 25px;
      background-color: rgb(52, 55, 68);
      border: none;
      color: #f6eeee;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
      min-width: 150px;
    }

    .el-sub-menu__title {
      height: 45px;

    }

    .el-sub-menu {
      transition: all .3s ease;
      margin: 8px auto;
      padding: 0;
      width: 90% !important;
      position: relative;

      .el-menu.el-menu--inline {
        background: none;
      }

      .el-menu-item.is-active {
        padding-left: 40px !important;
      }
    }

    .el-sub-menu.is-opened .el-menu.el-menu--inline {
      height: fit-content !important;
    }

    .el-sub-menu>:nth-child(2) .el-menu-item {
      background: none;
    }

    .el-sub-menu.is-hover {
      background-color: rgba(227, 171, 5, 1) !important;
    }

    .el-menu-item {
      transition: all .3s ease;
      height: 45px;
      margin: 8px auto;
      padding: 0;
      width: 90% !important;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .el-icon {
      height: 35px;
      line-height: 45px !important;
      transition: all 0.3s ease;
      // padding-left: 10px;
      padding-right: 5px;
      margin-left: v-bind("iconpadding");
    }

    .el-sub-menu__icon-arrow {
      position: absolute;
      top: 13px;
    }

    // 鼠标移入菜单项时，背景色变浅
    .el-menu-vertical-demo .el-menu-item:hover:not(.is-active),
    .el-menu-vertical-demo .el-sub-menu>:nth-child(1):hover:not(.is-active) {
      background-color: rgba(255, 193, 0, 0.2) !important;
      // border-radius: 0 12px 12px 0;
      border-radius: 6px;
    }


    .el-menu-vertical-demo .el-menu-item.is-active {
      border-left: none;
      background-color: rgba($color: #f3f2f2, $alpha: 1);
      color: #0d0d0c;
      width: 90% !important;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      padding-left: 30px;
      border-radius: 6px;
      // padding-right: 40px;
      transition: all .3s ease;
    }

    .el-menu-item.is-active .el-icon {
      // border-bottom: 1.2px solid #d6aa09;
      border-radius: 2px 2px;
      // margin-right: 25px;
    }

    .el-menu-vertical-demo .el-switch {
      display: table;
      margin: auto;
    }
  }

  .el-header {
    background-color: rgb(255, 193, 0);
    padding: 0;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    position: relative;
    user-select: none;

    .user-item {
      position: absolute;
      top: 0px;
      right: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      // background-color: #d1d1d3;
      height: 100%;

      .el-avatar {
        margin-right: 10px;
        background-color: #fff;
      }

      .el-dropdown-link {
        font-size: 16px;
        color: rgb(52, 55, 68);
      }
    }
  }

  .el-main {
    background-color: #ebebeb;
    border-radius: 16px;
    margin: 10px;
    padding: 0;
    overflow: auto;
    height: calc(100vh - 80px);
  }
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>