<script setup lang="ts">
import {
  ref,
  unref,
  reactive,
  computed,
  onMounted,
  onBeforeMount,
  getCurrentInstance
} from "vue";
import { useI18n } from "vue-i18n";
import HeaderPanel from "./components/headerPanel.vue";
import appMain from "./components/appMain.vue";
import setting from "./components/settings/index.vue";
import tags from "./components/tags/index.vue";
import Logo from "./components/logo/index.vue"
import RouteMenu from "./components/routeMenu/index.vue"
import { emitter } from "@/utils/mitt";
import { useStore } from 'vuex'
import { storageLocal,storageSession } from "@/utils/storage";
import { routerArrays } from "./types";
const store = useStore()
const instanceConfig = getCurrentInstance().appContext.app.config.globalProperties.$config;
const instance = getCurrentInstance();
const showTags = ref(instance.appContext.app.config.globalProperties.$storage.tagSetting.hideTabs);
const showLogo = ref(instance.appContext.app.config.globalProperties.$storage.sets.sidebarLogo);

let frame = computed(()=>{
  return  store.state.app?.frame;
});
const sidebar = computed(() => {
  return store.state.app.sidebar;
});
const hiddenSideBar = computed(() => {
  return store.state.settings.hiddenSideBar
});
onBeforeMount(() => {
  if (!instance) return;

  // 触发隐藏标签页
  emitter.on("tagViewsChange", key => {
    if (unref(showTags) === key) return;
    showTags.value = key;
  });
  // 触发logo显示隐藏
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});
</script>

<template>
  <div :class="['app-wrapper',sidebar.opened?'unfoldSidebar':'foldSidebar',sidebar.withoutAnimation?'withoutAnimation':'']">
    <!-- 侧边导航栏 -->
    <div class="sidebar-container" v-if="frame!=='topBottom'&&!hiddenSideBar">
      <Logo v-if="showLogo&&frame==='leftRight'" />
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <route-menu />
      </el-scrollbar>
    </div>
    <div class="main-container" :class="[hiddenSideBar?'hidden-mode':'show-mode',showTags?'hidden-tag':'show-tag']">
      <!-- 顶部导航栏 -->
      <div class="fixed-header" v-if="!hiddenSideBar"><header-panel /></div>
      <!-- 标签栏 -->
      <div class="fixed-tag" v-if="!showTags"><tags /></div>
      <!-- 主体内容 -->
      <app-main />
    </div>
    <!-- 系统设置 -->
    <setting />
  </div>
</template>


<style lang="scss" scoped>

</style>

