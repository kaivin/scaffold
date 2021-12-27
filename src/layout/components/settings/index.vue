<script setup lang="ts">
import { reactive,getCurrentInstance,nextTick,ref,unref,computed } from "vue";
import { useRouter } from "vue-router";
import { toggleClass } from "@/utils/operate";
import { storageLocal, storageSession } from "@/utils/storage";
import { emitter } from "@/utils/mitt";
import { useStore } from 'vuex'
import { themeColorsType } from "../../types";
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils";
const store = useStore();
const router = useRouter();
import panel from "./panel.vue";
const instance = getCurrentInstance().appContext.app.config.globalProperties.$storage;
const instanceConfig = getCurrentInstance().appContext.app.config.globalProperties.$config;
const settings = reactive({
  greyVal: instance.sets.grey,
  weakVal: instance.sets.weak,
  logoVal: instance.sets.sidebarLogo,
});
const tagSetting = reactive({
  tabsVal:instance.tagSetting.hideTabs,
  multiTagsCache:instance.tagSetting.multiTagsCache,
  keepAlive:instance.tagSetting.keepAlive,
  tagStyleMode:instance.tagSetting.tagStyleMode,
});
let layoutTheme = ref(storageLocal.getItem("responsive-layout")) || ref({frame: instanceConfig?.frame ?? "leftRight",theme: instanceConfig?.Theme ?? "default"});
if (unref(layoutTheme)) {
  let frame = unref(layoutTheme).frame;
  let theme = unref(layoutTheme).theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`
  });
  setLayoutModel(frame);
}

let themeColors = ref<Array<themeColorsType>>([
  // 道奇蓝（默认）
  { rgb: "27, 42, 71", themeColor: "default" },
  // 猩红色
  { rgb: "245, 34, 45", themeColor: "dusk" },
  // 橙红色
  { rgb: "250, 84, 28", themeColor: "volcano" },
  // 金色
  { rgb: "250, 219, 20", themeColor: "yellow" },
  // 绿宝石
  { rgb: "19, 194, 194", themeColor: "mingQing" },
  // 酸橙绿
  { rgb: "82, 196, 26", themeColor: "auroraGreen" },
  // 深粉色
  { rgb: "235, 47, 150", themeColor: "pink" },
  // 深紫罗兰色
  { rgb: "114, 46, 209", themeColor: "saucePurple" },
  // 亮白色
  { rgb: "255, 255, 255", themeColor: "light" },
  // 极致黑
  { rgb: "0, 0, 0", themeColor: "dark" },
]);
// 清空缓存并返回登录页
function onReset() {
  storageLocal.clear();
  storageSession.clear();
  toggleClass(false, "html-grey", document.querySelector("html"));
  toggleClass(false, "html-weakness", document.querySelector("html"));
  router.push("/login");
}

//初始化项目配置
nextTick(() => {
  settings.greyVal &&
    document.querySelector("html")?.setAttribute("class", "html-grey");
  settings.weakVal &&
    document.querySelector("html")?.setAttribute("class", "html-weakness");
});

// 灰色模式设置
const greyChange = (value): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  instance.sets = {
    grey: value,
    weak: instance.sets.weak,
    sidebarLogo: instance.sets.sidebarLogo,
  };
};

// 色弱模式设置
const weekChange = (value): void => {
  toggleClass(settings.weakVal,"html-weakness",document.querySelector("html"));
  instance.sets = {
    grey: instance.sets.grey,
    weak: value,
    sidebarLogo: instance.sets.sidebarLogo,
  };
};

// 侧边栏Logo
const logoChange = (value): void => {
  emitter.emit("logoChange", value);
  instance.sets = {
    grey: instance.sets.grey,
    weak: instance.sets.weak,
    sidebarLogo: value,
  };
}

// 标签栏
const tagsChange = (value) => {
  emitter.emit("tagViewsChange", value);
  instance.tagSetting = {
    hideTabs: value,
    multiTagsCache: instance.tagSetting.multiTagsCache,
    keepAlive: instance.tagSetting.keepAlive,
    tagStyleMode: instance.tagSetting.tagStyleMode,
  };
};

// 标签持久化
const multiTagsCacheChange = (value) => {
  store.dispatch("multiTags/multiTagsCacheChange",value);
  instance.tagSetting = {
    hideTabs: instance.tagSetting.hideTabs,
    multiTagsCache: value,
    keepAlive: instance.tagSetting.keepAlive,
    tagStyleMode: instance.tagSetting.tagStyleMode,
  };
};
// 标签页持久化
const keepAliveChange = (value) => {
  instance.tagSetting = {
    hideTabs: instance.tagSetting.hideTabs,
    multiTagsCache: instance.tagSetting.multiTagsCache,
    keepAlive: value,
    tagStyleMode: instance.tagSetting.tagStyleMode,
  };
};
// 标签风格
const tagStyleModeChange = (value) => {
  instance.tagSetting = {
    hideTabs: instance.tagSetting.hideTabs,
    multiTagsCache: instance.tagSetting.multiTagsCache,
    keepAlive: instance.tagSetting.keepAlive,
    tagStyleMode: value,
  };
};

// 设置框架布局模式
function setLayoutModel(frame: string) {
  store.dispatch("app/setFrame",frame);
  layoutTheme.value.frame = frame;
  window.document.body.setAttribute("frame", frame);
  instance.layout = { frame };
}

// 主题色 激活选择项
const getThemeColor = computed(() => {
  return current => {
    if (current === layoutTheme.value.theme&&layoutTheme.value.theme !== "light") {
      return "#fff";
    } else if (current === layoutTheme.value.theme &&layoutTheme.value.theme === "light"
    ) {
      return "#1d2b45";
    } else {
      return "transparent";
    }
  };
});
// 设置导航主题色
function setLayoutThemeColor(theme: string) {
  layoutTheme.value.theme = theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`
  });
  instance.layout = { frame: store.state.app.frame, theme };
}
</script>

<template>
  <panel>
    <el-divider>{{$t("message.hsFrameTitle")}}</el-divider>
    <ul class="frame-theme">
      <el-tooltip class="item" :content="$t('message.hsLeftRightLayout')" placement="bottom">
        <li
          :class="layoutTheme.frame === 'leftRight' ? 'isSelect' : ''"
          ref="leftRightRef"
          @click="setLayoutModel('leftRight')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>

      <el-tooltip class="item" :content="$t('message.hsTopBottomLayout')" placement="bottom">
        <li
          :class="layoutTheme.frame === 'topBottom' ? 'isSelect' : ''"
          ref="topBottomRef"
          @click="setLayoutModel('topBottom')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>

      <el-tooltip class="item" :content="$t('message.hsTopLeftRightLayout')" placement="bottom">
        <li
          :class="layoutTheme.frame === 'topLeftRight' ? 'isSelect' : ''"
          ref="topLeftRightRef"
          @click="setLayoutModel('topLeftRight')"
        >
          <div></div>
          <div></div>
          <div></div>
        </li>
      </el-tooltip>
    </ul>
    <el-divider>主题色</el-divider>
    <ul class="theme-color">
      <!-- <li v-for="(item, index) in themeColors" :key="index" :style="{ background: `rgb(${item.rgb})` }" @click="setLayoutThemeColor(item.themeColor)">
        <el-icon style="margin: 0.1em 0.1em 0 0" :size="17" :color="getThemeColor(item.themeColor)">
          <Check />
        </el-icon>
      </li> -->
    </ul>
    <el-divider>{{$t("message.hsInterfaceTitle")}}</el-divider>
    <ul class="setting">
      <li>
        <span>{{$t("message.hsGreyTitle")}}</span>
        <el-switch
          v-model="settings.greyVal"
          :inline-prompt="true"
          inactive-color="#a6a6a6"
          :active-text="$t('message.hsSwitchOn')"
          :inactive-text="$t('message.hsSwitchOff')"
          @change="greyChange"
        >
        </el-switch>
      </li>
      <li>
        <span>{{$t("message.hsColorWeaknessTitle")}}</span>
        <el-switch
          v-model="settings.weakVal"
          :inline-prompt="true"
          inactive-color="#a6a6a6"
          :active-text="$t('message.hsSwitchOn')"
          :inactive-text="$t('message.hsSwitchOff')"
          @change="weekChange"
        >
        </el-switch>
      </li>
      <li>
        <span>{{$t("message.hsSidebarLogoTitle")}}</span>
        <el-switch
          v-model="settings.logoVal"
          :inline-prompt="true"
          inactive-color="#a6a6a6"
          :active-text="$t('message.hsSwitchOn')"
          :inactive-text="$t('message.hsSwitchOff')"
          @change="logoChange"
        >
        </el-switch>
      </li>
    </ul>
    <el-divider>{{$t("message.hsTagsTitle")}}</el-divider>
    <ul class="setting">
      <li>
        <span>{{$t("message.hsTagsPane")}}</span>
        <el-switch
          v-model="tagSetting.tabsVal"
          :inline-prompt="true"
          inactive-color="#a6a6a6"
          :active-text="$t('message.hsSwitchOn')"
          :inactive-text="$t('message.hsSwitchOff')"
          @change="tagsChange"
        >
        </el-switch>
      </li>
      <li>
        <span>{{$t("message.hsTagsCache")}}</span>
        <el-switch
          v-model="tagSetting.multiTagsCache"
          :inline-prompt="true"
          inactive-color="#a6a6a6"
          :active-text="$t('message.hsSwitchOn')"
          :inactive-text="$t('message.hsSwitchOff')"
          @change="multiTagsCacheChange"
        >
        </el-switch>
      </li>
      <li>
        <span>{{$t("message.hsTagsPageCache")}}</span>
        <el-switch
          v-model="tagSetting.keepAlive"
          :inline-prompt="true"
          inactive-color="#a6a6a6"
          :active-text="$t('message.hsSwitchOn')"
          :inactive-text="$t('message.hsSwitchOff')"
          @change="keepAliveChange"
        >
        </el-switch>
      </li>
      <li>
        <span>{{$t("message.hsTagsStyleMode")}}</span>
        <el-radio-group v-model="tagSetting.tagStyleMode" size="small" @change="tagStyleModeChange">
          <el-radio label="card">{{$t("message.hsTagsStyleCard")}}</el-radio>
          <el-radio label="smart">{{$t("message.hsTagsStyleSmart")}}</el-radio>
        </el-radio-group>
      </li>
    </ul>
    <el-divider />
    <el-button type="danger" style="width: 90%; margin: 24px 15px" @click="onReset"><i class="fa fa-sign-out"></i>{{$t("message.hsClearCookieBackLogin")}}</el-button>
  </panel>
</template>

<style lang="scss" scoped>

</style>