<script setup lang="ts">

</script>

<template>
  <div class="tags-view">
    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll-container"></el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.tags-view {
  width: 100%;
  font-size: 14px;
  height: 38px;
  display: flex;
  box-shadow: 0 0 1px #888;
  .scroll-container {
    padding: 5px 0;
    white-space: nowrap;
    position: relative;
    width: 100%;
    background: #fff;
    .scrollbar-wrapper {
      position: absolute;
      height: 40px;
      overflow-x: hidden !important;
    }
  }
}
</style>