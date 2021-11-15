<script setup lang="ts">
import { useStore } from 'vuex'
const store = useStore()
const count = store.state.count
</script>
<template>
  <h2>vuex中的count：{{count}}</h2>
</template>

<style>
</style>
