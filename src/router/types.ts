﻿import { RouteLocationNormalized } from "vue-router";

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    keepAlive: boolean;
    realPath: string;
    i18n: boolean;
    title: string;
  };
}
