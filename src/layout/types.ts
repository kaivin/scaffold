export const routerArrays: Array<RouteConfigs> = [
  {
    path: "/",
    parentPath: "/",
    meta: {
      title: "首页",
      icon: "el-icon-s-home",
      showLink: true
    }
  }
];
export type RouteConfigs = {
  path?: string;
  parentPath?: string;
  meta?: {
    title?: string;
    icon?: string;
    showLink?: boolean;
    savedPosition?: boolean;
  };
  name?: string;
};
export type childrenType = {
  path?: string;
  noShowingChildren?: boolean;
  children?: childrenType[];
  value: unknown;
  meta?: {
    icon?: string;
    isComponent?:boolean;
    title?: string;
    extraIcon?: {
      svg?: boolean;
      name?: string;
    };
  };
  showTooltip?: boolean;
};
