import Layout from "@/layout/index.vue";

const errorRouter = {
  path: "/error",
  name: "error",
  component: Layout,
  redirect: "/error/401",
  meta: {
    icon: "el-icon-position",
    title: "错误页面",
    showLink: true,
    rank: 7
  },
  children: [
    {
      path: "/error/401",
      name: "401",
      component: () => import("@/views/error/401/index.vue"),
      meta: {
        title: "401",
        showLink: true
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404/index.vue"),
      meta: {
        title: "404",
        showLink: true
      }
    }
  ]
};

export default errorRouter;
