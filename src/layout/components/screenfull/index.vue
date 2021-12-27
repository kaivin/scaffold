<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
import Icon from "@/components/Icon/src/Icon.vue";
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <div class="screen-full" @click="toggle" :title="isFullscreen? $t('message.hsexitfullscreen') : $t('message.hsfullscreen')">
    <Icon :content="isFullscreen?'iconfont-quanpingsuoxiao':'iconfont-quanpingxianshi'" />
  </div>
</template>

<style lang="scss" scoped>
.screen-full {
  width: 36px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
