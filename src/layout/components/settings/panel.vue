<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { emitter } from "@/utils/mitt";

let show = ref<Boolean>(false);
const target = ref(null);
onClickOutside(target, event => {
  if (event.clientX > target.value.offsetLeft) return;
  show.value = false;
});

emitter.on("openPanel", () => {
  show.value = true;
});
</script>

<template>
  <div :class="{ show: show }" class="right-panel-container">
    <div class="right-panel-background" />
    <div ref="target" class="right-panel">
      <div class="right-panel-items">
        <div class="project-configuration">
          <h3>{{$t("message.hsSettingPanelTitle")}}</h3>
          <el-icon :title="$t('message.hsCloseSettingPanel')" class="icon-close" @click="show = !show">
            <Close />
          </el-icon>
        </div>
        <div style="border-bottom: 1px solid #dcdfe6"></div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
