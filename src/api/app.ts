import { http } from "../utils/http";

// 登录
export const getNoticeData = (data: object) => {
  return http.request("post", "/noticeData", data);
};
