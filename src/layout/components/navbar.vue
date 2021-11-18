<script setup lang="ts">
import Hamburger from "./hamBurger/index.vue";
import { useStore } from 'vuex'
const store = useStore()
const sidebar = store.state.app.sidebar
function toggleSideBar() {
  store.dispatch("app/toggleSideBar")
}
</script>

<template>
  <div class="navbar">
      <Hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

</style>
