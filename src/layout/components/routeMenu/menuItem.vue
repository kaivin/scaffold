<script lang="ts">
export default {
  name: "menu-item"
};
</script>
<script setup lang="ts">
import path from 'path-browserify'
import { PropType, ref, nextTick } from "vue";
import { childrenType } from "../../types";
import Icon from "@/components/Icon/src/Icon.vue";
import { findIconReg } from "@/components/Icon";
import { transformI18n } from "@/plugins/i18n";

const props = defineProps({
  item: {
    type: Object as PropType<childrenType>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
});

const onlyOneChild: childrenType = ref(null);
// 存放菜单是否存在showTooltip属性标识
const hoverMenuMap = new WeakMap();
// 存储菜单文本dom元素
const menuTextRef = ref(null);

function hoverMenu(key) {
  // 如果当前菜单showTooltip属性已存在，退出计算
  if (hoverMenuMap.get(key)) return;

  nextTick(() => {
    // 如果文本内容的整体宽度大于其可视宽度，则文本溢出
    menuTextRef.value?.scrollWidth > menuTextRef.value?.clientWidth
      ? Object.assign(key, {
          showTooltip: true
        })
      : Object.assign(key, {
          showTooltip: false
        });
    hoverMenuMap.set(key, true);
  });
}

function hasOneShowingChild(children: childrenType[] = [],parent: childrenType) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath)) {
    return props.basePath + "/" + routePath;
  } else {
    return path.resolve(props.basePath, routePath);
  }
}
</script>

<template>
  <template v-if="hasOneShowingChild(props.item.children, props.item)&&(!onlyOneChild.children || onlyOneChild.noShowingChildren)">
    <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }" >
      <el-icon v-show="props.item.meta.icon">
        <component v-if="onlyOneChild.meta.isComponent||props.item.meta.isComponent" :is="findIconReg(onlyOneChild.meta.icon ||(props.item.meta && props.item.meta.icon))"></component>
        <Icon v-else :svg="true" :content="`${onlyOneChild.meta.icon ||(props.item.meta && props.item.meta.icon)}`" />
      </el-icon>
      <template #title>
        <div class="menu-title">
          <el-tooltip placement="top" :offset="-10" :disabled="!onlyOneChild.showTooltip">
            <template #content>
              {{ transformI18n(onlyOneChild.meta.title, onlyOneChild.meta.i18n) }}
            </template>
            <span ref="menuTextRef" @mouseover="hoverMenu(onlyOneChild)">{{ transformI18n(onlyOneChild.meta.title, onlyOneChild.meta.i18n) }}</span>
          </el-tooltip>
        </div>
        <el-icon class="tag-icon" v-if="onlyOneChild.meta.extraIcon">
          <Icon :svg="onlyOneChild.meta.extraIcon.svg ? true : false" :content="`${onlyOneChild.meta.extraIcon.name}`" />
        </el-icon>
      </template>
    </el-menu-item>
  </template>
  <el-sub-menu v-else ref="subMenu" :index="resolvePath(props.item.path)" popper-append-to-body>
    <template #title>
      <el-icon v-show="props.item.meta.icon">
        <component v-if="props.item.meta.isComponent" :is="findIconReg(props.item.meta && props.item.meta.icon)"></component>
        <Icon v-else :svg="true" :content="`${props.item.meta && props.item.meta.icon}`" />
      </el-icon>
      <el-tooltip placement="top" :offset="-10" :disabled="!props.item.showTooltip" >
        <template #content>{{ transformI18n(props.item.meta.title, props.item.meta.i18n) }}</template>
        <div ref="menuTextRef" class="menu-title" @mouseover="hoverMenu(props.item)" >
          <span>{{ transformI18n(props.item.meta.title, props.item.meta.i18n) }}</span>
        </div>
      </el-tooltip>
      <el-icon class="tag-icon" v-if="props.item.meta.extraIcon">
        <Icon :svg="props.item.meta.extraIcon.svg ? true : false" :content="`${props.item.meta.extraIcon.name}`" />
      </el-icon>
    </template>
    <menu-item
      v-for="child in props.item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>