
export const routerArrays: Array<RouteConfigs> = [
  {
    path: "/",
    parentPath: "/",
    meta: {
      title: "message.hshome",
      i18n: true,
      icon: "fa-house-damage",
      showLink: true
    }
  }
];

export type RouteConfigs = {
  path?: string;
  parentPath?: string;
  meta?: {
    title?: string;
    i18n?: boolean;
    icon?: string;
    showLink?: boolean;
    savedPosition?: boolean;
    realPath?: string;
  };
  children?: RouteConfigs[];
  name?: string;
};

export type tagsViewsType = {
  icon: string;
  text: string;
  divided: boolean;
  disabled: boolean;
  show: boolean;
};

export type childrenType = {
  path?: string;
  noShowingChildren?: boolean;
  children?: childrenType[];
  value: unknown;
  meta?: {
    icon?: string;
    isComponent?:boolean;
    i18n?:boolean,
    title?: string;
    realPath?: string;
    extraIcon?: {
      svg?: boolean;
      name?: string;
    };
  };
  showTooltip?: boolean;
};
export type themeColorsType = {
  rgb: string;
  themeColor: string;
};