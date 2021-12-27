import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { RouteComponent } from 'vue-router'
declare type cacheType = {
  mode: string;
  name?: RouteRecordName;
};
declare interface Routes {
  constantRoutes:RouteComponent;
  wholeRoutes:Array;
  cachePageList:Array;
}
declare type multiTagsType = {
  multiTags: Array;
  multiTagsCache:boolean;
};
declare type setType = {
  hiddenSideBar: boolean;
};
declare interface State {
  routes: Routes;
  multiTags: multiTagsType;
  settings:setType;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
