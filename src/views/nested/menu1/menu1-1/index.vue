<script lang="ts">
export default {
  name: "Menu1-1"
};
</script>
<script setup lang="ts">
import { ref } from 'vue'
const value1 = ref("")
</script>
<template>
  <el-date-picker v-model="value1" type="date" :placeholder="$t('message.hsDatePlaceholder')"></el-date-picker>
</template>

<style>
</style>