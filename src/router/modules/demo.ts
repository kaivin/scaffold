import Layout from "@/layout/index.vue";

const router = {
  path: "/demo",
  name: "demo",
  component: Layout,
  meta: {
    icon:'sgn-demo',
    i18n:true,
    title: "message.hsdemo",
    isComponent:false,
    showLink: true,
    sort:2,
    breadcrumb:false,
  },
  children: [
    {
      path: "/demo",
      name: "demo",
      component: () => import("@/views/demo/index.vue"),
      meta: {
        i18n:true,
        title: "message.hsdemo",
        showLink: true,
        sort:2,
        extraIcon:{
          svg:true,
          name:'sgn-new'
        }
      }
    }
  ]
};

export default router;