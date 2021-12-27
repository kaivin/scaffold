import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/login",
    method: "post",
    response: () => {
      return {
        code: 200,
        info:"登录成功！",
        accessToken:"eyJhbGciOiJIUzUxMiJ9",
        data: {
          username:"admin",
          password:"123456"
        }
      };
    }
  }
] as MockMethod[];
