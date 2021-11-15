<script lang="ts">
import Logo from "./logo/index.vue"
import { defineComponent, ref } from 'vue'
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons'

export default defineComponent({
  components: {
    Location,
    Document,
    Setting,
    IconMenu,
    Logo,
  },
  setup() {
    const isCollapse = ref(false)
    const handleOpen = (key:any, keyPath:any) => {
      console.log(key, keyPath)
    }
    const handleClose = (key:any, keyPath:any) => {
      console.log(key, keyPath)
    }
    return {
      isCollapse,
      handleOpen,
      handleClose,
    }
  },
  methods:{
    routerLink(e:string){
      console.log(e);
      this.$router.push({path:e});
    }
  }
})
</script>

<template>
  <div class="sidebar-container">
    <Logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item class="submenu-title-noDropdown" index="1" v-on:click="routerLink('/')">
          <el-icon><icon-menu /></el-icon>
          <template #title>home</template>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-sub-menu index="2-1">
            <template #title>
              <span>Navigator two</span>
            </template>
            <el-menu-item index="2-1-1" v-on:click="routerLink('/nested/menu1/menu1-1')">item one</el-menu-item>
            <el-sub-menu index="2-1-2">
              <template #title>
                <span>Navigator three</span>
              </template>
              <el-menu-item index="2-1-2-1" v-on:click="routerLink('/nested/menu1/menu1-2/menu1-2-1')">item one</el-menu-item>
              <el-menu-item index="2-1-2-2" v-on:click="routerLink('/nested/menu1/menu1-2/menu1-2-2')">item two</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2-1-3" v-on:click="routerLink('/nested/menu1/menu1-3')">item three</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2-2" v-on:click="routerLink('/nested/menu2')">item four</el-menu-item>
        </el-sub-menu>
        <el-menu-item class="submenu-title-noDropdown" index="3" v-on:click="routerLink('/demo')">
          <el-icon><setting /></el-icon>
          <template #title>demo</template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>


<style lang="scss" scoped>
</style>

