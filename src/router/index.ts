import { Router,RouteComponent,createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from "@/utils/progress";
import store from "@/store";
import { storageSession, storageLocal } from "@/utils/storage";
import { openLink } from "@/utils/link";
import { split, uniqBy } from "lodash-es";

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
// 将所有静态路由导出
export const constantRoutesArr: Array<RouteComponent> = ascending(constantRoutes).concat(...remainingRouter);

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
    routes: filterTree(ascending(constantRoutes)).concat(...remainingRouter),
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
      console.log(data,"动态路由");
      if (data.length === 0) {
        store.dispatch('routes/asyncActionRoutes',data);
      } else {
        addAsyncRoutes(data,true)?.map((v: any) => {
          // 防止重复添加路由
          if (router.options.routes.findIndex(value => value.path === v.path) !== -1) {
            return;
          } else {
            // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
            router.options.routes.push(v);
            // 最终路由进行升序
            ascending(router.options.routes);
            router.addRoute(v.name, v);
            store.dispatch('routes/asyncActionRoutes',data);
          }
          resolve(router);
        });
      }
      router.addRoute({path: "/:pathMatch(.*)",redirect: "/error/404"});
    });
  });
};


// 路由白名单
const whiteList = ["/login"];

router.beforeEach((to, _from, next) => {
  console.log(_from,"路由");
  const userInfo = storageSession.getItem("userInfo");
  NProgress.start();
  const externalLink = to?.redirectedFrom?.fullPath;
  // @ts-ignore
  if (!externalLink) to.meta.title ? (document.title = to.meta.title) : "";
  if (userInfo&&userInfo?.accessToken) {
    if (_from?.name) {
      // 如果路由包含http 则是超链接 反之是普通路由
      if (externalLink && externalLink.includes("http")) {
        openLink(`http${split(externalLink, "http")[1]}`);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (store.state.routes.wholeRoutes.length === 0){
        initRouter().then((router: Router) => {
          router.push(to.path);
          // 刷新页面更新标签栏与页面路由匹配
          const localRoutes = storageLocal.getItem("responsive-routesInStorage");
          const optionsRoutes = router.options?.routes;
          const newLocalRoutes = [];
          optionsRoutes.forEach(ors => {
            localRoutes.forEach(lrs => {
              if (ors.path === lrs.parentPath) {
                newLocalRoutes.push(lrs);
              }
            });
          });
          storageLocal.setItem("responsive-routesInStorage",uniqBy(newLocalRoutes, "path"));
        });
      }
      next();
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