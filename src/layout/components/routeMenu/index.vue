<script setup lang="ts">
import { emitter } from "@/utils/mitt";
import MenuItem from "./menuItem.vue";
import { algorithm } from "@/utils/algorithm";
import { useStore } from 'vuex'
import { computed,ref,onBeforeMount,getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter().options.routes;
const store = useStore();
const instance = getCurrentInstance().appContext.app.config.globalProperties.$storage;
const frame = ref(instance.layout.frame);
// 获取路由菜单数据
const menuList = computed(() => {
  return store.state.routes.wholeRoutes;
});
// 获取当前侧边菜单的折叠展开状态
const isCollapse = computed(() => {
  return !store.state.app.sidebar.opened;
});
// 获取当前选中菜单的path
const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignore
    return meta.activeMenu;
  }
  return path;
});
// 菜单点击事件
const menuSelect = (indexPath: string): void => {
  let parentPath = "";
  let parentPathIndex = indexPath.lastIndexOf("/");
  if (parentPathIndex > 0) {
    parentPath = indexPath.slice(0, parentPathIndex);
  }
  // 找到当前路由的信息
  // eslint-disable-next-line no-inner-declarations
  function findCurrentRoute(routes) {
    return routes.map(item => {
      if (item.path === indexPath) {
        // 切换左侧菜单 通知标签页
        emitter.emit("changLayoutRoute", {
          indexPath,
          parentPath
        });
      } else {
        if (item.children) findCurrentRoute(item.children);
      }
    });
  }
  findCurrentRoute(algorithm.increaseIndexes(router));
};
</script>
<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    unique-opened
    ellipsis
    router
    :collapse-transition="false"
    :mode="frame==='topBottom'?'horizontal':'vertical'"
    class="router-menu"
    @select="menuSelect"
  >
    <menu-item
      v-for="route in menuList"
      :key="route.path"
      :item="route"
      class="outer-most"
      :base-path="route.path"
    />
  </el-menu>
</template>
<style lang="scss" scoped></style>

