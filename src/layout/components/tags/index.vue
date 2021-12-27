<script setup lang="ts">
import { ref,unref,watch,computed,ComputedRef,onBeforeMount,getCurrentInstance,nextTick } from "vue";
import { useStore } from 'vuex'
import { useRoute, useRouter } from "vue-router";
import { RouteConfigs,tagsViewsType } from "../../types";
import { transformI18n } from "@/plugins/i18n";
import { emitter } from "@/utils/mitt";
import { toggleClass, removeClass, hasClass } from "@/utils/operate";
import { templateRef, useResizeObserver,useDebounceFn } from "@vueuse/core";
const store = useStore();
const route = useRoute();
const router = useRouter();
const activeIndex = ref<number>(-1);
const instance = getCurrentInstance();
const containerDom = templateRef<HTMLElement | null>("containerDom", null);
// 获取被缓存的标签页数据
let multiTags: ComputedRef<Array<RouteConfigs>> = computed(() => {
  return store.state.multiTags?.multiTags;
});
let tagStyleMode = computed(()=>{
  return instance.appContext.app.config.globalProperties.$storage.tagSetting.tagStyleMode
});

const translateX = ref<number>(0);
const tabDom = templateRef<HTMLElement | null>("tabDom", null);
const scrollbarDom = templateRef<HTMLElement | null>("scrollbarDom", null);

const dynamicTagView = () => {
  const index = multiTags.value.findIndex(item => {
    return item.path === route.path;
  });
  moveToView(index);
};

watch([route], () => {
  activeIndex.value = -1;
  dynamicTagView();
});

useResizeObserver(
  scrollbarDom,
  useDebounceFn(() => {
    dynamicTagView();
  }, 200)
);

const tabNavPadding = 10;
const moveToView = (index: number): void => {
  if (!instance.refs["dynamic" + index]) {
    return;
  }
  const tabItemEl = instance.refs["dynamic" + index];
  const tabItemElOffsetLeft = (tabItemEl as HTMLElement).offsetLeft;
  const tabItemOffsetWidth = (tabItemEl as HTMLElement).offsetWidth;
  // 标签页导航栏可视长度（不包含溢出部分）
  const scrollbarDomWidth = scrollbarDom.value
    ? scrollbarDom.value.offsetWidth
    : 0;
  // 已有标签页总长度（包含溢出部分）
  const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;

  if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
    translateX.value = 0;
  } else if (tabItemElOffsetLeft < -translateX.value) {
    // 标签在可视区域左侧
    translateX.value = -tabItemElOffsetLeft + tabNavPadding;
  } else if (
    tabItemElOffsetLeft > -translateX.value &&
    tabItemElOffsetLeft + tabItemOffsetWidth <
      -translateX.value + scrollbarDomWidth
  ) {
    // 标签在可视区域
    translateX.value = Math.min(
      0,
      scrollbarDomWidth -
        tabItemOffsetWidth -
        tabItemElOffsetLeft -
        tabNavPadding
    );
  } else {
    // 标签在可视区域右侧
    translateX.value = -(
      tabItemElOffsetLeft -
      (scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth)
    );
  }
};

const handleScroll = (offset: number): void => {
  const scrollbarDomWidth = scrollbarDom.value
    ? scrollbarDom.value?.offsetWidth
    : 0;
  const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;
  if (offset > 0) {
    translateX.value = Math.min(0, translateX.value + offset);
  } else {
    if (scrollbarDomWidth < tabDomWidth) {
      if (translateX.value >= -(tabDomWidth - scrollbarDomWidth)) {
        translateX.value = Math.max(
          translateX.value + offset,
          scrollbarDomWidth - tabDomWidth
        );
      }
    } else {
      translateX.value = 0;
    }
  }
};

// 声明标签页操作栏数据
const tagsViews = ref<Array<tagsViewsType>>([
  {
    icon: 'sgn-refresh',
    text: "message.hsreload",
    divided: false,
    disabled: false,
    show: true
  },
  {
    icon: 'sgn-close',
    text: "message.hscloseCurrentTab",
    divided: false,
    disabled: true,
    show: true
  },
  {
    icon: 'sgn-close_left',
    text: "message.hscloseLeftTabs",
    divided: true,
    disabled: true,
    show: true
  },
  {
    icon: 'sgn-close_right',
    text: "message.hscloseRightTabs",
    divided: false,
    disabled: true,
    show: true
  },
  {
    icon: 'sgn-close_other',
    text: "message.hscloseOtherTabs",
    divided: true,
    disabled: true,
    show: true
  },
  {
    icon: 'sgn-close_all',
    text: "message.hscloseAllTabs",
    divided: false,
    disabled: true,
    show: true
  }
]);

let visible = ref(false);
let buttonLeft = ref(0);
let buttonTop = ref(0);
// 当前右键选中的路由信息
let currentSelect = ref({});

// 重新加载
function onFresh() {
  // 执行刷新按钮的动画效果
  toggleClass(true, "refresh-button", document.querySelector(".rotate"));
  const { fullPath } = unref(route);
  // 替换路由，到重定向页面，重定向页面会自动跳转到需要跳转的页面
  router.replace({
    path: "/redirect" + fullPath
  });
  // 移除刷新按钮的动画效果
  setTimeout(() => {
    removeClass(document.querySelector(".rotate"), "refresh-button");
  }, 600);
}
// 删除动态标签页
function deleteDynamicTag(obj: any, current: any, tag?: string) {
  // 获取当前所在标签页在标签页缓存数据中的索引值
  let valueIndex: number = multiTags.value.findIndex((item: any) => {
    return item.path === obj.path;
  });
  // 对标签页缓存数据进行操作的封装方法
  const spliceRoute = (startIndex?: number, length?: number, other?: boolean): void => {
    if (other) {
      // 调用标签页数据的状态管理，将首页和当前标签页作为数据传递
      store.dispatch("multiTags/handleTags",{mode:"equal",value: [
        {
          path: "/",
          parentPath: "/",
          meta: {
            title: "message.hshome",
            i18n: true,
            icon: "fa-house-damage",
            showLink: true
          }
        },
        obj
      ]});
    }else{
      // 当不是关闭其他标签页事件时，通过索引去修改标签页缓存数据
      store.dispatch("multiTags/handleTags",{mode:"splice",value:'',position:{
        startIndex,
        length
      }});
    }
  };
  // 根据当前tag类型，执行标签页缓存数据操作方法
  if (tag === "other") {
    spliceRoute(1, 1, true);
  } else if (tag === "left") {
    spliceRoute(1, valueIndex - 1);
  } else if (tag === "right") {
    spliceRoute(valueIndex + 1, multiTags.value.length);
  } else {
    // 从当前匹配到的路径中删除
    spliceRoute(valueIndex, 1);
  }
  // 在标签页缓存数据处理过后，提取数组中最后一个路由信息
  store.dispatch("multiTags/handleTags",{mode:"slice"}).then(res=>{
    // 如果事件依据的路由就是当前激活tag
    if (current === route.path) {
      // 如果事件依据是删除左侧标签页，而事件依据的标签页又是当前激活标签页，则不需要路由跳转，直接返回即可
      if (tag === "left") return;
      // 自动切换到最后一个tag
      nextTick(() => {
        router.push({
          path: res[0].path
        });
      });
    } else {
      // 如果事件依据的路由不是当前激活路由，标签页缓存数据不存在了，则直接返回
      if (!multiTags.value.length) return;
      // 将当前激活的路由找出
      let isHasActiveTag = multiTags.value.some(item => {
        return item.path === route.path;
      });
      // 如果当前激活的路由不存在（被删除）则跳转到最后一个缓存的标签页
      !isHasActiveTag &&
        router.push({
          path: res[0].path
        });
    }
  });
  
}
// 标签页上的关闭按钮点击事件
function deleteMenu(item, tag?: string) {
  deleteDynamicTag(item, item.path, tag);
}
// 标签页的点击事件，右键及右侧下拉的点击事件
function onClickDrop(key, item, selectRoute?: RouteConfigs) {
  if (item && item.disabled) return;
  // 当前路由信息
  switch (key) {
    case 0:
      // 重新加载
      onFresh();
      break;
    case 1:
      // 关闭当前标签页
      selectRoute
        ? deleteMenu({
            path: selectRoute.path,
            meta: selectRoute.meta,
            name: selectRoute.name
          })
        : deleteMenu({ path: route.path, meta: route.meta });
      break;
    case 2:
      // 关闭左侧标签页
      selectRoute
        ? deleteMenu(
            {
              path: selectRoute.path,
              meta: selectRoute.meta
            },
            "left"
          )
        : deleteMenu({ path: route.path, meta: route.meta }, "left");
      break;
    case 3:
      // 关闭右侧标签页
      selectRoute
        ? deleteMenu(
            {
              path: selectRoute.path,
              meta: selectRoute.meta
            },
            "right"
          )
        : deleteMenu({ path: route.path, meta: route.meta }, "right");
      break;
    case 4:
      // 关闭其他标签页
      selectRoute
        ? deleteMenu(
            {
              path: selectRoute.path,
              meta: selectRoute.meta
            },
            "other"
          )
        : deleteMenu({ path: route.path, meta: route.meta }, "other");
      break;
    case 5:
      // 关闭全部标签页
      store.dispatch("multiTags/handleTags",{mode:"splice",value: '',position:{
        startIndex: 1,
        length: multiTags.value.length
      }});
      router.push("/");
      break;
  }
  setTimeout(() => {
    // 重新渲染点击事件的状态
    showMenuModel(route.fullPath);
  });
}

// 触发右键中菜单的点击事件
function selectTag(key, item) {
  onClickDrop(key, item, currentSelect.value);
}
// 右键菜单隐藏
function closeMenu() {
  visible.value = false;
}
// 右键菜单的菜单项是否显示
function showMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach(v => {
    tagsViews.value[v].show = value;
  });
}
// 菜单的菜单项是否被禁用
function disabledMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach(v => {
    tagsViews.value[v].disabled = value;
  });
}

// 检查当前右键的菜单两边是否存在别的菜单，如果左侧的菜单是首页，则不显示关闭左侧标签页，如果右侧没有菜单，则不显示关闭右侧标签页
function showMenuModel(currentPath: string, refresh = false) {
  let allRoute = multiTags.value;
  let routeLength = multiTags.value.length;
  // currentIndex为1时，左侧的菜单是首页，则不显示关闭左侧标签页
  let currentIndex = allRoute.findIndex(v => v.path === currentPath);
  // 如果currentIndex等于routeLength-1，右侧没有菜单，则不显示关闭右侧标签页
  showMenus(true);

  if (refresh) {
    tagsViews.value[0].show = true;
  }

  if (currentIndex === 1 && routeLength !== 2) {
    // 左侧的菜单是首页，右侧存在别的菜单
    tagsViews.value[2].show = false;
    Array.of(1, 3, 4, 5).forEach(v => {
      tagsViews.value[v].disabled = false;
    });
    tagsViews.value[2].disabled = true;
  } else if (currentIndex === 1 && routeLength === 2) {
    disabledMenus(false);
    // 左侧的菜单是首页，右侧不存在别的菜单
    Array.of(2, 3, 4).forEach(v => {
      tagsViews.value[v].show = false;
      tagsViews.value[v].disabled = true;
    });
  } else if (routeLength - 1 === currentIndex && currentIndex !== 0) {
    // 当前路由是所有路由中的最后一个
    tagsViews.value[3].show = false;
    Array.of(1, 2, 4, 5).forEach(v => {
      tagsViews.value[v].disabled = false;
    });
    tagsViews.value[3].disabled = true;
  } else if (currentIndex === 0 || currentPath === "/redirect/") {
    // 当前路由为首页
    disabledMenus(true);
  } else {
    disabledMenus(false);
  }
}
// 打开右键菜单
function openMenu(tag, e) {
  closeMenu();
  if (tag.path === "/") {
    // 右键菜单为首页，只显示刷新
    showMenus(false);
    tagsViews.value[0].show = true;
  } else if (route.path !== tag.path) {
    // 右键菜单不匹配当前路由，隐藏刷新
    tagsViews.value[0].show = false;
    showMenuModel(tag.path);
  } else if (
    // eslint-disable-next-line no-dupe-else-if
    multiTags.value.length === 2 &&
    route.path !== tag.path
  ) {
    showMenus(true);
    // 只有两个标签时不显示关闭其他标签页
    tagsViews.value[4].show = false;
  } else if (route.path === tag.path) {
    // 右键当前激活的菜单
    showMenuModel(tag.path, true);
  }

  currentSelect.value = tag;
  const menuMinWidth = 105;
  const offsetLeft = unref(containerDom).getBoundingClientRect().left;
  const offsetWidth = unref(containerDom).offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 5;
  if (left > maxLeft) {
    buttonLeft.value = maxLeft;
  } else {
    buttonLeft.value = left;
  }
  store.state.settings.hiddenSideBar
    ? (buttonTop.value = e.clientY)
    : (buttonTop.value = e.clientY - 40);
  setTimeout(() => {
    visible.value = true;
  }, 10);
}

// 触发tags标签切换
function tagOnClick(item) {
  router.push({
    path: item?.path
  });
  // 重新判断点击事件的状态
  showMenuModel(item?.path);
}
// 鼠标移入标签页状态
function onMouseenter(item, index) {
  if (index) activeIndex.value = index;
  if (tagStyleMode.value === "card") {
    if (hasClass(instance.refs["dynamic" + index], "card-active")) return;
    toggleClass(true, "card-in", instance.refs["dynamic" + index]);
    toggleClass(false, "card-out", instance.refs["dynamic" + index]);
  } else {
    if (hasClass(instance.refs["schedule" + index], "schedule-active")) return;
    toggleClass(true, "schedule-in", instance.refs["schedule" + index]);
    toggleClass(false, "schedule-out", instance.refs["schedule" + index]);
  }
}

// 鼠标移出标签页状态
function onMouseleave(item, index) {
  activeIndex.value = -1;
  if (tagStyleMode.value === "card") {
    if (hasClass(instance.refs["dynamic" + index], "card-active")) return;
    toggleClass(false, "card-in", instance.refs["dynamic" + index]);
    toggleClass(true, "card-out", instance.refs["dynamic" + index]);
  } else {
    if (hasClass(instance.refs["schedule" + index], "schedule-active")) return;
    toggleClass(false, "schedule-in", instance.refs["schedule" + index]);
    toggleClass(true, "schedule-out", instance.refs["schedule" + index]);
  }
}
// 监听右键菜单的显示隐藏
watch(
  () => visible.value,
  val => {
    if (val) {
      document.body.addEventListener("click", closeMenu);
    } else {
      document.body.removeEventListener("click", closeMenu);
    }
  }
);
// 视窗放大还原
function onFullScreen(){
  store.state.settings.hiddenSideBar?store.dispatch('settings/changeSetting',{key:"hiddenSideBar",value:false}):store.dispatch('settings/changeSetting',{key:"hiddenSideBar",value:true})
}
// 动态获取当前的路由标签页信息
function dynamicRouteTag(value: string, parentPath: string): void {
  const hasValue = multiTags.value.some(item => {
    return item.path === value;
  });
  // 递归寻找选中的路由，并缓存到标签页信息中
  function concatPath(arr: object[], value: string, parentPath: string) {
    if (!hasValue) {
      arr.forEach((arrItem: any) => {
        let pathConcat = parentPath + arrItem.path;
        if (arrItem.path === value || pathConcat === value) {
          store.dispatch("multiTags/handleTags",{mode:"push",value:{
            path: value,
            parentPath: `/${parentPath.split("/")[1]}`,
            meta: arrItem.meta,
            name: arrItem.name
          }});
        } else {
          if (arrItem.children && arrItem.children.length > 0) {
            concatPath(arrItem.children, value, parentPath);
          }
        }
      });
    }
  }
  concatPath(router.options.routes, value, parentPath);
}
onBeforeMount(() => {
  if (!instance) return;

  // 根据当前路由初始化操作标签页的禁用状态
  showMenuModel(route.fullPath);  

  //  接收侧边栏切换传递过来的参数
  emitter.on("changLayoutRoute", ({ indexPath, parentPath }) => {
    dynamicRouteTag(indexPath, parentPath);
    setTimeout(() => {
      showMenuModel(indexPath);
    });
  });
});
</script>

<template>
  <div ref="containerDom" class="tags-view">
    <!-- 左滑动 -->
    <i class="ri-arrow-left-s-line" @click="handleScroll(200)"></i>
    <!-- 标签页 -->
    <div ref="scrollbarDom" class="scroll-container">
      <div class="tab"
        ref="tabDom"
        :style="{ transform: `translateX(${translateX}px)` }">
        <div
          :ref="'dynamic' + index"
          v-for="(item, index) in multiTags"
          :key="index"
          :class="[
            'scroll-item is-closable',
            $route.path === item.path ? 'is-active' : '',
            $route.path === item.path && tagStyleMode ==='card'
              ? 'card-active'
              : ''
          ]"
          @contextmenu.prevent="openMenu(item, $event)"
          @mouseenter.prevent="onMouseenter(item, index)"
          @mouseleave.prevent="onMouseleave(item, index)"
          @click="tagOnClick(item)"
        >
          <router-link :to="item.path">{{
            transformI18n(item.meta.title, item.meta.i18n)
          }}</router-link>
          <el-icon v-if="($route.path === item.path && index !== 0) || (index === activeIndex && index !== 0)"
            @click.stop="deleteMenu(item)" class="el-icon-close">
            <CloseBold />
          </el-icon>
          <div
            :ref="'schedule' + index"
            v-if="tagStyleMode !== 'card'"
            :class="[$route.path === item.path ? 'schedule-active' : '']"
          ></div>
        </div>
      </div>
    </div>
    <!-- 右滑动 -->
    <i class="ri-arrow-right-s-line" @click="handleScroll(-200)"></i>
    <!-- 右键菜单按钮 -->
    <transition name="el-zoom-in-top">
      <ul
        v-show="visible"
        :key="Math.random()"
        :style="{ left: buttonLeft + 'px', top: buttonTop + 'px' }"
        class="contextmenu"
      >
        <div
          v-for="(item, key) in tagsViews"
          :key="key"
          style="display: flex; align-items: center"
        >
          <li v-if="item.show" @click="selectTag(key, item)">
            <i class="svg-i"><svg-icon :icon-class="item.icon" /></i>
            {{ $t(item.text) }}
          </li>
        </div>
      </ul>
    </transition>
    <!-- 右侧功能按钮 -->
    <ul class="right-button">
      <li><el-icon :title="$t('message.hsrefreshRoute')" class="el-icon-refresh-right rotate" @click="onFresh"><RefreshRight /></el-icon></li>
      <li>
        <el-dropdown trigger="click" placement="bottom-end">
          <el-icon><ArrowDown /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in tagsViews"
                :key="key"
                :divided="item.divided"
                :disabled="item.disabled"
                @click="onClickDrop(key, item)">
                <i class="svg-i"><svg-icon :icon-class="item.icon" /></i>
                {{ $t(item.text) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li v-on:click="onFullScreen"><i class="svg-i"><svg-icon :icon-class="store.state.settings.hiddenSideBar?'sgn-exit_screen':'sgn-full_screen'" /></i></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
</style>