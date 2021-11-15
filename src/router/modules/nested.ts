import Layout from "@/layout/index.vue";

const router = {
  path: "/nested",
  name: "Nested",
  component: Layout,
  redirect: "/nested/menu1/menu1-1",
  meta:{
    sort:3,
    showLink:true,
    title:"嵌套路由"
  },
  children:[
    {
      path: "/nested/menu1",
      component: () => import("@/views/nested/menu1/index.vue"),
      name: "Menu1",
      redirect: "/nested/menu1/menu1-1",
      meta:{
        sort:1,
        showLink:true,
        title:"嵌套路由1"
      },
      children: [
          {
              path: "/nested/menu1/menu1-1",
              component: () => import("@/views/nested/menu1/menu1-1/index.vue"),
              name: "Menu1-1",
              meta:{
                sort:1,
                showLink:true,
                title:"嵌套路由1-1"
              },
          },
          {
              path: "/nested/menu1/menu1-2",
              component: () => import("@/views/nested/menu1/menu1-2/index.vue"),
              name: "Menu1-2",
              redirect: "/nested/menu1/menu1-2/menu1-2-1",
              meta:{
                sort:2,
                showLink:true,
                title:"嵌套路由1-2"
              },
              children: [
                  {
                      path: "/nested/menu1/menu1-2/menu1-2-1",
                      component: () => import("@/views/nested/menu1/menu1-2/menu1-2-1/index.vue"),
                      name: "Menu1-2-1",
                      meta:{
                        sort:1,
                        showLink:true,
                        title:"嵌套路由1-2-1"
                      },
                  },
                  {
                      path: "/nested/menu1/menu1-2/menu1-2-2",
                      component: () => import("@/views/nested/menu1/menu1-2/menu1-2-2/index.vue"),
                      name: "Menu1-2-2",
                      meta:{
                        sort:2,
                        showLink:true,
                        title:"嵌套路由1-2-2"
                      },
                  }
              ]
          },
          {
              path: "/nested/menu1/menu1-3",
              component: () => import("@/views/nested/menu1/menu1-3/index.vue"),
              name: "Menu1-3",
              meta:{
                sort:3,
                showLink:true,
                title:"嵌套路由1-3"
              },
          }
      ]
    },
    {
        path: "/nested/menu2",
        name: "Menu2",
        component: () => import("@/views/nested/menu2/index.vue"),
        meta:{
          sort:2,
          showLink:true,
          title:"嵌套路由2"
        },
    }
  ]
};

export default router;