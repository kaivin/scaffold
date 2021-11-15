
const remainingRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      sort: 101
    }
  },
];

export default remainingRouter;
