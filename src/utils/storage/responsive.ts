// 响应式storage
import { App } from "vue";
import Storage from "responsive-storage";

export const injectResponsiveStorage = (app: App, config: ServerConfigs) => {
  const configObj = Object.assign(
    {
      // 国际化 默认中文zh
      locale: {
        type: Object,
        default: Storage.getData(undefined, "locale") ?? {
          locale: config.Locale ?? "zh"
        }
      },
      sets: {
        type: Object,
        default: Storage.getData(undefined, "sets") ?? {
          grey: config.Grey ?? false,
          weak: config.Weak ?? false,
          sidebarLogo: config.SidebarLogo ?? true,
        }
      },
      tagSetting: {
        type: Object,
        default: Storage.getData(undefined, "tagSetting") ?? {
          hideTabs: config.HideTabs ?? false,
          multiTagsCache: config.MultiTagsCache ?? false,
          keepAlive: config.KeepAlive ?? true,
          tagStyleMode:config.TagStyleMode??"card"
        }
      },
      // 框架布局
      layout: {
        type: Object,
        default: Storage.getData(undefined, "layout") ?? {
          frame: config.Frame ?? "leftRight",
          theme: config.Theme ?? "default"
        }
      },
    },
    {
      tags: {
        type: Array,
        default: Storage.getData(undefined, "tags") ?? [
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
        ]
      }
    }
  );
  app.use(Storage, configObj);
};
