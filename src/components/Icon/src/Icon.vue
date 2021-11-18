<script lang="ts">
export default {
  name: "Icon"
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  content: {
    type: String,
    default: ""
  },
  size: {
    type: Number,
    default: 18
  },
  width: {
    type: Number,
    default: 20
  },
  height: {
    type: Number,
    default: 20
  },
  color: {
    type: String,
    default: ""
  },
  svg: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

let text = ref("");

let className = computed(() => {
  if (props.content.indexOf("fa-") > -1) {
    return props.content.indexOf("fa ") === 0
      ? props.content
      : ["fa", props.content];
  } else if (props.content.indexOf("el-icon-") > -1) {
    return props.content;
  } else if (props.content.indexOf("iconfont-") > -1) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    return ["iconfont", "icon-"+props.content.split('iconfont-')[1]];
  }else {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    text.value = props.content;
    return "";
  }
});

let iconStyle = computed(() => {
  return (
    "font-size: " +
    props.size +
    "px; color: " +
    props.color +
    "; width: " +
    props.width +
    "px; height: " +
    props.height +
    "px; font-style: normal;"
  );
});

const clickHandle = () => {
  emit("click");
};
</script>

<template>
  <i
    v-if="!props.svg&&props.content.indexOf('sgn-')===-1"
    :class="className"
    :style="iconStyle"
    v-html="text"
    @click="clickHandle"
  ></i>
  <svg
    class="svg-icon"
    v-if="props.svg&&props.content.indexOf('sgn-')===-1"
    aria-hidden="true"
    :style="iconStyle"
    @click="clickHandle"
  >
    <use :xlink:href="`#${props.content}`" />
  </svg>
  <svg-icon v-if="props.svg&&props.content.indexOf('sgn-')>-1" :icon-class="props.content"></svg-icon>
</template>
