<script lang="ts">
export default {
  name: "HeaderPanel"
};
</script>
<script setup lang="ts">
import Logo from "./logo/index.vue"
import RouteMenu from "./routeMenu/index.vue"
import { emitter } from "@/utils/mitt";
import { useI18n } from "vue-i18n";
import avatars from "@/assets/avatars.jpg";
import { storageLocal,storageSession } from "@/utils/storage";
import Hamburger from "./hamBurger/index.vue";
import Breadcrumb from "./breadCrumb/index.vue";
import screenfull from "./screenfull/index.vue";
import Icon from "@/components/Icon/src/Icon.vue";
import Notice from "./notice/index.vue";
import { ref,unref, watch, getCurrentInstance,onBeforeMount,computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { getConfig } from "@/config";
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
const { locale } = useI18n();
const instance = getCurrentInstance().appContext.app.config.globalProperties.$storage;
const instanceConfig = getCurrentInstance().appContext.app.config.globalProperties.$config;
const store = useStore()
const router = useRouter();
const route = useRoute();
const sidebar = store.state.app.sidebar
let frame = computed(()=>{
  return  store.state.app?.frame;
});
let userName = storageSession.getItem("userInfo")?.username;
const showLogo = ref(instance.sets.sidebarLogo);
onBeforeMount(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});
function toggleSideBar() {
  store.dispatch("app/toggleSideBar")
}
// 退出登录
const logout = (): void => {
  storageSession.removeItem("userInfo");
  router.push("/login");
};

watch(
  () => locale.value,
  () => {
    //@ts-ignore
    document.title = transformI18n(unref(route.meta.title),unref(route.meta.i18n)) + " - " + transformI18n(getConfig().Title as string,true); // 动态title
  }
);
// 简体中文
function translationCh() {
  instance.locale = { locale: "zh" };
  locale.value = "zh";
}

// English
function translationEn() {
  instance.locale = { locale: "en" };
  locale.value = "en";
}
function onPanel() {
  emitter.emit("openPanel");
}
</script>

<template>
  <div class="header">
    <div class="header-left">
      <Logo v-if="frame!=='leftRight'&&showLogo" />
      <Hamburger v-if="frame==='leftRight'" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <Breadcrumb v-if="frame!=='topBottom'" class="breadcrumb-container" />
    </div>
    <div class="header-center"><route-menu v-if="frame==='topBottom'" /></div>
    <div class="header-right">
      <!-- 通知 -->
      <Notice />
      <!-- 全屏 -->
      <screenfull />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <el-icon class="globalization"><Icon :svg="true" :content="'sgn-translate'"/></el-icon>
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item :style="{background: locale === 'zh' ? '#1b2a47' : '',color: locale === 'zh' ? '#f4f4f5' : '#000'}" @click="translationCh">
              <el-icon class="check-zh" v-show="locale === 'zh'"><check /></el-icon>简体中文
            </el-dropdown-item>
            <el-dropdown-item :style="{ background: locale === 'en' ? '#1b2a47' : '', color: locale === 'en' ? '#f4f4f5' : '#000' }" @click="translationEn">
              <el-icon class="check-en" v-show="locale === 'en'"><check /></el-icon>English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="avatars" />
          <p>{{ userName }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout"><i class="ri-logout-circle-r-line"></i>{{$t("message.hsLoginOut")}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon class="settings" :title="$t('message.hssystemSet')" @click="onPanel">
        <Icon :svg="true" :content="'icon-xitong'"/>
      </el-icon>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
