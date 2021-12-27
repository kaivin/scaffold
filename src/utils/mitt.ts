import type { Emitter } from "mitt";
import mitt from "mitt";

type Events = {
  openPanel:string;
  logoChange: boolean;
  changLayoutRoute: {
    indexPath: string;
    parentPath: string;
  };
  tagViewsChange:boolean;
};

export const emitter: Emitter<Events> = mitt<Events>();