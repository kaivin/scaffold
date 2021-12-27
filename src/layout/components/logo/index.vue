<script setup lang="ts">
const title = "viteDemo"
</script>

<template>
  <div class="logo">
    <router-link :title="title" class="logo-link" to="/">
      <img class="logo-img" src="@/assets/logo.png" />
      <h1 class="logo-title">{{ title }}</h1>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
</style>
