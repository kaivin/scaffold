// 菜单国际化配置

// element-plus国际化
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

// 导航菜单配置
export const menusConfig = {
  zh: {
    message: {
      hshome: "首页",
      hsdemo: "测试页面",
      hserror: "错误页面",
      hsfourZeroFour: "404",
      hsfourZeroOne: "401",
      hsmenus: "多级菜单",
      hsmenu1: "菜单1",
      "hsmenu1-1": "菜单1-1",
      "hsmenu1-2": "菜单1-2",
      "hsmenu1-2-1": "菜单1-2-1",
      "hsmenu1-2-2": "菜单1-2-2",
      "hsmenu1-3": "菜单1-3",
      hsmenu2: "菜单2",
      hstabs:"标签页操作",
    }
  },
  en: {
    message: {
      hshome: "Home",
      hsdemo: "Demo Page",
      hserror: "Error Page",
      hsfourZeroFour: "404",
      hsfourZeroOne: "401",
      hsmenus: "MultiLevel Menu",
      hsmenu1: "Menu1",
      "hsmenu1-1": "Menu1-1",
      "hsmenu1-2": "Menu1-2",
      "hsmenu1-2-1": "Menu1-2-1",
      "hsmenu1-2-2": "Menu1-2-2",
      "hsmenu1-3": "Menu1-3",
      hsmenu2: "Menu2",
      hstabs:"Tabs Operate",
    }
  }
};

// 按钮配置
export const buttonConfig = {
  zh: {
    message: {
      hsLoginOut: "退出系统",
      hsfullscreen: "全屏",
      hsexitfullscreen: "退出全屏",
      hslogin: "登陆",
      hsunfold: "点击展开",
      hsfold: "点击折叠",
      hssystemSet: "打开项目配置",
      hsSwitchOn:"开",
      hsSwitchOff:"关",
      hsrefreshRoute: "刷新路由",
      hsreload: "重新加载",
      hscloseCurrentTab: "关闭当前标签页",
      hscloseLeftTabs: "关闭左侧标签页",
      hscloseRightTabs: "关闭右侧标签页",
      hscloseOtherTabs: "关闭其他标签页",
      hscloseAllTabs: "关闭全部标签页"
    }
  },
  en: {
    message: {
      hsLoginOut: "loginOut",
      hsfullscreen: "fullScreen",
      hsexitfullscreen: "exitFullscreen",
      hslogin: "login",
      hsunfold: "unfold",
      hsfold: "fold",
      hssystemSet: "Open ProjectConfig",
      hsSwitchOn:"Y",
      hsSwitchOff:"N",
      hsrefreshRoute: "Refresh Route",
      hsreload: "Reload",
      hscloseCurrentTab: "Close Current Tab",
      hscloseLeftTabs: "Close Left Tabs",
      hscloseRightTabs: "Close Right Tabs",
      hscloseOtherTabs: "Close Other Tabs",
      hscloseAllTabs: "Close All Tabs"
    }
  }
};

// 登录验证配置
export const loginConfig = {
  zh: {
    message: {
      hsUsernamePlaceholder: "请输入用户名",
      hsPasswordPlaceholder: "请输入密码",
      hsPasswordRequired: "密码长度必须不小于6位",
    }
  },
  en: {
    message: {
      hsUsernamePlaceholder: "Please enter user name",
      hsPasswordPlaceholder: "Please enter the password",
      hsPasswordRequired: "Password length must not be less than 6 digits",
    }
  }
};

// 全局配置
export const settingsConfig = {
  zh: {
    message: {
      hsTitle:"脚手架",
      hsSettingPanelTitle:"项目配置",
      hsCloseSettingPanel:"关闭配置",
      hsInterfaceTitle:"界面显示",
      hsGreyTitle:"灰色模式",
      hsColorWeaknessTitle:"色弱模式",
      hsSidebarLogoTitle:"侧边栏Logo",
      hsClearCookieBackLogin:"清空缓存并返回登录页",
      hsTagsTitle:"标签栏设置",
      hsTagsPane:"标签栏隐藏",
      hsTagsCache:"标签持久化",
      hsTagsPageCache:"标签页持久化",
      hsTagsStyleMode:"标签风格",
      hsTagsStyleCard:"卡片",
      hsTagsStyleSmart:"灵动",
      hsFrameTitle:"框架风格",
      hsLeftRightLayout:"左右布局模式",
      hsTopBottomLayout:"上下布局模式",
      hsTopLeftRightLayout:"上左右布局模式",
    },
  },
  en: {
    message: {
      hsTitle:"Scaffold",
      hsSettingPanelTitle:"Project config",
      hsCloseSettingPanel:"Close",
      hsInterfaceTitle:"Interface show",
      hsGreyTitle:"Grey mode",
      hsColorWeaknessTitle:"Color weakness mode",
      hsSidebarLogoTitle:"Sidebar logo",
      hsClearCookieBackLogin:"Clear cache and return to login",
      hsTagsTitle:"Tab bar settings",
      hsTagsPane:"Tab bar hidden",
      hsTagsCache:"Tab cache",
      hsTagsPageCache:"Tab page cache",
      hsTagsStyleMode:"Tab style",
      hsTagsStyleCard:"Card",
      hsTagsStyleSmart:"Smart",
      hsFrameTitle:"Frame style",
      hsLeftRightLayout:"Left and right layout",
      hsTopBottomLayout:"Top and bottom layout",
      hsTopLeftRightLayout:"Top left and right layout",
    },
  },
};

// 表单占位文案配置
export const placeholderConfig = {
  zh: {
    message: {
      hsDatePlaceholder: "选择日期",
    }
  },
  en: {
    message: {
      hsDatePlaceholder: "Pick a day",
    }
  }
};

const localesList = [menusConfig, buttonConfig, settingsConfig,loginConfig,placeholderConfig];

export const localesConfigs = {
  zh: {
    message: Object.assign({}, ...localesList.map(v => v.zh.message)),
    ...zhLocale
  },
  en: {
    message: Object.assign({}, ...localesList.map(v => v.en.message)),
    ...enLocale
  }
};
