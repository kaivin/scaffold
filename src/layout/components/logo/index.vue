<script setup lang="ts">
const title = "viteDemo"
</script>

<template>
  <div class="sidebar-logo">
    <router-link :title="title" class="logo-link" to="/">
      <img class="logo-img" src="@/assets/logo.png" />
      <h1 class="logo-title">{{ title }}</h1>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;
  .logo-link {
    height: 100%;
    padding-left: 10px;
    text-align: left;
    .logo-img{
      width: 32px;
      height: 32px;
      display: inline-block;
      margin: 8px;
      vertical-align: top;
    }
    .logo-title {
      display: inline-block;
      margin: 0;
      color: #1890ff;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      margin-top: 12px;
      vertical-align: top;
    }
  }
}
</style>
