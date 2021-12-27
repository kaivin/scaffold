﻿import Layout from "@/layout/index.vue";

const errorRouter = {
  path: "/error",
  name: "error",
  component: Layout,
  redirect: "/error/401",
  meta: {
    icon: "Position",
    isComponent:true,
    i18n:true,
    title: "message.hserror",
    showLink: true,
    sort: 7
  },
  children: [
    {
      path: "/error/401",
      name: "401",
      component: () => import("@/views/error/401/index.vue"),
      meta: {
        i18n:true,
        title: "message.hsfourZeroOne",
        showLink: true
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404/index.vue"),
      meta: {
        i18n:true,
        title: "message.hsfourZeroFour",
        showLink: true
      }
    }
  ]
};

export default errorRouter;
