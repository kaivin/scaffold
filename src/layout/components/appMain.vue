<script setup lang="ts">
import {
  computed,
  getCurrentInstance
} from "vue";
import { RouterView } from "vue-router";
import { useStore } from 'vuex'
const store = useStore();
const instance = getCurrentInstance().appContext.app.config.globalProperties.$storage;
const keepAlive = computed(()=>{
  return instance?.tagSetting.keepAlive;
});
const cachePage = computed(()=>{
  return store.state.routes.cachePageList;
});
</script>

<template>
  <div class="app-main">
      <router-view>
        <template #default="{ Component, route }">
          <keep-alive v-if="keepAlive" :include="cachePage">
            <component
                :is="Component"
                :key="route.fullPath"
                class="main-content"
              />
          </keep-alive>
          <component
            v-else
            :is="Component"
            :key="route.fullPath"
            class="main-content"
          />
        </template>
      </router-view>
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