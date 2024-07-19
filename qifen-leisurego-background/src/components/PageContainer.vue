<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <!-- title显示在header中 -->
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 定义插槽extra，用于显示额外的操作按钮 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 定义插槽默认内容 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  font-size: 25px;
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
