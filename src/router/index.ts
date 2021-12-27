import { Router,RouteComponent,createRouter, createWebHistory, RouteRecordRaw,RouteRecordNormalized,RouteMeta,RouteRecordName, } from 'vue-router'
import NProgress from "@/utils/progress";
import store from "@/store";
import { toRouteType } from "./types";
import { storageSession, storageLocal } from "@/utils/storage";
import { openLink } from "@/utils/link";
import { split, uniqBy } from "lodash-es";
import { getConfig } from "@/config";
import { transformI18n } from "@/plugins/i18n";
import { useTimeoutFn } from "@vueuse/core";
// 静态白名单路由
import remainingRouter from "./remaining";
// 静态非白名单路由
const modules = import.meta.glob("./modules/*.ts")
const constantRoutes:RouteRecordRaw[]=[]
for(const path in modules){
	const itemModule = await modules[path]()
	constantRoutes.push(itemModule.default)
}

import Layout from "@/layout/index.vue";
const modulesRoutes = import.meta.glob("/src/views/*/*/*.vue");
// 动态路由
import { getAsyncRoutes } from "@/api/routes";

// 按照路由中meta下的sort等级升序来排序路由
export const ascending = (arr:any) => {
    return arr.sort((a: any, b: any) => {
        return a?.meta?.sort - b?.meta?.sort;
    });
};
// 深拷贝
const objDeepCopy = function (source) {
  var sourceCopy = source instanceof Array ? [] : {};
  for (var item in source) {
      sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
  }
  return sourceCopy;
}
// 将所有静态路由导出
export const constantRoutesArr: Array<RouteComponent> = ascending(objDeepCopy(constantRoutes)).concat(...remainingRouter);

// 过滤meta中showLink为false的路由
export const filterTree = (data:any) => {
    const newTree = data.filter((v:any) => v.meta.showLink);
    newTree.forEach((v:any) => v.children && (v.children = filterTree(v.children)));
    return newTree;
};

// 过滤后端传来的动态路由 重新生成规范路由
export const addAsyncRoutes = (arrRoutes: Array<RouteComponent>,isRootRedirect:Boolean) => {
    if (!arrRoutes || !arrRoutes.length) return;
    arrRoutes.forEach((v: any) => {
      if (v.redirect&&isRootRedirect) {
        v.component = Layout;
      } else {
        v.component = modulesRoutes[`/src/views${v.path}/index.vue`];
      }
      if (v.children) {
        addAsyncRoutes(v.children,false);
      }
    });
    return arrRoutes;
  };

// 创建路由实例
export const router: Router = createRouter({
    history: createWebHistory(),
    routes: ascending(constantRoutes).concat(...remainingRouter),
    scrollBehavior(to, from, savedPosition) {
      return new Promise(resolve => {
        if (savedPosition) {
          return savedPosition;
        } else {
          if (from.meta.saveSrollTop) {
            const top: number =
              document.documentElement.scrollTop || document.body.scrollTop;
            resolve({ left: 0, top });
          }
        }
      });
    }
});

// 初始化路由
export const initRouter = () => {
  return new Promise(resolve => {
    getAsyncRoutes().then((data:any) => {
      if (data.data.length === 0) {
        store.dispatch('routes/asyncActionRoutes',data.data);
      } else {
        addAsyncRoutes(data.data,true)?.map((v: any) => {
          // 防止重复添加路由
          if (router.options.routes.findIndex(value => value.path === v.path) !== -1) {
            return;
          } else {
            // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
            router.options.routes.push(v);
            // 最终路由进行升序
            ascending(router.options.routes);
            router.addRoute(v.name, v);
            store.dispatch('routes/asyncActionRoutes',data.data);
          }
          resolve(router);
        });
      }
      router.addRoute({path: "/:pathMatch(.*)",redirect: "/error/404"});
    });
  });
};


// 处理缓存路由（添加、删除、刷新）
const handleAliveRoute = (matched: RouteRecordNormalized[], mode?: string) => {
  switch (mode) {
    case "add":
      matched.forEach(v => {
        store.dispatch('routes/cacheOperate',{ mode: "add", name: v.name });
      });
      break;
    case "delete":
      store.dispatch('routes/cacheOperate',{ mode: "delete", name: matched[matched.length - 1].name });
      break;
    default:
      store.dispatch('routes/cacheOperate',{ mode: "delete", name: matched[matched.length - 1].name });
      useTimeoutFn(() => {
        matched.forEach(v => {
          store.dispatch('routes/cacheOperate',{ mode: "add", name: v.name });
        });
      }, 100);
  }
};

// 通过path获取父级路径
const getParentPaths = (path: string, routes: RouteRecordRaw[]) => {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], path: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 找到path则返回父级path
      if (item.path.indexOf('/:')!=-1?item.path.split("/:")[0]:item.path === path) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, path, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, path, []);
};

// 查找对应path的路由信息
const findRouteByPath = (path: string, routes: RouteRecordRaw[]) => {
  let res = routes.find((item: { path: string }) => item.path.indexOf('/:')!=-1?item.path.split("/:")[0]:item.path == path);
  if (res) {
    return res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (
        routes[i].children instanceof Array &&
        routes[i].children.length > 0
      ) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return res;
        }
      }
    }
    return null;
  }
};

// 路由白名单
const whiteList = ["/login"];

router.beforeEach((to:toRouteType, _from, next) => {
  console.log(to,"当前路由");
  if(!store.state.multiTags.multiTagsCache){
    // 判断当前路由是否需要状态持久化
    if (to.meta?.keepAlive) {
      const newMatched = to.matched;
      handleAliveRoute(newMatched, "add");
      // 页面整体刷新和点击标签页刷新，需要将状态持久去除
      if (_from.name === undefined || _from.name === "redirect") {
        handleAliveRoute(newMatched);
      }
    }
  }
  const userInfo = storageSession.getItem("userInfo");
  NProgress.start();
  const externalLink = to?.redirectedFrom?.fullPath;
  // @ts-ignore
  if (!externalLink){
    if(to.meta.title){
      document.title = transformI18n(to.meta.title as string,to.meta.i18n as boolean) + " - " + transformI18n(getConfig().Title as string,true)
    }else{
      document.title = transformI18n(getConfig().Title as string,true)
    }
  };
  if (userInfo&&userInfo?.accessToken) {
    // 如果是从登录页面跳转的，或者name不存在（说明是浏览器刷新事件），则需要请求路由数据，再执行下一步
    if(_from?.path=="/login"||!_from?.name){
      if (store.state.routes.wholeRoutes.length === 0){
        initRouter().then((router: Router) => {
          console.log(router,"路由");
          // 标签持久化未开启的情况下
          if(!store.state.multiTags.multiTagsCache){
            const handTag = (
              path: string,
              parentPath: string,
              name: RouteRecordName,
              meta: RouteMeta
            ): void => {
              store.dispatch("multiTags/handleTags",{mode:"push",value:{
                path,
                parentPath,
                name,
                meta
              }});
            };
            if(to.meta?.realPath){
              const routes = router.options.routes;
              const { path } = to;
              const { realPath } = to.meta;
              const route = findRouteByPath(realPath, routes);
              const routePartent = getParentPaths(path, routes);
              handTag(
                path,
                routePartent[routePartent.length - 1],
                route.name,
                route.meta
              );
              return router.push(path);
            }else{
              const { path } = to;
              const routes = router.options.routes;
              const route = findRouteByPath(path, routes);
              const routePartent = getParentPaths(path, routes);
              handTag(
                route.path,
                routePartent[routePartent.length - 1],
                route.name,
                route.meta
              );
              return router.push(path);
            }
          }
          router.push(to.path);
          // 刷新页面更新标签栏与页面路由匹配
          const localRoutes = storageLocal.getItem("responsive-tags");
          const optionsRoutes = router.options?.routes[0].children;
          const newLocalRoutes = [];
          optionsRoutes.forEach(ors => {
            localRoutes.forEach(lrs => {
              if (ors.path === lrs.parentPath) {
                newLocalRoutes.push(lrs);
              }
            });
          });
          storageLocal.setItem("responsive-tags",uniqBy(newLocalRoutes, "path"));
        });
      }
      next();
    }else{
      // 如果是其他页面跳转的，且其他页面的name存在，则直接进行下一步
      if (_from?.name) {
        // 如果路由包含http 则是超链接 反之是普通路由
        if (externalLink && externalLink.includes("http")) {
          openLink(`http${split(externalLink, "http")[1]}`);
          NProgress.done();
        } else {
          next();
        }
      }
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
  
export default router