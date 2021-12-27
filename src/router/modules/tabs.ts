import Layout from "@/layout/index.vue";

const tabsRouter = {
  path: "/tabs",
  name: "reTabs",
  component: Layout,
  redirect: "/tabs/index",
  meta: {
    icon: "icon-wenzhangfenlei",
    title: "message.hstabs",
    i18n: true,
    showLink: true,
    rank: 8
  },
  children: [
    {
      path: "/tabs/index",
      name: "reTabs",
      component: () => import("@/views/tabs/index/index.vue"),
      meta: {
        title: "message.hstabs",
        showLink: true,
        i18n: true
      }
    },
    {
      path: "/tabs/detail/:id",
      name: "tabDetail",
      component: () => import("@/views/tabs/tabDetail/index.vue"),
      meta: {
        title: "",
        showLink: false,
        i18n: false,
        dynamicLevel: 8,
        realPath: "/tabs/detail"
      }
    }
  ]
};

export default tabsRouter;
