<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { onMounted,computed } from "vue";
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute();
const index = route.params?.id ?? -1;

function tagCache(index) {
  store.dispatch('multiTags/handleTags',{mode:"push", value:{
    path: `/tabs/detail/${index}`,
    parentPath: route.matched[0].path,
    name: "tabDetail",
    meta: {
      title: { zh: `No.${index} - 详情信息`, en: `No.${index} - DetailInfo` },
      showLink: false,
      i18n: false,
      dynamicLevel: 8,
      realPath: "/tabs/detail"
    }
  }});
}

tagCache(index)
</script>

<template>
  <div>{{ index }} - 详情页内容在此</div>
</template>

<style lang="scss" scoped></style>
