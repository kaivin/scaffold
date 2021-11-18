import Layout from "@/layout/index.vue";

const router = {
  path: "/demo",
  name: "demoLayout",
  component: Layout,
  meta: {
    icon:'sgn-demo',
    title: "demo小样",
    isComponent:false,
    showLink: true,
    sort:2,
  },
  children: [
    {
      path: "/demo",
      name: "demo",
      component: () => import("@/views/demo/index.vue"),
      meta: {
        title: "demo小样",
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