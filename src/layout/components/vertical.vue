<script lang="ts">
import Logo from "./logo/index.vue"
import { defineComponent, ref,computed,reactive } from 'vue'
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
  created(){
    
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
<script setup lang="ts">
import { useStore } from 'vuex'
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const store = useStore()
const menuList = store.state.routes.wholeRoutes
console.log(menuList,"路由菜单")
const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignore
    return meta.activeMenu;
  }
  return path;
});

</script>
<template>
  <div class="sidebar-container">
    <Logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        unique-opened
        router
        :collapse-transition="false"
        mode="vertical"
        class="outer-most"
      >
        <sidebar-item
          v-for="route in menuList"
          :key="route.path"
          :item="route"
          class="outer-most"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>


<style lang="scss" scoped>
</style>

