<script setup lang="ts">
import navbar from "./components/navbar.vue";
import appMain from "./components/appMain.vue";
import Vertical from "./components/vertical.vue";
import tags from "./components/tags.vue";
import { useStore } from 'vuex'
const store = useStore()
import { computed } from "vue";
const sidebar = computed(() => {
  return store.state.app.sidebar;
});
</script>

<template>
  <div :class="['app-wrapper',sidebar.opened?'':'hideSidebar',sidebar.withoutAnimation?'withoutAnimation':'']">
    <!-- 侧边导航栏 -->
    <Vertical />
    <div class="main-container">
      <div class="fixed-header">
        <!-- 顶部导航栏 -->
        <navbar />
        <!-- 标签栏 -->
        <tags />
      </div>
      <!-- 主体内容 -->
      <app-main />
    </div>
  </div>
</template>


<style lang="scss" scoped>

</style>

