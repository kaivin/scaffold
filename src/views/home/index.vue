<script setup lang="ts">
import { ref } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from '@/components/HelloWorld.vue'
const value1 = ref("")
</script>
<template>
  <div class="home">
    <h1 class="demo">红色标题</h1>
    <img alt="Vue logo" src="@/assets/logo.png" />
    <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
    <el-button type="primary">Primary</el-button>
    <svg-icon icon-class="close"></svg-icon>
    <el-icon><kevin-zoom-out /></el-icon>
    <el-date-picker v-model="value1" type="date" placeholder="Pick a day"></el-date-picker>
  </div>
</template>

<style>
.home{
  text-align: center;
}
</style>
