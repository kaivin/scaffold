<script setup lang="ts">

import { ref } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'
import Icon from "@/components/Icon/src/Icon.vue";
import { findIconReg } from "@/components/Icon";
const value1 = ref("")
</script>

<template>
  <div class="home">
    <h1 class="demo">红色标题</h1>
    <img alt="Vue logo" src="@/assets/logo.png" />
    <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
    <el-button type="primary">Primary</el-button>
    <el-icon><component :is="findIconReg('fa-address-book')"></component></el-icon>
    <Icon :content="'fa-address-book'"/>
    <Icon :svg="true" :content="'icon-star'"/>
    <Icon :content="'iconfont-star'"/>
    <el-icon><component :is="findIconReg('HomeFilled')"></component></el-icon>
    <Icon :content="'el-icon-user'"/>
    <Icon :svg="true" :content="'sgn-close'"/>
    <svg-icon icon-class="sgn-close"></svg-icon>
    <el-date-picker v-model="value1" type="date" placeholder="Pick a day"></el-date-picker>
  </div>
</template>

<style>
.home{
  text-align: center;
}
</style>
