import { http } from "../utils/http";

// 登录
export const getLogin = (data: object) => {
  return http.request("post", "/login", data);
};
