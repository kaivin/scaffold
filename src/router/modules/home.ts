import Layout from "@/layout/index.vue";

const router = {
  path: "/",
  name: "layout",
  component: Layout,
  meta: {
    icon:'fa-house-damage',
    isComponent:true,
    showLink: true,
    i18n:true,
    sort:1
  },
  children: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/home/index.vue"),
      meta: {
        i18n:true,
        title: "message.hshome",
        keepAlive:true,
        showLink: true,
        sort:1
      }
    }
  ]
};

export default router;