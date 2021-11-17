import { Module } from 'vuex'
import { Routes } from "#/store";
import { constantRoutesArr, ascending, filterTree } from "@/router";

const routesModule: Module<Routes,any> = {
  namespaced: true,
  state: {
    // 静态路由
    constantRoutes: [],
    // 所有路由
    wholeRoutes: [],
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
  }
};
export default routesModule