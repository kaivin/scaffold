<script setup lang="ts">

</script>

<template>
  <div class="app-main">
    <el-scrollbar>
      <router-view></router-view>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
}
</style>