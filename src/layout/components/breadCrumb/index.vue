<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";
import { transformI18n } from "@/plugins/i18n";

const levelList = ref([]);
const route = useRoute();
const router = useRouter();
// 判断当前路由是否是默认页
const isInitPage = (route: RouteLocationMatched): boolean | string => {
  const name = route && (route.name as string);
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "home".toLocaleLowerCase();
};
// 组装面包屑导航
const getBreadcrumb = (): void => {
  // 过滤当前导航的层级，只有meta存在，且title也存在，才会在面包屑中展示该层导航
  let matched = route.matched.filter(item => item.meta && item.meta.title);
  const first = matched[0];
  // 如果第一级不是默认页，则需要将默认页加在第一级
  if (!isInitPage(first)) {
    matched = [
      {
        path: "/",
        parentPath: "/",
        meta: { title: "message.hshome", i18n: true }
      } as unknown as RouteLocationMatched
    ].concat(matched);
  }
  // 组装后的面包屑导航进行过滤，meta存在、且title存在，且breadcrumb字段为真，才能展示在面包屑导航中
  levelList.value = matched.filter(
    item => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
};
// 执行组装面包屑导航方法
getBreadcrumb();
// vue3写法，监听路由变化，并获取当前面包屑导航
watch(
  () => route.path,
  () => getBreadcrumb()
);
// 面包屑导航路由跳转事件
const handleLink = (item: RouteLocationMatched): any => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect.toString());
    return;
  }
  router.push(path);
};
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group appear name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ transformI18n(item.meta.title, item.meta.i18n) }}</span>
        <a v-else @click.prevent="handleLink(item)"> {{ transformI18n(item.meta.title, item.meta.i18n) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  font-size: 14px;
  line-height: 50px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
