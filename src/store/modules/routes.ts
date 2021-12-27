import { Module } from 'vuex'
import { Routes,cacheType } from "#/store";
import { constantRoutesArr, ascending, filterTree } from "@/router";

const routesModule: Module<Routes,any> = {
  namespaced: true,
  state: {
    // 静态路由
    constantRoutes: [],
    // 所有路由
    wholeRoutes: [],
    // 缓存页面keepAlive
    cachePageList: [],
  },
  mutations:{},
  actions: {
    // 获取所有路由（静态+动态获取部分）
    asyncActionRoutes({state},routes) {
      if(state.wholeRoutes.length > 0){
        return;
      }
      state.wholeRoutes = filterTree(
        ascending(ascending(constantRoutesArr).concat(routes))
      );
    },
    cacheOperate({state},{ mode, name }: cacheType) {
      switch (mode) {
        case "add":
          state.cachePageList.push(name);
          state.cachePageList = [...new Set(state.cachePageList)];
          break;
        case "delete":
          // eslint-disable-next-line no-case-declarations
          const delIndex = state.cachePageList.findIndex(v => v === name);
          delIndex !== -1 && state.cachePageList.splice(delIndex, 1);
          break;
      }
    },
    // 清空缓存页面
    clearAllCachePage({state}) {
      state.cachePageList = [];
    }
  }
};
export default routesModule