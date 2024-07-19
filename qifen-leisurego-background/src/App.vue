<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
  
</template>

<style scoped>
  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>