<script setup lang="ts">
import { PropType } from "vue";
import item from "./item.vue";
import { ListItem } from "./type";

const props = defineProps({
  list: {
    type: Array as PropType<Array<ListItem>>,
    default: () => []
  }
});
</script>

<template>
  <div v-if="props.list.length">
    <item
      v-for="(item, index) in props.list"
      :noticeItem="item"
      :key="index"
    ></item>
  </div>
  <el-empty v-else description="暂无数据"></el-empty>
</template>
