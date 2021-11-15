import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  name: "system",
  redirect: "/system/user",
  meta: {
    icon: "menu-system",
    title: "设置",
    showLink: true,
    sort: 6
  },
  children: [
    {
      path: "/system/user",
      name: "user",
      meta: {
        title: "个人中心",
        showLink: true,
        sort: 1
      }
    },
    {
      path: "/system/dict",
      name: "dict",
      meta: {
        title: "字典表",
        showLink: true,
        sort: 2
      }
    }
  ]
};


export default [
  {
    url: "/getAsyncRoutes",
    method: "post",
    response: () => {
      return {
        code: 200,
        data: [systemRouter]
      };
    }
  }
] as MockMethod[];
