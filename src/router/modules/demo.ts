import Layout from "@/layout/index.vue";

const router = {
  path: "/demo",
  name: "demoLayout",
  component: Layout,
  meta: {
    title: "demo小样",
    showLink: true,
    sort:2
  },
  children: [
    {
      path: "/demo",
      name: "demo",
      component: () => import("@/views/demo/index.vue"),
      meta: {
        title: "demo小样",
        showLink: true,
        sort:1
      }
    }
  ]
};

export default router;