
declare type Recordable<T = any> = Record<string, T>;
declare interface ImportMetaEnv extends ViteEnv {
  __: unknown;
}
declare interface ViteEnv {
  VITE_PORT: number;
  VITE_OUTDIR: string;
  VITE_PUBLIC_PATH: string;
  VITE_PROXY_DOMAIN: string;
  VITE_PROXY_DOMAIN_REAL: string;
}
declare interface ServerConfigs {
  Version?: string;
  Title?: string;
  Locale?: string;
  Grey?: boolean;
  Weak?: boolean;
  SidebarLogo?:boolean;
  HideTabs?:boolean;
  MultiTagsCache?:boolean;
  KeepAlive?:boolean;
  HiddenSideBar?:boolean;
  TagStyleMode?:string;
  Frame?: string;
  Theme?: string;
}
