import Layout from "@/layout/index.vue";
const remainingRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      i18n:true,
      title: "message.hslogin",
      showLink: false,
      sort: 101
    }
  },
  {
    path: "/redirect",
    name: "redirect",
    component: Layout,
    meta: {
      showLink: false,
      rank: 104
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "redirect",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  }
];

export default remainingRouter;
