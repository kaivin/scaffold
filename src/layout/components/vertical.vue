<script setup lang="ts">
import Logo from "./logo/index.vue"
import SidebarItem from "./sidebarItem/index.vue";
import { useStore } from 'vuex'
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const store = useStore()
const menuList = store.state.routes.wholeRoutes
const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignore
    return meta.activeMenu;
  }
  return path;
});

</script>
<template>
  <div class="sidebar-container">
    <Logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        unique-opened
        router
        :collapse-transition="false"
        mode="vertical"
        class="outer-most"
      >
        <sidebar-item
          v-for="route in menuList"
          :key="route.path"
          :item="route"
          class="outer-most"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
</style>

