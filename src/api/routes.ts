import { http } from "../utils/http";

export const getAsyncRoutes = (data?: object) => {
  return http.request("post", "/getAsyncRoutes", data);
};
