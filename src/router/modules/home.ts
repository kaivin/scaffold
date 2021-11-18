import Layout from "@/layout/index.vue";

const router = {
  path: "/",
  name: "layout",
  component: Layout,
  meta: {
    icon:'fa-house-damage',
    isComponent:true,
    showLink: true,
    sort:1
  },
  children: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "首页",
        showLink: true,
        sort:1
      }
    }
  ]
};

export default router;