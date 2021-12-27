import Layout from "@/layout/index.vue";

const router = {
  path: "/nested",
  name: "Nested",
  component: Layout,
  redirect: "/nested/menu1/menu1-1",
  meta:{
    icon:'icon-xitongshiti',
    isComponent:false,
    sort:3,
    showLink:true,
    i18n:true,
    title: "message.hsmenus",
    keepAlive:true,
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
        i18n:true,
        title: "message.hsmenu1",
        keepAlive:true,
      },
      children: [
          {
              path: "/nested/menu1/menu1-1",
              component: () => import("@/views/nested/menu1/menu1-1/index.vue"),
              name: "Menu1-1",
              meta:{
                sort:1,
                showLink:true,
                i18n:true,
                title: "message.hsmenu1-1",
                keepAlive:true,
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
                i18n:true,
                title: "message.hsmenu1-2",
                keepAlive:true,
              },
              children: [
                  {
                      path: "/nested/menu1/menu1-2/menu1-2-1",
                      component: () => import("@/views/nested/menu1/menu1-2/menu1-2-1/index.vue"),
                      name: "Menu1-2-1",
                      meta:{
                        sort:1,
                        showLink:true,
                        i18n:true,
                        title: "message.hsmenu1-2-1",
                        keepAlive:true,
                      },
                  },
                  {
                      path: "/nested/menu1/menu1-2/menu1-2-2",
                      component: () => import("@/views/nested/menu1/menu1-2/menu1-2-2/index.vue"),
                      name: "Menu1-2-2",
                      meta:{
                        sort:2,
                        showLink:true,
                        i18n:true,
                        title: "message.hsmenu1-2-2",
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
                i18n:true,
                title: "message.hsmenu1-3",
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
          i18n:true,
          title: "message.hsmenu2",
        },
    }
  ]
};

export default router;